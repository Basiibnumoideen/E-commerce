const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Item quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: [true, 'Item price is required'],
    min: [0, 'Price must be positive']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  image: {
    type: String
  }
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    items: {
      type: [orderItemSchema],
      required: [true, 'Order must contain at least one item'],
      validate: {
        validator: function (items) {
          return Array.isArray(items) && items.length > 0;
        },
        message: 'Order items cannot be empty'
      }
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount must be positive']
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'shipped', 'delivered'],
        message: 'Status must be pending, shipped, or delivered'
      },
      default: 'pending'
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: 'India' }
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
