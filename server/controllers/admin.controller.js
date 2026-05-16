const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getDashboard = async (req, res, next) => {
  try {
    const [totalOrders, totalUsers, allOrders, topProducts, preOrderCount] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.find({ paymentStatus: 'paid' }).select('totalAmount createdAt'),
      Order.aggregate([
        { $unwind: '$items' },
        { $group: { _id: '$items.product', totalSold: { $sum: '$items.qty' }, revenue: { $sum: { $multiply: ['$items.qty', '$items.price'] } } } },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
        { $unwind: '$product' },
        { $project: { 'product.name': 1, 'product.images': 1, totalSold: 1, revenue: 1 } },
      ]),
      Order.countDocuments({ isPreOrder: true, orderStatus: 'pre_order' }),
    ]);

    const totalRevenue = allOrders.reduce((acc, o) => acc + o.totalAmount, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / allOrders.length : 0;

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort('-createdAt').limit(10);

    res.json({
      success: true,
      data: {
        stats: {
          totalOrders,
          totalUsers,
          totalRevenue: Math.round(totalRevenue),
          avgOrderValue: Math.round(avgOrderValue),
          preOrderCount,
        },
        topProducts,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    const { period = 'weekly' } = req.query;
    const daysBack = period === 'monthly' ? 30 : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const revenue = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, paymentStatus: 'paid' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const categoryRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $unwind: '$items' },
      { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $lookup: { from: 'categories', localField: 'product.category', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $group: { _id: '$category.name', revenue: { $sum: { $multiply: ['$items.qty', '$items.price'] } } } },
      { $sort: { revenue: -1 } },
    ]);

    res.json({ success: true, data: { revenue, categoryRevenue } });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = { role: 'user' };
    if (search) filter.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];
    const users = await User.find(filter).select('-password -refreshToken')
      .sort('-createdAt').skip((page - 1) * limit).limit(Number(limit));
    const total = await User.countDocuments(filter);
    res.json({ success: true, data: users, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

exports.blockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ success: true, message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}`, data: { isBlocked: user.isBlocked } });
  } catch (error) {
    next(error);
  }
};
