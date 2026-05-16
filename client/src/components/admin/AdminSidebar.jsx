import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/orders', label: 'Orders', icon: '📦' },
  { to: '/admin/products', label: 'Products', icon: '🥭' },
  { to: '/admin/customers', label: 'Customers', icon: '👥' },
  { to: '/admin/coupons', label: 'Coupons', icon: '🎟️' },
  { to: '/admin/reviews', label: 'Reviews', icon: '⭐' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
]

export default function AdminSidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  return (
    <aside className="w-64 min-h-screen bg-dark text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🥭</span>
          <div>
            <p className="font-display font-bold text-mango text-lg">Mango Mania</p>
            <p className="text-gray-400 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${isActive ? 'bg-mango text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
            }
          >
            <span>{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700 space-y-2">
        <button onClick={() => navigate('/')} className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition">
          🏠 View Store
        </button>
        <button onClick={logout} className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition">
          🚪 Logout
        </button>
      </div>
    </aside>
  )
}
