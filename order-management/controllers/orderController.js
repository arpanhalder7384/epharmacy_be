const Order = require('../models/Order');
const Payment = require('../models/Payment');

exports.placeOrder = async (req, res) => {
    try {
        const { customerId, deliveryAddress, card, orderValueBeforeDiscount } = req.body;
        
        if (!customerId || !deliveryAddress || !card || !orderValueBeforeDiscount) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Process Payment
        const newPayment = new Payment({
            customerId,
            cardId: card.cardId,
            nameOnCard: card.nameOnCard,
            cardType: card.cardType,
            cvv: card.cvv,
            expiryDate: card.expiryDate,
            amountPaid: orderValueBeforeDiscount
        });

        await newPayment.save();

        // Create Order after successful payment
        const newOrder = new Order({ customerId, deliveryAddress, card, orderValueBeforeDiscount });
        await newOrder.save();
        
        res.status(201).json({ message: "Payment successful and Order placed", order: newOrder, payment: newPayment });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

