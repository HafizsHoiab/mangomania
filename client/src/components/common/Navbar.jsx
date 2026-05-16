import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAuth } from '../../hooks/useAuth.js'
import { useCart } from '../../hooks/useCart.js'
import { useState } from 'react'

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { totalItems } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav className="bg-dark text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🥭</span>
            <span className="font-display text-xl font-bold text-mango">Mango Mania</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-300 hover:text-mango transition text-sm font-medium">Home</Link>
            <Link to="/shop" className="text-gray-300 hover:text-mango transition text-sm font-medium">Shop</Link>
            <Link to="/shop?category=mangoes" className="text-gray-300 hover:text-mango transition text-sm font-medium">Mangoes</Link>
            <Link to="/track-order" className="text-gray-300 hover:text-mango transition text-sm font-medium">Track Order</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-300 hover:text-mango transition">
              <span className="text-xl">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-mango text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-mango transition"
                >
                  <span className="w-8 h-8 bg-mango rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden md:block">{user?.name?.split(' ')[0]}</span>
                </button>
                {dropOpen && (
                  <div className="absolute right-0 top-10 bg-white text-dark rounded-xl shadow-xl py-2 w-48 z-50">
                    <Link to="/profile" onClick={() => setDropOpen(false)} className="block px-4 py-2 hover:bg-mango/10 text-sm">My Profile</Link>
                    <Link to="/profile" onClick={() => setDropOpen(false)} className="block px-4 py-2 hover:bg-mango/10 text-sm">My Orders</Link>
                    <Link to="/wishlist" onClick={() => setDropOpen(false)} className="block px-4 py-2 hover:bg-mango/10 text-sm">Wishlist ❤️</Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setDropOpen(false)} className="block px-4 py-2 hover:bg-mango/10 text-sm font-semibold text-mango">Admin Panel ⚙️</Link>
                    )}
                    <hr className="my-1" />
                    <button onClick={() => { logout(); setDropOpen(false) }} className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary py-2 px-4 text-sm">Login</Link>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-300 hover:text-mango text-xl">☰</button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-2 border-t border-gray-700 pt-3">
            <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-mango py-2 text-sm">Home</Link>
            <Link to="/shop" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-mango py-2 text-sm">Shop</Link>
            <Link to="/track-order" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-mango py-2 text-sm">Track Order</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
