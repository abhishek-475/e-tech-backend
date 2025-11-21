const Razorpay = require("razorpay");
const Order = require("../models/Order");
const User = require("../models/User"); // Add this import

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;

    const order = await instance.orders.create({
      amount: amount * 100,
      currency: "INR",
    });

    res.json(order);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    const { products, totalPrice, paymentInfo } = req.body;

    // fetch user info from database
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const order = await Order.create({
      user: req.user._id,      // from token
      products,
      totalPrice,
      paymentInfo,
      mobile: user.mobile,     // use mobile from profile
      address: user.address,   // use address from profile
      isPaid: true,
      paidAt: Date.now(),
    });

    res.json(order);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Get all orders - Admin only
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email') // Populate user details
      .sort({ createdAt: -1 }); // Latest orders first

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Get orders for specific user
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Get single order by ID
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email mobile address')
      .populate('products.product', 'name price images');

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Update order status - Admin only
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    
    // If delivered, set deliveredAt timestamp
    if (status === 'delivered') {
      order.deliveredAt = Date.now();
    }
    
    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Delete order - Admin only
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Order deleted successfully"
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};