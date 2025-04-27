const express = require("express");
const { registerUser, loginUser,updateProfile, updatePassword } = require("../controllers/userController");
const { authenticateToken } = require("../utils/jwt");


const router = express.Router();

router.post("/customer/register", registerUser);
router.post("/customer/login", loginUser);
router.put("/customer/updatePassword",authenticateToken, updatePassword);
router.put("/customer/:customerId",authenticateToken, updateProfile); 

module.exports = router;
