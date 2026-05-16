import { useState } from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar.jsx'
import OrdersTable from '../../components/admin/OrdersTable.jsx'
import Modal from '../../components/common/Modal.jsx'
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation, useAssignRiderMutation } from '../../services/orderApi.js'
import { formatPrice } from '../../utils/formatPrice.js'
import { formatDateTime } from '../../utils/formatDate.js'
import { generateOrderId, getOrderStatusColor, getPaymentStatusColor } from '../../utils/helpers.js'
import { toast } from '../../hooks/useToast.js'
import Loader from '../../components/common/Loader.jsx'

const ORDER_STATUSES = ['pre_order', 'pending', 'confirmed', 'packed', 'dispatched', 'delivered', 'cancelled']
const STATUS_ICONS = { pre_order: '🕐', pending: '📝', confirmed: '✅', packed: '📦', dispatched: '🚗', delivered: '🥭', cancelled: '❌' }

export default function AdminOrders() {
  const [filters, setFilters] = useState({ status: '', paymentMethod: '', isPreOrder: '' })
  const [viewOrder, setViewOrder] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [riderName, setRiderName] = useState('')
  const [riderPhone, setRiderPhone] = useState('')
  const [activeTab, setActiveTab] = useState('details')

  const queryString = new URLSearchParams(
    Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
  ).toString()

  const { data, isLoading } = useGetAllOrdersQuery(queryString)
  const [updateStatus, { isLoading: updatingStatus }] = useUpdateOrderStatusMutation()
  const [assignRider, { isLoading: assigningRider }] = useAssignRiderMutation()

  const orders = data?.data || []

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
      toast.error('Please enter both rider name and phone number')
      return
    }
    try {
      await assignRider({ id: viewOrder._id, name: riderName.trim(), phone: riderPhone.trim() }).unwrap()
      toast.success(`Rider ${riderName} assigned successfully 🛵`)
      setViewOrder(null)
    } catch { toast.error('Failed to assign rider') }
  }

  return (
    <div className="flex w-full">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-dark">Orders Management</h1>
            <p className="text-gray-500 text-sm mt-1">{orders.length} orders found</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={filters.status}
            onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
            className="input w-auto py-2 text-sm"
          >
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map(s => (
              <option key={s} value={s}>{STATUS_ICONS[s]} {s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <select
            value={filters.paymentMethod}
            onChange={(e) => setFilters(f => ({ ...f, paymentMethod: e.target.value }))}
            className="input w-auto py-2 text-sm"
          >
            <option value="">All Payment Methods</option>
            {['jazzcash', 'easypaisa', 'card', 'cod'].map(p => (
              <option key={p} value={p}>{p.toUpperCase()}</option>
            ))}
          </select>
          <button
            onClick={() => setFilters(f => ({ ...f, isPreOrder: f.isPreOrder ? '' : 'true' }))}
            className={`text-sm px-4 py-2 rounded-xl border-2 font-medium transition ${
              filters.isPreOrder
                ? 'border-amber-400 bg-amber-50 text-amber-700'
                : 'border-gray-200 text-gray-500 hover:border-amber-300'
            }`}
          >
            🕐 Pre-Orders {filters.isPreOrder ? '✓' : ''}
          </button>
          {(filters.status || filters.paymentMethod || filters.isPreOrder) && (
            <button
              onClick={() => setFilters({ status: '', paymentMethod: '', isPreOrder: '' })}
              className="text-sm text-red-500 hover:underline px-2"
            >
              Clear Filters ✕
            </button>
          )}
        </div>

        {isLoading ? <Loader /> : (
          <div className="bg-white rounded-2xl shadow-card p-6">
            <OrdersTable orders={orders} onView={openModal} />
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!viewOrder}
        onClose={() => setViewOrder(null)}
        title={`Order ${generateOrderId(viewOrder?._id)}`}
        size="lg"
      >
        {viewOrder && (
          <div>
            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
              {[
                { id: 'details', label: '📋 Details' },
                { id: 'status', label: '🔄 Update Status' },
                { id: 'rider', label: '🛵 Assign Rider' },
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

            {/* Tab: Details */}
            {activeTab === 'details' && (
              <div className="space-y-4">
                {/* Customer + Payment info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Customer</p>
                    <p className="font-semibold text-dark">{viewOrder.user?.name}</p>
                    <p className="text-sm text-gray-600">{viewOrder.user?.email}</p>
                    <p className="text-sm text-gray-600">{viewOrder.user?.phone}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Payment</p>
                    <p className="font-semibold text-dark uppercase">{viewOrder.paymentMethod}</p>
                    <span className={`badge text-xs ${getPaymentStatusColor(viewOrder.paymentStatus)}`}>
                      {viewOrder.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Shipping address */}
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">📍 Delivery Address</p>
                  <p className="font-medium text-dark">{viewOrder.shippingAddress?.name}</p>
                  <p className="text-sm text-gray-600">{viewOrder.shippingAddress?.phone}</p>
                  <p className="text-sm text-gray-600">
                    {viewOrder.shippingAddress?.street}, {viewOrder.shippingAddress?.city}, {viewOrder.shippingAddress?.province}
                  </p>
                  {viewOrder.shippingAddress?.notes && (
                    <p className="text-xs text-gray-500 mt-1 italic">Note: {viewOrder.shippingAddress.notes}</p>
                  )}
                </div>

                {/* Current status */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`badge ${getOrderStatusColor(viewOrder.orderStatus)}`}>
                    {STATUS_ICONS[viewOrder.orderStatus]} {viewOrder.orderStatus}
                  </span>
                  {viewOrder.isPreOrder && (
                    <span className="badge bg-amber-100 text-amber-700">🕐 Pre-Order</span>
                  )}
                  {viewOrder.rider?.name && (
                    <span className="badge bg-orange-100 text-orange-700">
                      🛵 Rider: {viewOrder.rider.name} ({viewOrder.rider.phone})
                    </span>
                  )}
                </div>

                {/* Order items */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Items Ordered</p>
                  <div className="space-y-2">
                    {viewOrder.items?.map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 text-sm">
                        <div>
                          <span className="font-medium text-dark">{item.name}</span>
                          {item.variant && <span className="text-gray-400 text-xs ml-2">({item.variant})</span>}
                          <span className="text-gray-500 ml-2">× {item.qty}</span>
                        </div>
                        <span className="font-semibold">{formatPrice(item.price * item.qty)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t space-y-1 text-sm">
                    {viewOrder.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Coupon Discount ({viewOrder.couponCode})</span>
                        <span>− {formatPrice(viewOrder.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-500">
                      <span>Delivery Charge</span>
                      <span>{viewOrder.deliveryCharge === 0 ? 'FREE' : formatPrice(viewOrder.deliveryCharge)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-dark text-base pt-1">
                      <span>Total</span>
                      <span>{formatPrice(viewOrder.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Update Status */}
            {activeTab === 'status' && (
              <div className="space-y-5">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
                  <strong>Current Status:</strong>{' '}
                  <span className={`badge ml-1 ${getOrderStatusColor(viewOrder.orderStatus)}`}>
                    {STATUS_ICONS[viewOrder.orderStatus]} {viewOrder.orderStatus}
                  </span>
                </div>

                {/* Status selector */}
                <div>
                  <label className="block text-sm font-semibold text-dark mb-3">Select New Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ORDER_STATUSES.map(s => (
                      <button
                        key={s}
                        onClick={() => setNewStatus(s)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition text-left ${
                          newStatus === s
                            ? 'border-mango bg-mango/10 text-mango-deep'
                            : 'border-gray-200 text-gray-600 hover:border-mango/40'
                        }`}
                      >
                        <span className="text-lg">{STATUS_ICONS[s]}</span>
                        <span className="capitalize">{s}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional message */}
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">
                    Custom Message <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    value={statusMessage}
                    onChange={(e) => setStatusMessage(e.target.value)}
                    placeholder="e.g. Your order is out for delivery"
                    className="input text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1">This message appears in the customer's tracking timeline.</p>
                </div>

                <button
                  onClick={handleStatusUpdate}
                  disabled={updatingStatus || newStatus === viewOrder.orderStatus}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingStatus ? 'Updating...' : `Update to "${newStatus}" ${STATUS_ICONS[newStatus]}`}
                </button>

                {newStatus === viewOrder.orderStatus && (
                  <p className="text-center text-xs text-gray-400">Select a different status to update</p>
                )}
              </div>
            )}

            {/* Tab: Assign Rider */}
            {activeTab === 'rider' && (
              <div className="space-y-5">
                {/* Current rider */}
                {viewOrder.rider?.name ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-3xl">🛵</span>
                    <div>
                      <p className="font-semibold text-dark">{viewOrder.rider.name}</p>
                      <p className="text-sm text-gray-600">{viewOrder.rider.phone}</p>
                    </div>
                    <a
                      href={`tel:${viewOrder.rider.phone}`}
                      className="ml-auto bg-green-100 text-green-700 hover:bg-green-200 px-3 py-2 rounded-lg text-sm font-medium transition"
                    >
                      📞 Call
                    </a>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 text-center text-gray-500 text-sm">
                    No rider assigned yet
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-1">
                      Rider Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={riderName}
                      onChange={(e) => setRiderName(e.target.value)}
                      placeholder="e.g. Rashid Ahmed"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-1">
                      Rider Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={riderPhone}
                      onChange={(e) => setRiderPhone(e.target.value)}
                      placeholder="e.g. +92-300-9999888"
                      className="input"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
                  <strong>Note:</strong> Assigning a rider will automatically set the order status to <strong>Dispatched</strong> and the customer will see the rider's name and phone on their tracking page with a call button.
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

            {/* Tab: Status History */}
            {activeTab === 'history' && (
              <div className="space-y-3">
                {viewOrder.statusHistory?.length === 0 && (
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
