const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUser,
  logoutUser,
  getAllUsers,
  deleteUser
} = require("../controllers/authController");

const { protect, admin } = require("../middlewares/authMiddleware");

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected User Routes
router.get("/me", protect, getUserProfile);
router.put("/update", protect, updateUser);
router.post("/logout", protect, logoutUser);

// admin to get users

router.get("/users", protect, admin, getAllUsers);
router.delete("/users/:id", protect, admin, deleteUser);

module.exports = router;
