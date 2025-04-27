const Payment = require('../models/Payment');
const Card = require('../models/Card');

exports.makePayment = async (req, res) => {
    try {
        const { cardId, nameOnCard, cardType, cvv, expiryDate, customerId } = req.body;
        const { amountToPay } = req.params;
        console.log("HERE+_+", req.body)
        if (!cardId || !nameOnCard || !cardType || !cvv || !expiryDate || !customerId || !amountToPay) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        if (cardId.length !== 16 || cvv.length !== 3) {
            return res.status(400).json({ message: "Invalid card details" });
        }
        const card = await Card.find({ cardId: cardId, cvv: cvv, customerId:customerId });

        // Add new card
        if (card.length===0) {
            const newCard = new Card({ cardId, nameOnCard, cardType, cvv, expiryDate, customerId });
            await newCard.save();
        }

        const newPayment = new Payment({ cardId, nameOnCard, cardType, cvv, expiryDate, customerId, amountPaid: amountToPay })
        await newPayment.save();
        res.status(201).json({ message: "Payment successful" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.viewCards = async (req, res) => {
    try {
        const { customerId } = req.params;
        console.log(customerId)
        const cards = await Card.find({ "customerId": customerId });

        // console.log(cards, customerId)

        if (!cards.length) {
            return res.status(400).json({ message: "No cards found for this customer." });
        }

        res.status(200).json({ cards });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.addCard = async (req, res) => {
    try {
        const { cardId, nameOnCard, cardType, cvv, expiryDate, customerId } = req.body;

        if (cardId.length !== 16 || cvv.length !== 3) {
            return res.status(400).json({ message: "Invalid card details" });
        }

        const cards = await Card.find({ "cardId": cardId });

        if (cards.length) {
            return res.status(400).json({ message: "Card already present" });
        }

        if (!cardId || !nameOnCard || !cardType || !cvv || !expiryDate || !customerId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newCard = new Card({ cardId, nameOnCard, cardType, cvv, expiryDate, customerId });

        await newCard.save();
        res.status(201).json({ message: "Card added successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
