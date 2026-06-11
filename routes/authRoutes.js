const express = require("express");

const {
    registerUser,
    loginUser,
    getProfile,
    createProfile,
    getUserProfile,
    updateProfile
} = require("../controller/authcontroller");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// AUTH ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);

// PROFILE ROUTES (PROTECTED)
router.post("/profile", protect, createProfile);
router.get("/profile", protect, getUserProfile);
router.put("/profile/:id", protect, updateProfile);

// OPTIONAL: USER BASIC PROFILE
router.get("/me", protect, getProfile);

module.exports = router;