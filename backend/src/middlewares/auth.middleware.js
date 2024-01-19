const jwt = require("jsonwebtoken");
const JWT_SECRET = "4BLgN3)7~oEu8SKz6p8K";

const auth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        // console.log(token, "token");
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorised" });
        }
        const verified = jwt.verify(token, JWT_SECRET);
        // console.log(verified, "verified");
        req.user = verified.user;
        req.email = verified.email;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
};

module.exports = auth;
