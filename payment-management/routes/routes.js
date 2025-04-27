const express = require('express');
const { makePayment, viewCards, addCard } = require('../controllers/paymentController');
const { authenticateToken } = require('../../user-management/utils/jwt');

const router = express.Router();

router.post('/amount/:amountToPay', makePayment);
router.get('/view-cards/:customerId',authenticateToken, viewCards);
router.post('/add-card',authenticateToken, addCard);

module.exports = router;
