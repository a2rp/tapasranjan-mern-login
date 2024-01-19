const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    userName: { type: String, required: false },
}, { timestamps: true });

const User = mongoose.model("user", userSchema);
module.exports = User;

