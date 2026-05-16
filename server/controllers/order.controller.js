const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { orderConfirmationEmail, orderStatusEmail } = require('../utils/sendEmail');

exports.placeOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod, couponCode, items: clientItems } = req.body;

    if (!clientItems || clientItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    let totalAmount = 0;
    let hasPreOrder = false;
    const items = [];
    for (const clientItem of clientItems) {
      const product = await Product.findById(clientItem.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({ success: false, message: `Product not available` });
      }
      // Pre-order products skip stock check — they don't have stock yet
      if (!product.isPreOrder && product.stock < clientItem.qty) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }
      if (product.isPreOrder) hasPreOrder = true;
      const price = product.salePrice || product.price;
      items.push({ product: product._id, name: product.name, image: product.images[0]?.url, qty: clientItem.qty, price, variant: clientItem.variant });
      totalAmount += price * clientItem.qty;
      // Only deduct stock for non-pre-order items
      if (!product.isPreOrder) {
        await Product.findByIdAndUpdate(product._id, { $inc: { stock: -clientItem.qty } });
      }
    }

    let discount = 0;
    let couponDoc = null;
    const deliveryCharge = totalAmount >= 3000 ? 0 : 200;

    if (couponCode) {
      couponDoc = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true, expiry: { $gt: new Date() } });
      if (couponDoc && totalAmount >= couponDoc.minOrder && couponDoc.usedCount < couponDoc.maxUses) {
        discount = couponDoc.discountType === 'percent'
          ? Math.round(totalAmount * couponDoc.discount / 100)
          : couponDoc.discount;
        couponDoc.usedCount += 1;
        await couponDoc.save();
      }
    }

    const finalTotal = totalAmount - discount + deliveryCharge;

    const initialStatus = hasPreOrder ? 'pre_order' : 'pending';
    const initialMessage = hasPreOrder
      ? 'Pre-order placed! We will notify you when your order is ready to dispatch.'
      : 'Order placed successfully';

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount: finalTotal,
      discount,
      deliveryCharge,
      coupon: couponDoc?._id,
      couponCode: couponDoc?.code,
      isPreOrder: hasPreOrder,
      orderStatus: initialStatus,
      statusHistory: [{ status: initialStatus, message: initialMessage }],
    });

    // Send confirmation email — wrapped so email failure never kills the order
    try {
      await orderConfirmationEmail(order, req.user.email);
    } catch (emailErr) {
      console.error('Order confirmation email failed:', emailErr.message);
    }

    res.status(201).json({ success: true, data: order, message: 'Order placed successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images')
      .sort('-createdAt').skip(skip).limit(limit);
    const total = await Order.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name images slug');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });
    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
    }
    order.orderStatus = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', message: 'Cancelled by customer' });
    await order.save();
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.qty } });
    }
    res.json({ success: true, message: 'Order cancelled', data: order });
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, paymentMethod, isPreOrder, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (isPreOrder === 'true') filter.isPreOrder = true;

    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .populate('items.product', 'name')
      .sort('-createdAt')
      .skip((page - 1) * limit).limit(Number(limit));
    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: orders,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, message } = req.body;
    const order = await Order.findById(req.params.id).populate('user', 'email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.orderStatus = status;
    order.statusHistory.push({ status, message: message || `Order ${status}` });
    if (status === 'delivered') order.paymentStatus = 'paid';
    await order.save();

    await orderStatusEmail(order, order.user.email, status);
    res.json({ success: true, data: order, message: 'Order status updated' });
  } catch (error) {
    next(error);
  }
};

exports.assignRider = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { rider: { name, phone }, orderStatus: 'dispatched', $push: { statusHistory: { status: 'dispatched', message: `Assigned rider: ${name}` } } },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
