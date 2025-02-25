const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    customerId: { type: String, required: true },
    cardId: { type: String, required: true },
    nameOnCard: { type: String, required: true },
    cardType: { type: String, enum: ["DEBIT", "CREDIT"], required: true },
    cvv: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    amountPaid: { type: Number, required: true },
    paymentStatus: { type: String, default: "SUCCESS" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', PaymentSchema);
