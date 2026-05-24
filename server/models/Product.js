const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  label: String,
  weight: String,
  price: Number,
  salePrice: Number,
  stock: Number,
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, min: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [{ url: String, public_id: String }],
  stock: { type: Number, default: 0, min: 0 },
  weight: String,
  variants: [variantSchema],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isPreOrder: { type: Boolean, default: false },
  preOrderNote: { type: String, default: '' },
  expectedDelivery: { type: String, default: '' },
  tags: [String],
  sku: String,
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
