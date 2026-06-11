const User = require("../models/user");
const Profile = require("../models/profile");
const bcrypt = require("bcryptjs");
const generateToken = require("../config/generateToken");


// ======================
// REGISTER USER
// ======================
const registerUser = async (req, res) => {
  try {
    console.log("REGISTER REQUEST:", req.body);

    const { name, email, password } = req.body;

    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      console.log("User already exists:", normalizedEmail);

      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword
    });

    console.log("User created:", user._id);

    const token = generateToken(user._id);

    user.token = token;
    await user.save();

    console.log("Token generated for user:", user._id);

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      token: user.token
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// ======================
// LOGIN USER
// ======================
const loginUser = async (req, res) => {
  try {
    console.log("LOGIN REQUEST:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    console.log("Looking for user:", normalizedEmail);

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.log("User not found");
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Password incorrect for:", normalizedEmail);
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    console.log("Login successful:", user.email);

    const token = generateToken(user._id);

    user.token = token;
    await user.save();

    console.log("Token updated in DB for:", user.email);

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      token: user.token
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({
      message: "Server error during login"
    });
  }
};


// ======================
// GET PROFILE
// ======================
const getProfile = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email
    });

  } catch (error) {
    console.log("PROFILE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// ======================
// CREATE PROFILE (POST)
// ======================
const createProfile = async (req, res) => {
    try {
        const {
            name,
            rollNumber,
            class: className,
            department,
            teacher,
            phone
        } = req.body;

        const profile = await Profile.create({
            user: req.user._id,
            name,
            rollNumber,
            class: className,
            department,
            teacher,
            phone
        });

        res.status(201).json(profile);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// ======================
// GET PROFILE (GET)
// ======================
const getUserProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id });

        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        res.json(profile);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// ======================
// UPDATE PROFILE (PUT)
// ======================
const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const updateFields = {};

        if (req.body.name !== undefined) updateFields.name = req.body.name;
        if (req.body.rollNumber !== undefined) updateFields.rollNumber = req.body.rollNumber;
        if (req.body.class !== undefined) updateFields.class = req.body.class;
        if (req.body.department !== undefined) updateFields.department = req.body.department;
        if (req.body.teacher !== undefined) updateFields.teacher = req.body.teacher;
        if (req.body.phoneNumber !== undefined) updateFields.phone = req.body.phoneNumber;

        const profile = await Profile.findOneAndUpdate(
            { user: req.user._id, rollNumber },
            { $set: updateFields },
            { new: true }
        );

        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        res.json(profile);
    } catch (error) {
        console.error("UPDATE PROFILE ERROR:", error);
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    createProfile,
    getUserProfile,
    updateProfile
};