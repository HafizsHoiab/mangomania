export default function StatsCard({ title, value, icon, trend, color = 'mango' }) {
  const colors = {
    mango: 'bg-mango/10 text-mango',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    amber: 'bg-amber-100 text-amber-600',
  }
  return (
    <div className="bg-white rounded-2xl shadow-card p-6 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${colors[color]}`}>{icon}</div>
      <div className="flex-1">
        <p className="text-gray-500 text-sm mb-1">{title}</p>
        <p className="text-2xl font-bold text-dark">{value}</p>
        {trend && <p className={`text-xs mt-1 ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{trend} vs last month</p>}
      </div>
    </div>
  )
}
