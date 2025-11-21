const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderConroller');
const { protect, admin } = require('../middlewares/authMiddleware');

// Public routes
router.post('/razorpay', protect, createRazorpayOrder);

// User routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/:id', protect, getOrderById);

// Admin routes
router.get('/', protect, admin, getAllOrders);
router.put('/:id', protect, admin, updateOrderStatus);
router.delete('/:id', protect, admin, deleteOrder);

module.exports = router;