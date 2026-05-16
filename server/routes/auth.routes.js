const express = require('express');
const router = express.Router();
const { register, login, logout, refreshToken, getMe, updateProfile, changePassword, sendOTP, verifyOTP, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many requests, please try again after 15 minutes' },
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.post('/send-otp', authLimiter, sendOTP);
router.post('/verify-otp', verifyOTP);
router.get('/me', verifyToken, getMe);
router.put('/update-profile', verifyToken, updateProfile);
router.put('/change-password', verifyToken, changePassword);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
