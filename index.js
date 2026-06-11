const express = require("express");
const dotenv = require("dotenv");
const dns = require("dns");

const authRoutes = require("./routes/authRoutes");
const helloRoutes = require("./routes/helloRoutes");
const connectDB = require("./config/db");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

// Connect DB
connectDB()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
    process.exit(1);
  });

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", helloRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Server Running");
});

// Start server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});