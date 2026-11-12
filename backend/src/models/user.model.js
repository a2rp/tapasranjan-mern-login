const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    passwordHash: { type: String, required: true },
    userName: { type: String, trim: true, maxlength: 40 },
}, { timestamps: true });

const User = mongoose.model("user", userSchema);
module.exports = User;

