const mongoose = require('mongoose');

const merchantOfferSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  url: { type: String, default: 'https://example.com' },
  isLowest: { type: Boolean, default: false }
});

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      index: true,
      default: () => `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    title: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      default: 'General',
      index: true
    },
    subCategory: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      default: 4.5
    },
    reviewsCount: {
      type: Number,
      default: 100
    },
    price: {
      type: Number,
      required: true,
      index: true
    },
    originalPrice: {
      type: Number,
      default: null
    },
    discount: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    galleryImages: [String],
    merchants: [merchantOfferSchema],
    specs: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    aiSummary: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Text index for fast multi-field product search
productSchema.index({ name: 'text', title: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
