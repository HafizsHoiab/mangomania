import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useGetMyOrdersQuery } from '../services/orderApi.js'
import { useChangePasswordMutation } from '../services/authApi.js'
import { toggleWishlist } from '../store/slices/wishlistSlice.js'
import { addItem } from '../store/slices/cartSlice.js'
import { formatPrice } from '../utils/formatPrice.js'
import { formatDate } from '../utils/formatDate.js'
import { getOrderStatusColor, generateOrderId } from '../utils/helpers.js'
import { toast } from '../hooks/useToast.js'

const TABS = [
  { label: 'My Orders', icon: '📦' },
  { label: 'Wishlist', icon: '❤️' },
  { label: 'Change Password', icon: '🔒' },
]

export default function ProfilePage() {
  const [tab, setTab] = useState(0)
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const dispatch = useDispatch()

  const user = useSelector((s) => s.auth.user)
  const wishlistItems = useSelector((s) => s.wishlist.items)
  const { data, isLoading: ordersLoading } = useGetMyOrdersQuery()
  const orders = data?.data || []
  const [changePassword, { isLoading: changingPw }] = useChangePasswordMutation()

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      return toast.error('New passwords do not match')
    }
    if (pwForm.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters')
    }
    try {
      await changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      }).unwrap()
      toast.success('Password changed successfully!')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to change password')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile header */}
      <div className="card flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
        <div className="w-20 h-20 bg-mango rounded-2xl flex items-center justify-center text-white font-display font-bold text-3xl flex-shrink-0">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-dark">{user?.name}</h1>
          <p className="text-gray-500">{user?.email}</p>
          {user?.phone && <p className="text-gray-500 text-sm">{user.phone}</p>}
        </div>
        <div className="flex items-center gap-3">
          <span className={`badge ${user?.role === 'admin' ? 'bg-mango/20 text-mango-deep' : 'bg-gray-100 text-gray-600'}`}>
            {user?.role === 'admin' ? '⚙️ Admin' : '👤 Customer'}
          </span>
          {user?.role === 'admin' && (
            <Link to="/admin" className="btn-primary py-2 px-4 text-sm">Admin Panel</Link>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 w-fit">
        {TABS.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setTab(i)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition ${
              tab === i ? 'bg-white shadow text-dark' : 'text-gray-500 hover:text-dark'
            }`}
          >
            <span>{t.icon}</span>
            <span className="hidden sm:block">{t.label}</span>
            {i === 1 && wishlistItems.length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab 0: My Orders ── */}
      {tab === 0 && (
        <div className="space-y-4">
          {ordersLoading && (
            <div className="text-center py-10 text-gray-400">Loading orders...</div>
          )}
          {!ordersLoading && orders.length === 0 && (
            <div className="text-center py-16">
              <span className="text-6xl block mb-4">📦</span>
              <p className="text-gray-500 mb-4">No orders yet. Start shopping!</p>
              <Link to="/shop" className="btn-primary">Shop Now 🥭</Link>
            </div>
          )}
          {orders.map((order) => (
            <div key={order._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <p className="font-mono font-bold text-dark text-lg">{generateOrderId(order._id)}</p>
                    <span className={`badge ${getOrderStatusColor(order.orderStatus)}`}>
                      {order.orderStatus === 'pre_order' ? '🕐 Pre-Order' : order.orderStatus}
                    </span>
                    {order.isPreOrder && order.orderStatus !== 'pre_order' && (
                      <span className="badge bg-amber-100 text-amber-700 text-xs">Pre-Order</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">
                    {order.items?.length} item(s) · Placed on {formatDate(order.createdAt)} · {order.paymentMethod?.toUpperCase()}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {order.items?.slice(0, 3).map((item, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                        {item.name}
                      </span>
                    ))}
                    {order.items?.length > 3 && (
                      <span className="text-xs text-gray-400">+{order.items.length - 3} more</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  <p className="font-bold text-dark text-lg">{formatPrice(order.totalAmount)}</p>
                  <Link
                    to={`/track-order`}
                    state={{ orderId: order._id }}
                    className="text-mango text-sm font-semibold hover:underline"
                  >
                    Track Order →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Tab 1: Wishlist ── */}
      {tab === 1 && (
        <div>
          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-6xl block mb-4">❤️</span>
              <p className="text-gray-500 mb-4">Your wishlist is empty. Save products you love!</p>
              <Link to="/shop" className="btn-primary">Explore Products 🥭</Link>
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-sm mb-4">{wishlistItems.length} saved item(s)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistItems.map((product) => (
                  <div key={product._id} className="card p-0 overflow-hidden group">
                    <Link to={`/product/${product.slug}`}>
                      <img
                        src={product.images?.[0]?.url || ''}
                        alt={product.name}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <div className="p-4">
                      <Link to={`/product/${product.slug}`} className="font-semibold text-dark hover:text-mango text-sm line-clamp-2">
                        {product.name}
                      </Link>
                      <p className="font-bold text-dark mt-1">{formatPrice(product.salePrice || product.price)}</p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => {
                            dispatch(addItem({ product, qty: 1 }))
                            toast.success('Added to cart 🛒')
                          }}
                          className="flex-1 text-xs bg-mango/10 text-mango hover:bg-mango hover:text-white px-3 py-2 rounded-lg transition font-medium"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => {
                            dispatch(toggleWishlist(product))
                            toast.info('Removed from wishlist')
                          }}
                          className="text-xs text-red-400 hover:bg-red-50 px-3 py-2 rounded-lg transition"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Tab 2: Change Password ── */}
      {tab === 2 && (
        <div className="max-w-md">
          <div className="card">
            <h3 className="font-display font-bold text-dark text-xl mb-6">Change Password</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Current Password</label>
                <input
                  type="password"
                  value={pwForm.currentPassword}
                  onChange={(e) => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                  className="input"
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">New Password</label>
                <input
                  type="password"
                  value={pwForm.newPassword}
                  onChange={(e) => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                  className="input"
                  placeholder="Min 6 characters"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={pwForm.confirmPassword}
                  onChange={(e) => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  className="input"
                  placeholder="Re-enter new password"
                  required
                />
              </div>
              <button type="submit" disabled={changingPw} className="btn-primary w-full">
                {changingPw ? 'Updating...' : 'Update Password 🔒'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
