const e = require("cors");
const Cart = require("../models/cartModel");
const consul = require('consul')();
const axios = require("axios");

//Local var for medicine data
let medicineDetails = {};
let medicinePort;
let medicineHost = '';


// Discover services
const MEDICINEMS_CONSULE_ID = "medicineManagementMS"

consul.agent.service.list(function (err, result) {
    // console.log(result);
    Object.filter = (results, predicate) =>
        Object.keys(results)
            .filter((key) => predicate(results[key]))
            .reduce((res, key) => ((res[key] = results[key]), res), {});

    const res = Object.filter(result, (res) => res.Service === MEDICINEMS_CONSULE_ID);
    medicinePort = res.Port;
    medicineHost = res.Address;
});

//Watch for change
const watcher1 = consul.watch({
    method: consul.health.service,
    options: {
        service: MEDICINEMS_CONSULE_ID,
        passing: true,
    },
});

watcher1.on('change', (data) => {
    if (data.length) {
        medicineDetails = data[0].Service;
        medicinePort = medicineDetails.Port;
        medicineHost = medicineDetails.Address;
    }

    console.log(medicinePort, medicineHost, "Line 38")
});

//Local var for user data
let userDetails = {};
let userPort;
let userHost = '';
const USER_CONSULE_ID = "userManagementMS"

consul.agent.service.list(function (err, result) {
    Object.filter = (results, predicate) =>
        Object.keys(results)
            .filter((key) => predicate(results[key]))
            .reduce((res, key) => ((res[key] = results[key]), res), {});

    const res = Object.filter(result, (res) => res.Service === USER_CONSULE_ID);
    userPort = res.Port;
    userHost = res.Address;
});

//Watch for change
const watcher2 = consul.watch({
    method: consul.health.service,
    options: {
        service: USER_CONSULE_ID,
        passing: true,
    },
});

watcher2.on('change', (data) => {
    if (data.length) {
        userDetails = data[0].Service;
        userPort = userDetails.Port;
        userHost = userDetails.Address;
    }

    console.log(userPort, userHost, "Line 80")
});


// Add Medicine to Cart
exports.addToCart = async (req, res) => {
    try {
        const { medicineId, customerId } = req.params;
        const { quantity } = req.body;
        // Validate quantity
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: "Invalid quantity" });
        }

        console.log(medicineId, customerId)
        let medicine;
        await axios.get(`http://${medicineHost}:${medicinePort}/medicine-api/medicines/${medicineId}`).then((res) => {
            medicine = res.data;
        }).catch((e) => {
            console.log(e)
        })
        if (!medicine) {
            return res.status(400).json({ message: "Medicine not found" });
        }

        let cart = await Cart.findOne({ customerId });

        if (!cart) {
            cart = new Cart({ customerId, items: [] });
        }

        const existingItem = cart.items.find(item => item.medicineId === medicineId);

        if (existingItem) {
            // If medicine already exists, update quantity
            existingItem.quantity += quantity;
        } else {
            // Add new medicine to cart
            cart.items.push({
                medicineId: medicineId,
                medicineName: medicine.medicineName,
                manufacturer: medicine.manufacturer,
                price: medicine.price,
                discountPercent: medicine.discountPercent,
                expiryDate: medicine.expiryDate,
                quantity
            });
        }

        await cart.save();

        return res.status(200).json({
            message: "Medicine added to cart successfully",
            cart,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error", error });
    }
};

// Get Customer's Cart
exports.getCart = async (req, res) => {
    try {
        const { customerId } = req.params;
        const cart = await Cart.findOne({ customerId }).populate("items.medicineId");

        // if (!cart || cart.items.length === 0) return res.status(400).json({ message: "No medicines in cart" });

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Update Medicine Quantity
exports.updateQuantity = async (req, res) => {
    try {
        const { customerId, medicineId } = req.params;
        const { quantity } = req.body;

        if (quantity < 0) {
            return res.status(400).json({ message: "Quantity must be at least 1" });
        }

        const cart = await Cart.findOne({ "customerId": customerId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found for this customer" });
        }
        const medicine = cart.items.find(item => item.medicineId === medicineId);

        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found in cart" });
        }

        const medicineIndex = cart.items.findIndex(item => item.medicineId.toString() === medicineId);

        if (quantity === 0) {
            // Remove the medicine from the cart
            cart.items.splice(medicineIndex, 1); // Removes the medicine at the found index

            await cart.save(); // Save the updated cart

            return res.json({ success: true, message: 'Medicine removed from cart' });
        }
        cart.items[medicineIndex].quantity = quantity;

        await cart.save();

        return res.status(200).json({ message: "Quantity updated successfully" });

    } catch (error) {
        console.error("Error updating medicine quantity:", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};

// Update Medicine Quantity
exports.removeCartItemsForCustomer = async (req, res) => {
    try {
        console.log("Line ", req)
        const {customerId}=req.params
        console.log("HERE+_+")
        // Delete all cart items for the specified customerId
        const result = await Cart.deleteMany({ customerId });

        res.status(200).json({ message: `Successfully removed all cart items for customer ID: ${customerId}` });
    } catch (error) { 
        console.error('Error removing cart items:', error);
        res.status(404).json({"message":"Not able to remove"})
    }
};
