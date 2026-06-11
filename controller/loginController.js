const bcrypt = require("bcryptjs");
const User = require("../models/user");
const generateToken = require("../config/generateToken");

const emailRegex = /^\S+@\S+\.\S+$/;

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: "A valid email address is required" });
    }

    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    user.token = token;
    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      token: user.token,
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = {
  loginUser,
};
