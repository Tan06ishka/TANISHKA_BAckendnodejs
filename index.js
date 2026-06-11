const express = require("express");
const dotenv = require("dotenv");
const dns = require("dns");
const authRoutes = require("./routes/authRoutes");
const helloRoutes = require("./routes/helloRoutes");

dns.setServers(['8.8.8.8', '8.8.4.4']);
const connectDB = require("./config/db");

dotenv.config();

connectDB().catch(err => {
    console.log("Failed to connect to MongoDB", err);
    process.exit(1);
});

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", helloRoutes);

const PORT = 5000;

app.get("/", (req, res) => {
    res.send("Server Running");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});