const Payment = require('../models/Payment');

exports.makePayment = async (req, res) => {
    try {
        const { cardId, nameOnCard, cardType, cvv, expiryDate, customerId } = req.body;
        const { amountToPay } = req.params;

        if (!cardId || !nameOnCard || !cardType || !cvv || !expiryDate || !customerId || !amountToPay) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        if(cardId.length!==16 || ccv.length!==3){
            return res.status(400).json({ message: "Invalid card details" });
        }
        const card = await Payment.find({"customerId": customerId , cardId:cardId, cvv:cvv});

        if(!card.length){
            return res.status(400).json({ message: "Invalid Card ID / Customer ID" });
        }
        res.status(201).json({ message: "Payment successful", card:card });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.viewCards = async (req, res) => {
    try {
        const { customerId } = req.params;
        const cards = await Payment.find({"customerId": customerId });

        console.log(cards, customerId)

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

        if(cardId.length!==16 || cvv.length!==3){
            return res.status(400).json({ message: "Invalid card details" });
        }

        const cards = await Payment.find({"cardId": cardId });

        if(cards.length){
            return res.status(400).json({ message: "Card already present" });
        }

        if (!cardId || !nameOnCard || !cardType || !cvv || !expiryDate || !customerId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newCard = new Payment({ cardId, nameOnCard, cardType, cvv, expiryDate, customerId, amountPaid: 0 });

        await newCard.save();
        res.status(201).json({ message: "Card added successfully", card: newCard });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
