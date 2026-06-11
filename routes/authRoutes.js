const express = require("express");

const {
    registerUser,
    loginUser,
    getProfile,
    createProfile,
    getUserProfile,
    updateProfile,
    deleteProfile
} = require("../controller/authcontroller");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// AUTH ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);

// PROFILE ROUTES (PROTECTED)
router.post("/profile", protect, createProfile);
router.get("/profile", protect, getUserProfile);
router.put("/profile/:id", updateProfile);

// OPTIONAL: USER BASIC PROFILE
router.get("/me", protect, getProfile);

//delete profile 
router.delete("/profile/:id", protect, deleteProfile);

module.exports = router;