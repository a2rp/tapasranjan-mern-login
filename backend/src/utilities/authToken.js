const jwt = require("jsonwebtoken");

const TOKEN_COOKIE = "token";
const TOKEN_ISSUER = "tapasranjan-mern-login";
const TOKEN_TTL_SECONDS = 60 * 60 * 12;

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error("JWT_SECRET must contain at least 32 characters.");
    }
    return secret;
}

function issueAuthToken(userId) {
    return jwt.sign({ sub: String(userId) }, getJwtSecret(), {
        expiresIn: TOKEN_TTL_SECONDS,
        issuer: TOKEN_ISSUER,
    });
}

function getCookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === "true" || process.env.NODE_ENV === "production",
        sameSite: (process.env.COOKIE_SAME_SITE || "lax").toLowerCase(),
        path: "/",
    };
}

function setAuthCookie(res, token) {
    res.cookie(TOKEN_COOKIE, token, { ...getCookieOptions(), maxAge: TOKEN_TTL_SECONDS * 1000 });
}

function clearAuthCookie(res) {
    res.clearCookie(TOKEN_COOKIE, getCookieOptions());
}

module.exports = { TOKEN_ISSUER, clearAuthCookie, getJwtSecret, issueAuthToken, setAuthCookie };
