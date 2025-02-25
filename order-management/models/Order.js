const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customerId: { type: String, required: true },
    deliveryAddress: {
        addressId: { type: String, required: true }
    },
    card: {
        cardId: { type: String, required: true },
        cvv: { type: String, required: true },
        customerId: { type: String, required: true }
    },
    orderValueBeforeDiscount: { type: Number, required: true },
    orderStatus: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
