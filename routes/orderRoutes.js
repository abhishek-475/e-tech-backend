const express = require("express");
const router = express.Router();

const { createOrder } = require("../controllers/orderConroller");
const { protect } = require("../middlewares/authMiddleware");

router.post("/", protect, createOrder);

module.exports = router;
