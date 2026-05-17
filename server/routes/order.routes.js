const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getOrderById, cancelOrder, getAllOrders, updateOrderStatus, assignRider, trackOrder, trackByPhone } = require('../controllers/order.controller');
const { verifyToken, isAdmin, optionalVerifyToken } = require('../middleware/auth.middleware');

// Public routes — no login needed
router.get('/track/by-phone', trackByPhone);
router.get('/track/:id', trackOrder);

// Place order — works for both guests and logged-in users
router.post('/', optionalVerifyToken, placeOrder);

// Protected routes — must be logged in
router.use(verifyToken);
router.get('/my-orders', getMyOrders);
router.get('/', isAdmin, getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/status', isAdmin, updateOrderStatus);
router.put('/:id/rider', isAdmin, assignRider);

module.exports = router;
