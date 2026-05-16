const express = require('express');
const router = express.Router();
const { initiateJazzCash, initiateEasyPaisa, createStripeIntent, verifyPayment, stripeWebhook, jazzCashIPN, jazzCashReturn } = require('../controllers/payment.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Public routes (no auth — JazzCash & Stripe call these directly)
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
router.post('/jazzcash/ipn', jazzCashIPN);
router.post('/jazzcash/return', jazzCashReturn);

// Protected routes
router.use(verifyToken);
router.post('/jazzcash', initiateJazzCash);
router.post('/easypaisa', initiateEasyPaisa);
router.post('/stripe', createStripeIntent);
router.post('/verify', verifyPayment);

module.exports = router;
