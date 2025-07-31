const express =  require('express');
const { UserController } = require('../controllers/User.Controller');
const user_router = new express.Router();


user_router.post('/avatar_book/user/register', UserController.registerUser);
user_router.post('/avatar_book/user/login', UserController.loginUser);


module.exports = user_router;

