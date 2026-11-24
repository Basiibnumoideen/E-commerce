const mongoose = require('mongoose');
const Product = require('../models/Product');

/**
 * @desc    Get all products with optional ?category= and ?maxPrice= filters
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res, next) => {
  try {
    const { category, maxPrice, search } = req.query;
    const filter = {};

    // Filter by category (optional)
    if (category && category.trim() !== '' && category.toLowerCase() !== 'all') {
      filter.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
    }

    // Filter by maxPrice (optional)
    if (maxPrice !== undefined && maxPrice !== '') {
      const numericMaxPrice = Number(maxPrice);
      if (!isNaN(numericMaxPrice)) {
        filter.price = { $lte: numericMaxPrice };
      }
    }

    // Optional text search filter across name, category, and description
    if (search && search.trim() !== '') {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter).sort({ id: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      filters: {
        category: category || null,
        maxPrice: maxPrice ? Number(maxPrice) : null,
        search: search || null
      },
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID (supports Mongo _id and numeric id)
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    // Check if valid Mongo ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }

    // If not found or not ObjectId, try numeric ID
    if (!product && !isNaN(Number(id))) {
      product = await Product.findOne({ id: Number(id) });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        error: `Product with ID '${id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private / Admin
 */
const createProduct = async (req, res, next) => {
  try {
    const {
      id,
      name,
      category,
      price,
      originalPrice,
      description,
      rating,
      reviewsCount,
      imageUrl,
      images,
      isNewProduct,
      tag,
      colors,
      sizes,
      details,
      shippingInfo,
      stock
    } = req.body;

    if (!name || !category || price === undefined || !description) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, category, price, and description'
      });
    }

    // Auto-generate numeric id if not provided
    let assignedId = id;
    if (!assignedId) {
      const highestIdProduct = await Product.findOne().sort({ id: -1 });
      assignedId = highestIdProduct && highestIdProduct.id ? highestIdProduct.id + 1 : 1;
    }

    const product = await Product.create({
      id: assignedId,
      name,
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      description,
      rating: rating ? Number(rating) : 4.8,
      reviewsCount: reviewsCount ? Number(reviewsCount) : 0,
      imageUrl: imageUrl || '/asset/Blazer.png',
      images: Array.isArray(images) && images.length > 0 ? images : [imageUrl || '/asset/Blazer.png'],
      isNewProduct: isNewProduct || false,
      tag: tag || '',
      colors: colors || [],
      sizes: sizes || [],
      details: details || [],
      shippingInfo: shippingInfo || 'Complimentary shipping on orders over $300. Returns accepted within 30 days.',
      stock: stock !== undefined ? Number(stock) : 25
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing product
 * @route   PUT /api/products/:id
 * @access  Private / Admin
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }

    if (!product && !isNaN(Number(id))) {
      product = await Product.findOne({ id: Number(id) });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        error: `Product with ID '${id}' not found`
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private / Admin
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }

    if (!product && !isNaN(Number(id))) {
      product = await Product.findOne({ id: Number(id) });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        error: `Product with ID '${id}' not found`
      });
    }

    await Product.findByIdAndDelete(product._id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      deletedId: product._id
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
