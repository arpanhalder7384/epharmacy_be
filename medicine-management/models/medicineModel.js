const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  medicineName: String,
  manufacturer: String,
  category: String,
  manufacturingDate: Date,
  expiryDate: Date,
  price: Number,
  discountPercent: Number,
  stockQuantity: Number,
  medicineId:Number
});

module.exports = mongoose.model("Medicine", medicineSchema);
