const Razorpay = require("razorpay");
const Order = require("../models/Order");

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