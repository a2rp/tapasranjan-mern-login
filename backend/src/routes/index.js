const express = require("express");
const router = express.Router();

const userRoutes = require("../controllers/user.controller");
router.use("/user", userRoutes);

module.exports = router;
