const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User.Model');
require('dotenv').config();

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

      // 3. Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
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





}


module.exports = {UserController};