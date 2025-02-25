const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// Register User
const registerUser = async (req, res) => {
    const { customerName, customerEmailId, contactNumber, password, gender, dateOfBirth, address } = req.body;

    try {
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

        await newUser.save();
        res.status(201).json({ message: "User Registered Successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { customerEmailId, password } = req.body;

    try {
        const user = await User.findOne({ customerEmailId });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        res.status(200).json({ message: "Login Successful", customerId: user._id });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

const updateProfile = async (req, res) => {
    const { customerName, contactNumber, gender, dateOfBirth, address } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
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

module.exports = { registerUser, loginUser, updateProfile };
