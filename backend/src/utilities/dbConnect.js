// require("dotenv").config();

const mongoose = require("mongoose");
const MONGODB_URI = "mongodb://localhost:27017/testDB";

const dbConnect = async () => {
    mongoose.connect(MONGODB_URI).then(() => {
        console.log("Successfully connected to MongoDB Atlas!");
    }).catch((error) => {
        console.log("Unable to connect to MongoDB Atlas!");
        console.error(error);
    });
}

module.exports = dbConnect;

