const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "4BLgN3)7~oEu8SKz6p8K";
const auth = require("../middlewares/auth.middleware");

router.post("/register", async (req, res) => {
    try {
        res.cookie("token", "", { httpOnly: true, expiresIn: new Date(0) });

        const { fullName, email, password, passwordVerify } = req.body;
        console.log(fullName, email, password, passwordVerify);

        if (!fullName || !email || !password || !passwordVerify) {
            return res.json({ success: false, message: "Please enter all required fields." });
        }

        const fullNameRegex = /[^a-zA-Z ]/ig;
        const value = fullName.replace(fullNameRegex, "").slice(0, 30);
        if (value.length < 3) {
            return res.json({ success: false, message: "Min: 3 Char, Max: 30  Char, A-Za-z and space" });
        }

        const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email address." });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ success: false, message: "Password minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character required." });
        }

        if (password !== passwordVerify) {
            return res.status(400).json({ success: false, message: "Passwords do not match." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "Email already registered." });
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = new User({ fullName, email, passwordHash });
        const savedUser = await newUser.save();
        const token = jwt.sign({ user: savedUser._id }, JWT_SECRET);
        console.log(token, "token");
        res.cookie("token", token, { httpOnly: true });
        res.json({ success: true, message: "User added successfully." });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        res.cookie("token", "", { httpOnly: true, expiresIn: new Date(0) });
        const { email, password } = req.body;
        console.log(email, password, "login");

        if (!email || !password) {
            return res.json({ success: false, message: "Please enter all required fields." });
        }

        const existingUser = await User.findOne({ email });
        console.log(existingUser, "existinguse");
        if (!existingUser) {
            return res.json({ success: false, message: "Invalid email address" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        console.log(isPasswordCorrect, "isPasswordCorrect");;
        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Incorrect password" });
        }

        const token = jwt.sign({ user: existingUser._id }, JWT_SECRET);
        res.cookie("token", token, { httpOnly: true });
        res.json({ success: true, message: "Logged in successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
