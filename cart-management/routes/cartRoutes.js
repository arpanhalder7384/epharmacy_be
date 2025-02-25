const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// Add Medicine to Cart
router.post("/add-medicine/:medicineId/customer/:customerId", cartController.addToCart);

// Get Customer's Cart
router.get("/medicines/customer/:customerId", cartController.getCart);

// Update Medicine Quantity
router.put("/update-quantity/medicine/:medicineId/customer/:customerId", cartController.updateQuantity);

module.exports = router;
