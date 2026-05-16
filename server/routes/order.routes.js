const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getOrderById, cancelOrder, getAllOrders, updateOrderStatus, assignRider } = require('../controllers/order.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.use(verifyToken);
router.post('/', placeOrder);
router.get('/my-orders', getMyOrders);
router.get('/', isAdmin, getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/status', isAdmin, updateOrderStatus);
router.put('/:id/rider', isAdmin, assignRider);

module.exports = router;
