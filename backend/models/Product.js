const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price must be positive']
    },
    originalPrice: {
      type: Number,
      default: null
    },
    description: {
      type: String,
      required: [true, 'Please provide product description']
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    imageUrl: {
      type: String,
      default: '/asset/Blazer.png'
    },
    images: {
      type: [String],
      default: []
    },
    isNewProduct: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String,
      default: ''
    },
    colors: {
      type: [
        {
          name: String,
          hex: String
        }
      ],
      default: []
    },
    sizes: {
      type: [
        {
          size: String,
          inStock: { type: Boolean, default: true }
        }
      ],
      default: []
    },
    details: {
      type: [String],
      default: []
    },
    shippingInfo: {
      type: String,
      default: 'Complimentary shipping on orders over $300. Returns accepted within 30 days.'
    },
    stock: {
      type: Number,
      default: 25,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
