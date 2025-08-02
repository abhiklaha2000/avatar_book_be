const express =  require('express');
const { TrasactionController } = require('../controllers/Transaction.Controller');
const transaction_router = new express.Router();

transaction_router.get('/avatar_book/user/transaction/:unique_id', TrasactionController.getUserTransaction);
transaction_router.post('/avatar_book/user/transaction', TrasactionController.createUserTransacton);

module.exports = transaction_router;
