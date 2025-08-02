const express =  require('express');
const { UserController } = require('../controllers/User.Controller');
const user_router = new express.Router();

user_router.get('/avatar_book/user/:token', UserController.getUserSubscription);
user_router.post('/avatar_book/user/register', UserController.registerUser);
user_router.post('/avatar_book/user/login', UserController.loginUser);
user_router.post('/avatar_book/create-payment-intent', UserController.createPaymentIntent);
user_router.patch('/avatar_book/user/subscription', UserController.patchUserSubscription);
// transaction_router.patch('/avatar_book/user/transaction/:id', UserController.patchUserTransaction);

module.exports = user_router;
