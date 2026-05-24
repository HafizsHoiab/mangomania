import { useState } from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar.jsx'
import { useGetExpensesQuery, useGetExpenseSummaryQuery, useAddExpenseMutation, useDeleteExpenseMutation } from '../../services/expenseApi.js'
import { formatPrice } from '../../utils/formatPrice.js'
import { formatDate } from '../../utils/formatDate.js'
import { toast } from '../../hooks/useToast.js'

const CATEGORIES = [
  { value: 'sourcing', label: '🌾 Sourcing', desc: 'Buying mangoes/products' },
  { value: 'packaging', label: '📦 Packaging', desc: 'Boxes, bags, wrapping' },
  { value: 'transport', label: '🚚 Transport', desc: 'Delivery, courier costs' },
  { value: 'marketing', label: '📣 Marketing', desc: 'Ads, promotions' },
  { value: 'staff', label: '👷 Staff', desc: 'Labour, wages' },
  { value: 'utilities', label: '💡 Utilities', desc: 'Electricity, internet' },
  { value: 'other', label: '📝 Other', desc: 'Miscellaneous' },
]

export default function AdminExpenses() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', amount: '', category: 'sourcing', date: new Date().toISOString().split('T')[0], notes: '' })

  const params = `month=${month}&year=${year}`
  const { data, isLoading } = useGetExpensesQuery(params)
  const { data: summaryData } = useGetExpenseSummaryQuery()
  const [addExpense, { isLoading: adding }] = useAddExpenseMutation()
  const [deleteExpense] = useDeleteExpenseMutation()

  const expenses = data?.data || []
  const monthTotal = data?.total || 0
  const summary = summaryData?.data || []
  const grandTotal = summaryData?.grandTotal || 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addExpense({ ...form, amount: Number(form.amount) }).unwrap()
      toast.success('Expense added!')
      setForm({ title: '', amount: '', category: 'sourcing', date: new Date().toISOString().split('T')[0], notes: '' })
      setShowForm(false)
    } catch { toast.error('Failed to add expense') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this expense?')) return
    try {
      await deleteExpense(id).unwrap()
      toast.success('Deleted')
    } catch { toast.error('Failed to delete') }
  }

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  return (
    <div className="flex w-full">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-dark">Expenses</h1>
            <p className="text-gray-500 text-sm mt-1">Track your business costs and calculate profit</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">+ Add Expense</button>
        </div>

        {/* Add Expense Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
            <h3 className="font-semibold text-dark mb-4">New Expense</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required className="input" placeholder="e.g. Cardboard boxes from market" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Amount (Rs.) *</label>
                  <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required className="input" placeholder="500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Category *</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input">
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Date *</label>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required className="input" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-dark mb-1">Notes</label>
                  <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="input" placeholder="Optional details..." />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={adding} className="btn-primary">{adding ? 'Adding...' : 'Add Expense'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Summary by category */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:col-span-2">
            <p className="text-xs text-red-500 font-semibold uppercase">All-time Total Expenses</p>
            <p className="text-2xl font-bold text-red-700 mt-1">{formatPrice(grandTotal)}</p>
          </div>
          {summary.slice(0, 2).map(s => {
            const cat = CATEGORIES.find(c => c.value === s._id)
            return (
              <div key={s._id} className="bg-white rounded-2xl shadow-card p-4">
                <p className="text-xs text-gray-500">{cat?.label || s._id}</p>
                <p className="text-lg font-bold text-dark mt-1">{formatPrice(s.total)}</p>
                <p className="text-xs text-gray-400">{s.count} entries</p>
              </div>
            )
          })}
        </div>

        {/* Month filter */}
        <div className="flex items-center gap-3 mb-4">
          <select value={month} onChange={e => setMonth(Number(e.target.value))} className="input w-auto py-2 text-sm">
            {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <select value={year} onChange={e => setYear(Number(e.target.value))} className="input w-auto py-2 text-sm">
            {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <span className="text-sm text-gray-500">
            Total: <strong className="text-red-600">{formatPrice(monthTotal)}</strong>
          </span>
        </div>

        {/* Expense list */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {isLoading ? (
            <p className="text-center py-8 text-gray-400">Loading...</p>
          ) : expenses.length === 0 ? (
            <p className="text-center py-8 text-gray-400">No expenses for this month</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Title</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-right p-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => {
                  const cat = CATEGORIES.find(c => c.value === exp.category)
                  return (
                    <tr key={exp._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="p-4">
                        <p className="font-medium text-dark text-sm">{exp.title}</p>
                        {exp.notes && <p className="text-xs text-gray-400 mt-0.5">{exp.notes}</p>}
                      </td>
                      <td className="p-4">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{cat?.label || exp.category}</span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">{formatDate(exp.date)}</td>
                      <td className="p-4 text-right font-bold text-red-600">{formatPrice(exp.amount)}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDelete(exp._id)} className="text-gray-400 hover:text-red-500 transition text-sm">✕</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="p-4 font-semibold text-dark text-sm">Month Total</td>
                  <td className="p-4 text-right font-bold text-red-600">{formatPrice(monthTotal)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
