const express =  require('express');
const { UserController } = require('../controllers/User.Controller');
const user_router = new express.Router();

user_router.get('/avatar_book/user/:user_id', UserController.getUserSubscription);
user_router.post('/avatar_book/user/register', UserController.registerUser);
user_router.post('/avatar_book/user/login', UserController.loginUser);
user_router.post('/avatar_book/create-payment-intent', UserController.createPaymentIntent);
user_router.patch('/avatar_book/user/:user_id/subscription', UserController.patchUserSubscription);

module.exports = user_router;
