const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User.Model');
require('dotenv').config();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const moment = require("moment");

class UserController{

/**
 * Function to create a new user for the avatar book
 * @param {*} req 
 * @param {*} res 
 */    
static async registerUser(req,res){
   try{
    console.log("register calll")
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // make the payload
        const user_payload = {
            ...req.body,
            password: hashedPassword
        }        

        // save the user to the database 
        await UserModel.create(user_payload);

        // remove the password in return 
        const {password:_ , ...rest} = user_payload;

        res.status(201).json({ message: "User registered successfully",success:true, user: rest });
   }catch(err){
         console.error("Error in registerUser:", err);
         res.status(500).json({ error: "Internal Server Error", success:false });
   }
}

/**
 * Function to login a user
 */
static async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      // 1. Check if the user exists
      const user = await UserModel.findOne({email});

      if (!user) {
        return res.status(404).json({ error: "User not found", success: false });
      }

      // 2. Compare passwords using bcrypt
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials", success: false });
      }
      console.log("user---", user)

      console.log("process.env.JWT_SECRET---", process.env.JWT_SECRET)

      // 3. Generate JWT token
      const token = jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" } // Token valid for 7 days
      );

      return res.status(200).json({
        message: "Login successful",
        success: true,
        token,
      });
    } catch (err) {
      console.error("Error in loginUser:", err);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  }


 /**
  * Function to create a payment intent for stripe
  */ 
 static async createPaymentIntent(req,res){
   try {
    const { amount, currency , plan} = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true, // This enables support for various payment methods (cards, wallets, etc.)
      },
    });
    console.log("PaymentIntent created:", paymentIntent);

    // update the database user with the start d

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
 }

 /**
  * Function to update the user subscription in the User Model
  */
 static async patchUserSubscription(req,res){
  try{
     // get the user_id and the plan from the request 
     // if the plan is one_month the calculate the plan_start_date and plan_end_date
     // and update the data in the User Model
      const { user_id} = req.params;
      const { plan } = req.body;

      if (!user_id || !plan) {
        return res.status(400).json({ error: "user_id and plan are required", success: false });
      }

      if (!['monthly', 'yearly', 'none'].includes(plan)) {
        return res.status(400).json({ error: "Invalid plan", success: false });
      }

      let plan_start_date = null;
      let plan_end_date = null;
      let is_subscription = false;

      if (plan === 'monthly') {
        plan_start_date = moment().toDate();
        plan_end_date = moment().add(1, 'month').toDate();
        is_subscription = true;
      } else if (plan === 'yearly') {
        plan_start_date = moment().toDate();
        plan_end_date = moment().add(1, 'year').toDate();
        is_subscription = true;
      } else if (plan === 'none') {
        is_subscription = false;
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
        {_id: user_id},
        {
          plan,
          plan_start_date,
          plan_end_date,
          is_subscription
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found", success: false });
      }

      res.status(200).json({
        message: "User subscription updated successfully",
        success: true,
        data: updatedUser
      });


  }catch(err){
    console.error("Error in patchUserSubscription:", err);
    res.status(500).json({ error: "Internal Server Error", success: false });
 }

 }

 /**
  * Function to get the user subscription details
  */
  static async getUserSubscription(req, res) {
    try {
      const { user_id } = req.params;

      if (!user_id) {
        return res.status(400).json({ error: "user_id is required", success: false });
      }

      const user = await UserModel.findById({_id: user_id});

      if (!user) {
        return res.status(404).json({ error: "User not found", success: false });
      }

      // If there's no active subscription, return user info
      if (!user.plan_end_date || !user.is_subscription) {
        return res.status(200).json({
          message: "User has no subscription yet",
          success: true,
          data: user
        });
      }

      const currentDate = new Date();

      // Check if subscription has expired
      if (new Date(user.plan_end_date) < currentDate) {
        // Update the subscription status
        user.plan = 'none';
        user.plan_start_date = null;
        user.plan_end_date = null;
        user.is_subscription = false;

        await user.save();
      }

      return res.status(200).json({
        message: "User subscription info fetched",
        success: true,
        data: user
      });

    } catch (err) {
      console.error("Error in getUserSubscription:", err);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  }
}


module.exports = {UserController};