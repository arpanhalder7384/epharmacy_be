const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const consul = require('consul')();

// Register User
const registerUser = async (req, res) => {
    const { customerName, customerEmailId, contactNumber, password, gender, dateOfBirth, address } = req.body;

    try {

        if (!customerName || !customerEmailId || !password || !gender || !address || !dateOfBirth || !contactNumber) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const existingUser = await User.findOne({ customerEmailId });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            customerName,
            customerEmailId,
            contactNumber,
            password: hashedPassword,
            gender,
            dateOfBirth,
            address
        });
        const token = generateToken(newUser)

        const customerData = await newUser.save();
        console.log(customerData._id, "data+_+")
        res.status(201).json({ message: "User Registered Successfully", token, customerId: customerData._id });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { customerEmailId, password } = req.body;

    try {
        if (!customerEmailId || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const user = await User.findOne({ customerEmailId });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });
        const token = generateToken(user)
        const customerdata = {
            customerId: user._id,
            customerName: user.customerName,
            customerEmailId: user.customerEmailId,
            contactNumber: user.contactNumber,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth
        }
        res.status(200).json({ message: "The customer authentication successful.", token, customerdata });
    } catch (error) {
        res.status(500).json({ message: "The email address or password is incorrect." });
    }
};

const updateProfile = async (req, res) => {
    const { customerName, contactNumber, gender, dateOfBirth, address } = req.body;
    const userId = req.params.customerId;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.customerName = customerName || user.customerName;
        user.contactNumber = contactNumber || user.contactNumber;
        user.gender = gender || user.gender;
        user.dateOfBirth = dateOfBirth || user.dateOfBirth;
        user.address = address || user.address;

        await user.save();
        res.status(200).json({ message: "Profile Updated Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

const updatePassword = async (req, res) => {
    console.log("Update Pass")
    const { oldPassword, newPassword } = req.body;
    const userId = req.body.customerId;
    if (!userId || !newPassword || !oldPassword) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(404).json({ message: "Password not matching" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword || user.password;

        await user.save();
        res.status(200).json({ message: "Password Updated Successfully"});
    } catch (error) {
        res.status(500).json({ message: "Server Error ", error });
    }
};


module.exports = { registerUser, loginUser, updateProfile, updatePassword };