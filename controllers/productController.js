const Product = require("../models/Product");
const mongoose = require("mongoose");


exports.getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      minRating,
      q,
      sort = "latest", // newest, price-low, price-high, rating
    } = req.query;

    const filter = {};

    // Category filter
    if (category) filter.category = category;

    // Price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (minRating) filter.rating = { $gte: Number(minRating) };

    // Search query
    if (q) {
      const regex = new RegExp(q, "i"); // case-insensitive
      filter.$or = [
        { name: regex },
        { description: regex },
      ];
    }

    // Sorting logic
    const sortOption = {
      latest: { createdAt: -1 },
      "price-low": { price: 1 },
      "price-high": { price: -1 },
      rating: { rating: -1 },
    }[sort] || { createdAt: -1 };

    // Run queries in parallel for performance
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (err) {
    console.error("Get Products Error:", err);
    next(err);
  }
};


exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Handle invalid MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (err) {
    console.error("Get Product ID Error:", err);
    next(err);
  }
};


// CREATE PRODUCT (Admin only)
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    next(error);
  }
};


// UPDATE PRODUCT (Admin only)
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    next(error);
  }
};


// DELETE PRODUCT (Admin only)
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);
    next(error);
  }
};
