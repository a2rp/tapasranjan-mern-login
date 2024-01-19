const express = require("express");
const app = express();
const dbConnect = require("./src/utilities/dbConnect")
const routes = require("./src/routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    // origin: ["http://localhost:3000"],
    // origin: "*",
    credentials: true,
}));

dbConnect();

app.get("/test", (req, res) => {
    res.json({ success: true, message: "a2rp: an Ashish Ranjan presentation" });
});
app.use("/api/v1", routes);


const PORT = process.env.PORT || 8911;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

