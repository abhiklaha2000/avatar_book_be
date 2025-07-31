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
    }
}, {
    timestamps: true,
});


// Create the FormResponse model
const User = mongoose.model('User', UserSchema);

module.exports = User;