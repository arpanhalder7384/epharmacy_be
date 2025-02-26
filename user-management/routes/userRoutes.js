const express = require("express");
const { registerUser, loginUser,updateProfile, updatePassword } = require("../controllers/userController");


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/updateProfile", updateProfile); 
router.put("/updatePassword", updatePassword); 

module.exports = router;
