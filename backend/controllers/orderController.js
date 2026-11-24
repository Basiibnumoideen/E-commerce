const mongoose = require('mongoose');
const Order = require('../models/Order');

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private (Authenticated User)
 */
const createOrder = async (req, res, next) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Order must contain at least one item'
      });
    }

    if (totalAmount === undefined || totalAmount === null || Number(totalAmount) < 0) {
      return res.status(400).json({
        success: false,
        error: 'Total amount is required and must be non-negative'
      });
    }

    // Validate item structure (name, quantity, price)
    for (const item of items) {
      if (!item.name || !item.quantity || item.price === undefined) {
        return res.status(400).json({
          success: false,
          error: 'Each item must have a name, quantity, and price'
        });
      }
    }

    const order = await Order.create({
      userId: req.user._id,
      items,
      totalAmount: Number(totalAmount),
      status: 'pending',
      shippingAddress: shippingAddress || {}
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged-in user's orders (populated with user details)
 * @route   GET /api/orders/my
 * @access  Private (Authenticated User)
 */
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private / Admin Only
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'shipped', 'delivered'];
    if (!status || !allowedStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Status must be one of: ${allowedStatuses.join(', ')}`
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        error: `Order with ID '${id}' not found`
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: `Order with ID '${id}' not found`
      });
    }

    order.status = status.toLowerCase();
    const updatedOrder = await order.save();

    // Populate user details for response
    await updatedOrder.populate('userId', 'name email role');

    res.status(200).json({
      success: true,
      message: `Order status updated to '${order.status}'`,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  updateOrderStatus
};
