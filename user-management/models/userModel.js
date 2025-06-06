const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
    address: String,
    city: String,
    state: String,
    pincode: String,
    country:String,
});

const UserSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerEmailId: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String },
    dateOfBirth: { type: Date },
    address: AddressSchema,
});

module.exports = mongoose.model("User", UserSchema);

