const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User.Model');
require('dotenv').config();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const PaymentModel = require('../models/Transaction.Model');
const { verifyLoginToken } = require('../helpers/utils');


class TrasactionController{

/**
 * Function to create a new user for the avatar book
 * @param {*} req 
 * @param {*} res 
 */    
static async createUserTransacton(req, res) {
  try {
    const { amount, plan } = req.body;

    if (!amount || !plan) {
      return res.status(400).json({ error: "Missing required fields", success: false });
    }

    const newPayment = new PaymentModel({
      amount,
      plan,
    });

    await newPayment.save();

    res.status(201).json({
      message: "Transaction created successfully",
      success: true,
      data: newPayment
    });

  } catch (err) {
    console.error("Error in createUserTransaction:", err);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
}

/**
 * Function to get the transaction details of a user
 */
static async getUserTransaction(req,res){
    try{

      const { unique_id } = req.params;
      if(!unique_id) {
        return res.status(400).json({ error: "Unique ID is required", success: false });
      }
      // get the transaction details
      const transaction = await PaymentModel.findOne({_id: unique_id });
      if(!transaction){
        return res.status(404).json({ error: "Transaction not found", success: false });
      }
      return res.status(200).json({
        message: "Transaction details fetched successfully",
        success: true,
        data: transaction
      });

    }catch(err){
        console.error("Error in getUserTransaction:", err);
        res.status(500).json({ error: "Internal Server Error", success: false });
    }
}

}


module.exports = {TrasactionController};