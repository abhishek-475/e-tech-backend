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

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected user routes
router.get("/me", protect, getUserProfile);
router.put("/update", protect, updateUser);
router.post("/logout", protect, logoutUser);

// **Admin routes**
router.get("/admin/users", protect, admin, getAllUsers); // GET all users
router.delete("/admin/users/:id", protect, admin, deleteUser); // DELETE user

module.exports = router;
