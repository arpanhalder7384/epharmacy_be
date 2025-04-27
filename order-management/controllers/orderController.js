const Order = require('../models/Order');
const consul = require('consul')();
const axios = require("axios");

const PAYMENT_CONSULE_ID = "paymentManagementMS"

let paymentHost = ""
let paymentPort = ""

consul.agent.service.list(function (err, result) {
    Object.filter = (results, predicate) =>
        Object.keys(results)
            .filter((key) => predicate(results[key]))
            .reduce((res, key) => ((res[key] = results[key]), res), {});

    const res = Object.filter(result, (res) => res.Service === PAYMENT_CONSULE_ID);
    paymentPort = res.Port;
    paymentHost = res.Address;
});

//Watch for change
const watcher1 = consul.watch({
    method: consul.health.service,
    options: {
        service: PAYMENT_CONSULE_ID,
        passing: true,
    },
});
watcher1.on('change', (data) => {
    if (data.length) {
        paymentDetails = data[0].Service;
        paymentPort = paymentDetails.Port;
        paymentHost = paymentDetails.Address;
    }

})

const CART_CONSULE_ID = "cartManagementMS"

let cartHost = ""
let cartPort = ""

consul.agent.service.list(function (err, result) {
    Object.filter = (results, predicate) =>
        Object.keys(results)
            .filter((key) => predicate(results[key]))
            .reduce((res, key) => ((res[key] = results[key]), res), {});

    const res = Object.filter(result, (res) => res.Service === CART_CONSULE_ID);
    cartPort = res.Port;
    cartHost = res.Address;
});

//Watch for change
const watcher2 = consul.watch({
    method: consul.health.service,
    options: {
        service: CART_CONSULE_ID,
        passing: true,
    },
});

watcher2.on('change', (data) => {
    if (data.length) {
        cartDetails = data[0].Service;
        cartPort = cartDetails.Port;
        cartHost = cartDetails.Address;
    }

});

exports.placeOrder = async (req, res) => {
    try {
        const { customerId, deliveryAddress, card, orderValue, orderDetails } = req.body;

        if (!customerId || !deliveryAddress || !card || !orderValue) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        if (orderDetails && orderDetails.length == 0) {
            return res.status(400).json({ message: "Missing orderDetails fields" });
        }
        const data = {
            customerId: customerId,
            cardId: card.cardId,
            nameOnCard: card.nameOnCard,
            cardType: card.cardType,
            cvv: card.cvv,
            expiryDate: card.expiryDate,
            amountPaid: orderValue
        }

        axios.post(`http://${paymentHost}:${paymentPort}/payment-api/amount/${orderValue}`, data).then(async (resp) => {
            // console.log(resp, "RES++")
            console.log(cartHost, cartPort)
            axios.delete(`http://${cartHost}:${cartPort}/cart-api/removeCustomer/${customerId}`).then(async (resp2) => {
                const newOrder = new Order({ customerId, deliveryAddress, card, orderValue, orderDetails });
                await newOrder.save();
            }).catch((e) => {
                return res.status(500).json({ message: "Server Error1", error: e.message });
            })

            return res.status(201).json({ message: "Payment successful and Order placed" });

        }).catch((e) => {
            // console.log("ERRO+_+", e)
            return res.status(500).json({ message: "Server Error2", error: e.message });
        })

        // Create Order after successful payment
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
exports.getOrder = async (req, res) => {
    try {
        const { customerId } = req.params;
        const orders = await Order.find({ customerId: customerId })
        if (orders.length === 0) {
            return res.status(200).json({ message: "No Order", orders: orders  });
        }

        res.status(200).json({ orders: orders });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
