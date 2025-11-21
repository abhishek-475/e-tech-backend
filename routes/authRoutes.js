const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUser,
  logoutUser
} = require("../controllers/authController");

const { protect } = require("../middlewares/authMiddleware");

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected User Routes
router.get("/me", protect, getUserProfile);
router.put("/update", protect, updateUser);
router.post("/logout", protect, logoutUser);

module.exports = router;
