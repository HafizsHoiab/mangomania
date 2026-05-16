const express = require('express');
const router = express.Router();
const { getProducts, getProductBySlug, getFeaturedProducts, getProductsByCategory, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:slug', getProductsByCategory);
router.get('/:slug', getProductBySlug);
router.post('/', verifyToken, isAdmin, createProduct);
router.put('/:id', verifyToken, isAdmin, updateProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

module.exports = router;
