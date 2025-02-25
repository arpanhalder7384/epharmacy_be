const express = require('express');
const { makePayment, viewCards, addCard } = require('../controllers/paymentController');

const router = express.Router();

router.post('/amount/:amountToPay', makePayment);
router.get('/view-cards/:customerId', viewCards);
router.post('/add-card', addCard);

module.exports = router;
