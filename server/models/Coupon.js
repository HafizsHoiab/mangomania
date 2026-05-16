const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ['percent', 'flat'], default: 'percent' },
  discount: { type: Number, required: true },
  minOrder: { type: Number, default: 0 },
  maxUses: { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
  expiry: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  description: String,
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
