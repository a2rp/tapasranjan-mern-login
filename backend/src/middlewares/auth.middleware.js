const jwt = require("jsonwebtoken");
const { TOKEN_ISSUER, getJwtSecret } = require("../utilities/authToken");

const auth = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ success: false, message: "Authentication required." });
    }

    try {
        const verified = jwt.verify(token, getJwtSecret(), { issuer: TOKEN_ISSUER });
        if (typeof verified.sub !== "string") {
            return res.status(401).json({ success: false, message: "Invalid or expired session." });
        }
        req.userId = verified.sub;
        return next();
    } catch {
        return res.status(401).json({ success: false, message: "Invalid or expired session." });
    }
};

module.exports = auth;
