import { useState } from 'react'
import { useGetDashboardQuery, useGetAnalyticsQuery } from '../../services/adminApi.js'
import { useUpdateOrderStatusMutation, useAssignRiderMutation } from '../../services/orderApi.js'
import AdminSidebar from '../../components/admin/AdminSidebar.jsx'
import StatsCard from '../../components/admin/StatsCard.jsx'
import RevenueChart from '../../components/admin/RevenueChart.jsx'
import OrdersTable from '../../components/admin/OrdersTable.jsx'
import Modal from '../../components/common/Modal.jsx'
import Loader from '../../components/common/Loader.jsx'
import { formatPrice } from '../../utils/formatPrice.js'
import { formatDateTime } from '../../utils/formatDate.js'
import { generateOrderId, getOrderStatusColor, getPaymentStatusColor } from '../../utils/helpers.js'
import { toast } from '../../hooks/useToast.js'
import { Link, useNavigate } from 'react-router-dom'

const ORDER_STATUSES = ['pre_order', 'pending', 'confirmed', 'packed', 'dispatched', 'delivered', 'cancelled']
const STATUS_ICONS = { pre_order: '🕐', pending: '📝', confirmed: '✅', packed: '📦', dispatched: '🚗', delivered: '🥭', cancelled: '❌' }

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState('weekly')
  const [viewOrder, setViewOrder] = useState(null)
  const [activeTab, setActiveTab] = useState('details')
  const [newStatus, setNewStatus] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [riderName, setRiderName] = useState('')
  const [riderPhone, setRiderPhone] = useState('')

  const { data: dash, isLoading } = useGetDashboardQuery()
  const { data: analytics } = useGetAnalyticsQuery(period)
  const [updateStatus, { isLoading: updatingStatus }] = useUpdateOrderStatusMutation()
  const [assignRider, { isLoading: assigningRider }] = useAssignRiderMutation()

  const stats = dash?.data?.stats || {}
  const recentOrders = dash?.data?.recentOrders || []
  const topProducts = dash?.data?.topProducts || []
  const chartData = analytics?.data?.revenue || []

  const openModal = (order) => {
    setViewOrder(order)
    setNewStatus(order.orderStatus)
    setStatusMessage('')
    setRiderName(order.rider?.name || '')
    setRiderPhone(order.rider?.phone || '')
    setActiveTab('details')
  }

  const handleStatusUpdate = async () => {
    if (!newStatus || !viewOrder) return
    try {
      await updateStatus({ id: viewOrder._id, status: newStatus, message: statusMessage }).unwrap()
      toast.success('Order status updated')
      setViewOrder(null)
    } catch { toast.error('Failed to update status') }
  }

  const handleAssignRider = async () => {
    if (!riderName.trim() || !riderPhone.trim()) {
      toast.error('Please enter rider name and phone')
      return
    }
    try {
      await assignRider({ id: viewOrder._id, name: riderName.trim(), phone: riderPhone.trim() }).unwrap()
      toast.success(`Rider ${riderName} assigned 🛵`)
      setViewOrder(null)
    } catch { toast.error('Failed to assign rider') }
  }

  return (
    <div className="flex w-full">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-dark">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back! Here's what's happening.</p>
          </div>
          <Link to="/admin/products/add" className="btn-primary text-sm">+ Add Product</Link>
        </div>

        {isLoading ? <Loader /> : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <StatsCard title="Total Revenue" value={formatPrice(stats.totalRevenue || 0)} icon="💰" color="mango" />
              <StatsCard title="Total Orders" value={stats.totalOrders || 0} icon="📦" color="blue" />
              <StatsCard title="Customers" value={stats.totalUsers || 0} icon="👥" color="green" />
              <StatsCard title="Avg Order Value" value={formatPrice(stats.avgOrderValue || 0)} icon="📊" color="purple" />
              <StatsCard title="Pending Pre-Orders" value={stats.preOrderCount || 0} icon="🕐" color="amber" />
            </div>

            {/* Chart + Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <RevenueChart data={chartData} period={period} onPeriodChange={setPeriod} />
              </div>
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="font-display font-bold text-dark text-lg mb-4">Top Products</h3>
                <div className="space-y-3">
                  {topProducts.length === 0 && (
                    <p className="text-gray-400 text-sm text-center py-4">No sales data yet</p>
                  )}
                  {topProducts.slice(0, 5).map((tp, i) => (
                    <div key={tp._id} className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-mango/10 text-mango text-xs font-bold rounded-full flex items-center justify-center">{i + 1}</span>
                      <img src={tp.product?.images?.[0]?.url} alt="" className="w-8 h-8 rounded-lg object-cover bg-gray-100" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark truncate">{tp.product?.name}</p>
                        <p className="text-xs text-gray-400">{tp.totalSold} sold</p>
                      </div>
                      <p className="text-sm font-semibold text-dark">{formatPrice(tp.revenue)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Manage Orders', icon: '📦', to: '/admin/orders', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                { label: 'Add Product', icon: '➕', to: '/admin/products/add', color: 'bg-mango/10 border-mango/30 text-mango-deep' },
                { label: 'View Customers', icon: '👥', to: '/admin/customers', color: 'bg-green-50 border-green-200 text-green-700' },
                { label: 'Create Coupon', icon: '🎟️', to: '/admin/coupons', color: 'bg-purple-50 border-purple-200 text-purple-700' },
              ].map(a => (
                <Link key={a.to} to={a.to} className={`flex items-center gap-2 p-4 rounded-xl border-2 font-medium text-sm transition hover:shadow-card ${a.color}`}>
                  <span className="text-xl">{a.icon}</span> {a.label}
                </Link>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-dark text-lg">Recent Orders</h3>
                <Link to="/admin/orders" className="text-mango text-sm hover:underline font-medium">View all orders →</Link>
              </div>
              <OrdersTable orders={recentOrders.slice(0, 5)} onView={openModal} />
            </div>
          </>
        )}
      </div>

      {/* Order modal — same full-featured modal as AdminOrders */}
      <Modal isOpen={!!viewOrder} onClose={() => setViewOrder(null)} title={`Order ${generateOrderId(viewOrder?._id)}`} size="lg">
        {viewOrder && (
          <div>
            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
              {[
                { id: 'details', label: '📋 Details' },
                { id: 'status', label: '🔄 Status' },
                { id: 'rider', label: '🛵 Rider' },
                { id: 'history', label: '📜 History' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition ${
                    activeTab === tab.id ? 'bg-white shadow text-dark' : 'text-gray-500 hover:text-dark'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Details */}
            {activeTab === 'details' && (
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Customer</p>
                    <p className="font-semibold text-dark">{viewOrder.user?.name}</p>
                    <p className="text-gray-600">{viewOrder.user?.email}</p>
                    <p className="text-gray-600">{viewOrder.user?.phone}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Payment</p>
                    <p className="font-semibold uppercase">{viewOrder.paymentMethod}</p>
                    <span className={`badge text-xs ${getPaymentStatusColor(viewOrder.paymentStatus)}`}>{viewOrder.paymentStatus}</span>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">📍 Delivery Address</p>
                  <p className="font-medium text-dark">{viewOrder.shippingAddress?.name}</p>
                  <p className="text-gray-600">{viewOrder.shippingAddress?.phone}</p>
                  <p className="text-gray-600">{viewOrder.shippingAddress?.street}, {viewOrder.shippingAddress?.city}, {viewOrder.shippingAddress?.province}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${getOrderStatusColor(viewOrder.orderStatus)}`}>
                    {STATUS_ICONS[viewOrder.orderStatus]} {viewOrder.orderStatus}
                  </span>
                  {viewOrder.rider?.name && (
                    <span className="badge bg-orange-100 text-orange-700 text-xs">
                      🛵 {viewOrder.rider.name}
                    </span>
                  )}
                </div>
                <div>
                  {viewOrder.items?.map((item, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-700">{item.name} {item.variant && `(${item.variant})`} × {item.qty}</span>
                      <span className="font-medium">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-dark pt-2 mt-1">
                    <span>Total</span><span>{formatPrice(viewOrder.totalAmount)}</span>
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => { setViewOrder(null); navigate('/admin/orders') }}
                    className="text-mango text-sm hover:underline font-medium"
                  >
                    → Open in Orders Manager for full management
                  </button>
                </div>
              </div>
            )}

            {/* Status */}
            {activeTab === 'status' && (
              <div className="space-y-5">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800">
                  <strong>Current:</strong>{' '}
                  <span className={`badge ml-1 ${getOrderStatusColor(viewOrder.orderStatus)}`}>
                    {STATUS_ICONS[viewOrder.orderStatus]} {viewOrder.orderStatus}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-3">Select New Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ORDER_STATUSES.map(s => (
                      <button
                        key={s}
                        onClick={() => setNewStatus(s)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition text-left ${
                          newStatus === s ? 'border-mango bg-mango/10 text-mango-deep' : 'border-gray-200 text-gray-600 hover:border-mango/40'
                        }`}
                      >
                        <span>{STATUS_ICONS[s]}</span>
                        <span className="capitalize">{s}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  value={statusMessage}
                  onChange={(e) => setStatusMessage(e.target.value)}
                  placeholder="Optional: message shown in tracking timeline"
                  className="input text-sm"
                />
                <button
                  onClick={handleStatusUpdate}
                  disabled={updatingStatus || newStatus === viewOrder.orderStatus}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingStatus ? 'Updating...' : `Update to "${newStatus}" ${STATUS_ICONS[newStatus]}`}
                </button>
              </div>
            )}

            {/* Rider */}
            {activeTab === 'rider' && (
              <div className="space-y-4">
                {viewOrder.rider?.name ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-3xl">🛵</span>
                    <div>
                      <p className="font-semibold text-dark">{viewOrder.rider.name}</p>
                      <p className="text-sm text-gray-600">{viewOrder.rider.phone}</p>
                    </div>
                    <a href={`tel:${viewOrder.rider.phone}`} className="ml-auto bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium">📞 Call</a>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 text-center text-gray-500 text-sm">No rider assigned yet</div>
                )}
                <div className="space-y-3">
                  <input value={riderName} onChange={(e) => setRiderName(e.target.value)} placeholder="Rider Name *" className="input" />
                  <input value={riderPhone} onChange={(e) => setRiderPhone(e.target.value)} placeholder="Rider Phone * e.g. +92-300-9999888" className="input" />
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
                  Assigning a rider automatically sets order status to <strong>Dispatched</strong>. The customer sees the rider's contact on their tracking page.
                </div>
                <button
                  onClick={handleAssignRider}
                  disabled={assigningRider || !riderName.trim() || !riderPhone.trim()}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {assigningRider ? 'Assigning...' : viewOrder.rider?.name ? 'Update Rider 🛵' : 'Assign Rider 🛵'}
                </button>
              </div>
            )}

            {/* History */}
            {activeTab === 'history' && (
              <div className="space-y-3">
                {!viewOrder.statusHistory?.length && (
                  <p className="text-gray-400 text-sm text-center py-8">No history yet</p>
                )}
                {[...(viewOrder.statusHistory || [])].reverse().map((h, i) => (
                  <div key={i} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${getOrderStatusColor(h.status)}`}>
                      {STATUS_ICONS[h.status] || '●'}
                    </div>
                    <div>
                      <p className="font-medium text-dark capitalize text-sm">{h.status}</p>
                      {h.message && <p className="text-gray-500 text-xs mt-0.5">{h.message}</p>}
                      <p className="text-gray-400 text-xs mt-1">{formatDateTime(h.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
