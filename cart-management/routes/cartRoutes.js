const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { authenticateToken } = require("../../user-management/utils/jwt");


router.post("/add-medicine/:medicineId/customer/:customerId",authenticateToken, cartController.addToCart);
router.get("/customer/:customerId", authenticateToken,cartController.getCart);
router.put("/update-quantity/medicine/:medicineId/customer/:customerId",authenticateToken, cartController.updateQuantity);
router.delete("/removeCustomer/:customerId",cartController.removeCartItemsForCustomer);

module.exports = router;
