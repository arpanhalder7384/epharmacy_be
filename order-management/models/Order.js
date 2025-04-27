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
    orderDetails: [
        {
            medicineId: {
                type: Number, required: true
            },
            medicineName: {
                type: String, required: true
            },
            price: {
                type: Number, required: true
            },
            quantity: {
                type: Number, required: true
            }
        }
    ],
    orderValue: { type: Number, required: true },
    orderStatus: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
