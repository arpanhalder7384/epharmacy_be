const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    customerId: { 
        type: String, 
        required: true 
    },
    items: [
        {
            medicineId: { 
                type: String, 
                required: true 
            },
            medicineName: { 
                type: String, 
                required: true 
            },
            manufacturer: { 
                type: String, 
                required: true 
            },
            price: { 
                type: Number, 
                required: true 
            },
            discountPercent: {
                type: Number,
                default: 0
            },
            quantity: { 
                type: Number, 
                required: true,
            },
            expiryDate: {
                type: Date,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Cart", CartSchema);
