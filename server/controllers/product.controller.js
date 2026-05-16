const Product = require('../models/Product');
const Category = require('../models/Category');
const ApiFeatures = require('../utils/apiFeatures');
const slugify = require('slugify');

exports.getProducts = async (req, res, next) => {
  try {
    const query = Product.find({ isActive: true }).populate('category', 'name slug');
    const features = new ApiFeatures(query, req.query).search().filter().sort().paginate();
    const products = await features.query;
    const total = await Product.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: products,
      pagination: {
        page: features.page,
        limit: features.limit,
        total,
        pages: Math.ceil(total / features.limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category', 'name slug').limit(8);
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

exports.getProductsByCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    const products = await Product.find({ category: category._id, isActive: true })
      .populate('category', 'name slug');
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name } = req.body;
    req.body.slug = slugify(name, { lower: true, strict: true });
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    if (req.body.name) {
      req.body.slug = slugify(req.body.name, { lower: true, strict: true });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};
