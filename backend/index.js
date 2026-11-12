require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dbConnect = require("./src/utilities/dbConnect");
const routes = require("./src/routes");

const app = express();
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";

app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(cors({ origin: clientOrigin, credentials: true }));

app.get("/test", (req, res) => {
    res.json({ success: true, message: "Authentication API is running." });
});
app.use("/api/v1", (req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
});
app.use("/api/v1", routes);

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found." });
});

app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    const status = error.status === 413 ? 413 : error instanceof SyntaxError ? 400 : 500;
    const message = status === 413 ? "Request body is too large." : status === 400 ? "Invalid JSON request body." : "Internal server error.";
    if (status === 500) console.error("Unhandled request error:", error);
    return res.status(status).json({ success: false, message });
});

async function startServer() {
    const port = Number(process.env.PORT || 8911);
    const jwtSecret = process.env.JWT_SECRET;
    const cookieSameSite = (process.env.COOKIE_SAME_SITE || "lax").toLowerCase();

    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error("PORT must be a valid TCP port.");
    }
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI must be configured before starting the API.");
    }
    if (!jwtSecret || jwtSecret.length < 32) {
        throw new Error("JWT_SECRET must contain at least 32 characters.");
    }
    if (!["lax", "strict", "none"].includes(cookieSameSite)) {
        throw new Error("COOKIE_SAME_SITE must be lax, strict, or none.");
    }
    if (cookieSameSite === "none" && process.env.COOKIE_SECURE !== "true" && process.env.NODE_ENV !== "production") {
        throw new Error("SameSite=None cookies require COOKIE_SECURE=true.");
    }

    await dbConnect();
    const server = app.listen(port, () => {
        console.log(`API listening on http://localhost:${port}`);
    });
    return server;
}

if (require.main === module) {
    startServer().catch((error) => {
        console.error("Unable to start API:", error.message);
        process.exitCode = 1;
    });
}

module.exports = { app, startServer };
