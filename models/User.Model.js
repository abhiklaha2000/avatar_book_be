const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        default: "",
        unique: true,
        required: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    password: {
        type: String,
        default: "",
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'deleted'],
        default: 'active' // optional, if you want a default value
    },
    plan: {
        type: String,
        enum: ['monthly', 'yearly', 'none'],
        default: 'none',
    },
    plan_start_date: {
        type: Date, // Use Date type instead of enum for actual dates
        default: null,
    },
    plan_end_date: {
        type: Date,
        default: null,
    },
    is_subscription: {
        type: Boolean,
        default: false, // Boolean should not be a string
    },
    invoice_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        required: false // Optional, if you want to link to a payment
    }
}, {
    timestamps: true,
});


// Create the FormResponse model
const User = mongoose.model('User', UserSchema);

module.exports = User;