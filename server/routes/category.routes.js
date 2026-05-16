const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('name');
    res.json({ success: true, data: categories });
  } catch (error) { next(error); }
});

router.post('/', verifyToken, isAdmin, async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) { next(error); }
});

router.put('/:id', verifyToken, isAdmin, async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: category });
  } catch (error) { next(error); }
});

module.exports = router;
