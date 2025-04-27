const express = require('express');
const { placeOrder, getOrder } = require('../controllers/orderController');
const { authenticateToken } = require('../../user-management/utils/jwt');

const router = express.Router();

router.post('/place-order', authenticateToken, placeOrder);
router.get('/get-order/:customerId', authenticateToken, getOrder);
module.exports = router;
