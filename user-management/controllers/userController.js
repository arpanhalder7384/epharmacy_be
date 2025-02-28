const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");

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
        const token = generateToken(newUser);

        await newUser.save();
        res.status(201).json({ message: "User Registered Successfully", token });
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
        const token = generateToken(user);
        res.status(200).json({ message: "Login Successful", token });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" });
    }
};

const updateProfile = async (req, res) => {
    const { customerName, contactNumber, gender, dateOfBirth, address } = req.body;
    const customerEmailId = req.body.customerEmailId;

    try { 
        const user = await User.findOne({customerEmailId:customerEmailId});
        if (!user) return res.status(404).json({ message: "User not found" });

        user.customerName = customerName || user.customerName;
        user.contactNumber = contactNumber || user.contactNumber;
        user.gender = gender || user.gender;
        user.dateOfBirth = dateOfBirth || user.dateOfBirth;
        user.address = address || user.address;

        await user.save();
        res.status(200).json({ message: "Profile Updated Successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

const updatePassword = async (req, res) => {
    const { oldPassword, newPassword, customerEmailId } = req.body;
    if (!customerEmailId || !newPassword || !oldPassword) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try { 
        const user = await User.findOne({customerEmailId:customerEmailId});

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(404).json({ message: "User not found" });
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword|| user.password;

        await user.save();
        res.status(200).json({ message: "Profile Updated Successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { registerUser, loginUser, updateProfile, updatePassword };
