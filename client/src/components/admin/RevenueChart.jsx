import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function RevenueChart({ data = [], period, onPeriodChange }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-bold text-dark text-lg">Revenue Overview</h3>
        <select value={period} onChange={(e) => onPeriodChange(e.target.value)} className="input py-1 px-3 w-auto text-sm">
          <option value="weekly">Last 7 Days</option>
          <option value="monthly">Last 30 Days</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(v) => [`Rs. ${v.toLocaleString()}`, 'Revenue']} />
          <Bar dataKey="revenue" fill="#F59E0B" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
