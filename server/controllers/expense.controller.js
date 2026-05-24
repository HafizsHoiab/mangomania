const Expense = require('../models/Expense');

exports.getExpenses = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const filter = {};
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      filter.date = { $gte: start, $lt: end };
    }
    const expenses = await Expense.find(filter).sort('-date');
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    res.json({ success: true, data: expenses, total });
  } catch (error) { next(error); }
};

exports.addExpense = async (req, res, next) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json({ success: true, data: expense });
  } catch (error) { next(error); }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Expense deleted' });
  } catch (error) { next(error); }
};

exports.getExpenseSummary = async (req, res, next) => {
  try {
    const summary = await Expense.aggregate([
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);
    const grandTotal = summary.reduce((sum, s) => sum + s.total, 0);
    res.json({ success: true, data: summary, grandTotal });
  } catch (error) { next(error); }
};
