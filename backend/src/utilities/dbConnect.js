// require("dotenv").config();

const mongoose = require("mongoose");

const dbConnect = async () => {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error("MONGODB_URI is required.");

    await mongoose.connect(mongoUri);
    await mongoose.model("user").init();
    console.log("Connected to MongoDB.");
};

module.exports = dbConnect;

