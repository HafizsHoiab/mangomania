const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const { getExpenses, addExpense, deleteExpense, getExpenseSummary } = require('../controllers/expense.controller');

router.use(verifyToken, isAdmin);
router.get('/', getExpenses);
router.get('/summary', getExpenseSummary);
router.post('/', addExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
