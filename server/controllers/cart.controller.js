const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images price salePrice stock');
    res.json({ success: true, data: cart || { items: [] } });
  } catch (error) {
    next(error);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, qty, variant } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (product.stock < qty) return res.status(400).json({ success: false, message: 'Insufficient stock' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const existingIndex = cart.items.findIndex(
      item => item.product.toString() === productId && item.variant === variant
    );

    if (existingIndex >= 0) {
      cart.items[existingIndex].qty += qty;
    } else {
      cart.items.push({ product: productId, qty, variant, price: product.salePrice || product.price });
    }

    await cart.save();
    await cart.populate('items.product', 'name images price salePrice stock');
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

exports.updateCart = async (req, res, next) => {
  try {
    const { productId, qty, variant } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const index = cart.items.findIndex(
      item => item.product.toString() === productId && item.variant === variant
    );
    if (index < 0) return res.status(404).json({ success: false, message: 'Item not found in cart' });

    cart.items[index].qty = qty;
    await cart.save();
    await cart.populate('items.product', 'name images price salePrice stock');
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
    await cart.save();
    await cart.populate('items.product', 'name images price salePrice stock');
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};
