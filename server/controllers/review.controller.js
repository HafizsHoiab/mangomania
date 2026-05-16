const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;
    const existing = await Review.findOne({ product: productId, user: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this product' });

    const hasOrdered = await Order.findOne({
      user: req.user._id,
      'items.product': productId,
      orderStatus: 'delivered',
    });

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating,
      comment,
      isVerifiedBuyer: !!hasOrdered,
    });

    await updateProductRating(productId);
    res.status(201).json({ success: true, data: review, message: 'Review submitted, pending approval' });
  } catch (error) {
    next(error);
  }
};

const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId, isApproved: true });
  const count = reviews.length;
  const avg = count ? reviews.reduce((acc, r) => acc + r.rating, 0) / count : 0;
  await Product.findByIdAndUpdate(productId, { 'ratings.average': avg.toFixed(1), 'ratings.count': count });
};

exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, isApproved: true })
      .populate('user', 'name').sort('-createdAt');
    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    await updateProductRating(review.product);
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};

exports.approveReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    await updateProductRating(review.product);
    res.json({ success: true, data: review, message: 'Review approved' });
  } catch (error) {
    next(error);
  }
};

exports.getPendingReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ isApproved: false }).populate('user', 'name email').populate('product', 'name');
    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};
