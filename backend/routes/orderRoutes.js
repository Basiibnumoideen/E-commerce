const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Authenticated user order routes
router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);

// Admin-only order status update route
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
