const express = require('express');
const router = express.Router();
const { createReview, getProductReviews, deleteReview, approveReview, getPendingReviews } = require('../controllers/review.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.get('/pending', verifyToken, isAdmin, getPendingReviews);
router.post('/:productId', verifyToken, createReview);
router.get('/:productId', getProductReviews);
router.delete('/:id', verifyToken, isAdmin, deleteReview);
router.put('/:id/approve', verifyToken, isAdmin, approveReview);

module.exports = router;
