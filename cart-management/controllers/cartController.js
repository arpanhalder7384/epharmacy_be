const e = require("cors");
const Cart = require("../models/cartModel");
const Medicine = require("../models/medicineModel");
const User = require("../models/userModel");

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
        const medicine = await Medicine.findOne({ medicineId: req.params.medicineId });
        console.log(medicine)
        if (!medicine) {
            return res.status(400).json({ message: "Medicine not found" });
        }

        // Check if customer exists
        const customer = await User.findById(customerId);
        if (!customer) {
            return res.status(400).json({ message: "Customer not found" });
        }

        // let cart = await Cart.findOne({ customerId });
        // if (!cart) cart = new Cart({ customerId, items: [] });
        // console.log(cart)

        // const existingItem = cart.items.find(item => item.medicineId.toString() == medicineId);
        // if (existingItem) {
        //     existingItem.quantity += quantity;
        // } else {
        //     cart.items.push({ ...medicine, quantity });
        // }
        // Check if the medicine is already in the cart
        // Fetch or create cart for the customer
        let cart = await Cart.findOne({ customerId });

        if (!cart) {
            cart = new Cart({ customerId, items: [] });
        }

        // Check if the medicine is already in the cart
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

        // Save updated cart
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

        if (!cart || cart.items.length === 0) return res.status(400).json({ message: "No medicines in cart" });

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

        // Validate quantity
        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1" });
        }

        // Find the cart for the given customer
        const cart = await Cart.findOne({ "customerId":customerId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found for this customer" });
        }
        console.log(cart)

        // Find the medicine in the cart
        const medicine = cart.items.find(item => item.medicineId === medicineId);

        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found in cart" });
        }

        // Update the quantity
        medicine.quantity = quantity;

        // Save the updated cart
        await cart.save();

        return res.status(200).json({ message: "Quantity updated successfully", cart });

    } catch (error) {
        console.error("Error updating medicine quantity:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
