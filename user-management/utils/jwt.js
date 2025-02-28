const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Use environment variable

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role }, 
    SECRET_KEY,
    { expiresIn: "2h" } // Token expires in 2 hours
  );
};

// Middleware to verify JWT Token
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or Expired Token" });
  }
};

module.exports = { generateToken, authenticateToken };
