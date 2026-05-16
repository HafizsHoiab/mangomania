const Coupon = require('../models/Coupon');

exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    if (coupon.expiry < new Date()) return res.status(400).json({ success: false, message: 'Coupon has expired' });
    if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    if (orderAmount < coupon.minOrder) {
      return res.status(400).json({ success: false, message: `Minimum order of Rs. ${coupon.minOrder.toLocaleString()} required` });
    }

    const discountAmount = coupon.discountType === 'percent'
      ? Math.round(orderAmount * coupon.discount / 100)
      : coupon.discount;

    res.json({ success: true, data: { coupon, discountAmount }, message: 'Coupon applied!' });
  } catch (error) {
    next(error);
  }
};

exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort('-createdAt');
    res.json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
};

exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};

exports.updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};

exports.deleteCoupon = async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    next(error);
  }
};
