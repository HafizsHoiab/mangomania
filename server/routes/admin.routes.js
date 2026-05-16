const express = require('express');
const router = express.Router();
const { getDashboard, getAnalytics, getUsers, blockUser } = require('../controllers/admin.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.use(verifyToken, isAdmin);
router.get('/dashboard', getDashboard);
router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.put('/users/:id/block', blockUser);

module.exports = router;
