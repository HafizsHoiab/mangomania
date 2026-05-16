const express = require('express');
const router = express.Router();
const { validateCoupon, getCoupons, createCoupon, updateCoupon, deleteCoupon } = require('../controllers/coupon.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.post('/validate', verifyToken, validateCoupon);
router.get('/', verifyToken, isAdmin, getCoupons);
router.post('/', verifyToken, isAdmin, createCoupon);
router.put('/:id', verifyToken, isAdmin, updateCoupon);
router.delete('/:id', verifyToken, isAdmin, deleteCoupon);

module.exports = router;
