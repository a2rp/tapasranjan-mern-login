const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const auth = require("../middlewares/auth.middleware");
const { clearAuthCookie, issueAuthToken, setAuthCookie } = require("../utilities/authToken");

const router = express.Router();
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FULL_NAME_PATTERN = /^[\p{L}][\p{L}\p{M}' -]*$/u;

function normalizeEmail(value) {
    return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function publicUser(user) {
    return {
        id: String(user._id),
        fullName: user.fullName,
        email: user.email,
        userName: user.userName || "",
    };
}

function isValidEmail(email) {
    return email.length <= 254 && EMAIL_PATTERN.test(email);
}

router.post("/register", async (req, res) => {
    const fullName = typeof req.body?.fullName === "string"
        ? req.body.fullName.trim().replace(/\s+/g, " ")
        : "";
    const email = normalizeEmail(req.body?.email);
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    const passwordVerify = typeof req.body?.passwordVerify === "string" ? req.body.passwordVerify : "";

    if (!fullName || !email || !password || !passwordVerify) {
        return res.status(400).json({ success: false, message: "Please complete all required fields." });
    }
    if (fullName.length < 2 || fullName.length > 60 || !FULL_NAME_PATTERN.test(fullName)) {
        return res.status(400).json({ success: false, message: "Enter a name between 2 and 60 letters." });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, message: "Enter a valid email address." });
    }
    if (Buffer.byteLength(password, "utf8") < 8 || Buffer.byteLength(password, "utf8") > 72) {
        return res.status(400).json({ success: false, message: "Password must be between 8 and 72 bytes." });
    }
    if (password !== passwordVerify) {
        return res.status(400).json({ success: false, message: "Passwords do not match." });
    }

    try {
        const existingUser = await User.findOne({ email }).select("_id").lean();
        if (existingUser) {
            return res.status(409).json({ success: false, message: "An account with this email already exists." });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await User.create({ fullName, email, passwordHash });
        setAuthCookie(res, issueAuthToken(user._id));
        return res.status(201).json({
            success: true,
            message: "Your account is ready.",
            user: publicUser(user),
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "An account with this email already exists." });
        }
        console.error("Registration failed:", error);
        return res.status(500).json({ success: false, message: "Unable to create your account right now." });
    }
});

router.post("/login", async (req, res) => {
    const email = normalizeEmail(req.body?.email);
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (!email || !password || !isValidEmail(email)) {
        return res.status(400).json({ success: false, message: "Enter a valid email and password." });
    }

    try {
        const user = await User.findOne({ email });
        const passwordMatches = user && await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatches) {
            return res.status(401).json({ success: false, message: "Email or password is incorrect." });
        }

        setAuthCookie(res, issueAuthToken(user._id));
        return res.json({ success: true, message: "You are signed in.", user: publicUser(user) });
    } catch (error) {
        console.error("Login failed:", error);
        return res.status(500).json({ success: false, message: "Unable to sign in right now." });
    }
});

router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("_id fullName email userName").lean();
        if (!user) {
            clearAuthCookie(res);
            return res.status(401).json({ success: false, message: "Session is no longer valid." });
        }
        return res.json({ success: true, user: publicUser(user) });
    } catch (error) {
        console.error("Session lookup failed:", error);
        return res.status(500).json({ success: false, message: "Unable to check your session right now." });
    }
});

router.post("/logout", (req, res) => {
    clearAuthCookie(res);
    return res.json({ success: true, message: "You are signed out." });
});

module.exports = router;
