import { useState, useEffect } from 'react'
import { useGetOrderByIdQuery } from '../services/orderApi.js'
import { useLocation } from 'react-router-dom'
import { formatDate, formatDateTime } from '../utils/formatDate.js'
import { formatPrice } from '../utils/formatPrice.js'
import { generateOrderId } from '../utils/helpers.js'
import Loader from '../components/common/Loader.jsx'

const REGULAR_STEPS = ['pending', 'confirmed', 'packed', 'dispatched', 'delivered']
const PREORDER_STEPS = ['pre_order', 'confirmed', 'packed', 'dispatched', 'delivered']
const STATUS_LABELS = {
  pre_order: 'Pre-Order Placed',
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  packed: 'Packed',
  dispatched: 'On the Way',
  delivered: 'Delivered',
}
const STATUS_ICONS = { pre_order: '🕐', pending: '📝', confirmed: '✅', packed: '📦', dispatched: '🚗', delivered: '🥭' }

export default function OrderTrackingPage() {
  const location = useLocation()
  const [orderId, setOrderId] = useState('')
  const [searchId, setSearchId] = useState('')

  // Auto-fill if navigated from Profile page with orderId in state
  useEffect(() => {
    if (location.state?.orderId) {
      setSearchId(location.state.orderId)
      setOrderId(location.state.orderId)
    }
  }, [location.state])

  const { data, isLoading, isError } = useGetOrderByIdQuery(searchId, { skip: !searchId })
  const order = data?.data

  const STATUS_STEPS = order?.isPreOrder ? PREORDER_STEPS : REGULAR_STEPS
  const currentStepIndex = order ? STATUS_STEPS.indexOf(order.orderStatus) : -1

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl font-bold text-dark mb-3">Track Your Order</h1>
        <p className="text-gray-500">Enter your order ID to see real-time status</p>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-10 max-w-lg mx-auto">
        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter Order ID (e.g. #A1B2C3D4)"
          className="input flex-1"
          onKeyDown={(e) => e.key === 'Enter' && setSearchId(orderId.replace('#', ''))}
        />
        <button onClick={() => setSearchId(orderId.replace('#', ''))} className="btn-primary">Track</button>
      </div>

      {isLoading && <Loader />}
      {isError && <p className="text-center text-red-500">Order not found. Check your order ID.</p>}

      {order && (
        <div className="space-y-6">
          {/* Pre-order notice */}
          {order.isPreOrder && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-start">
              <span className="text-2xl">🕐</span>
              <div>
                <p className="font-semibold text-amber-800">This is a Pre-Order</p>
                <p className="text-amber-700 text-sm mt-0.5">Your payment is confirmed. We will start processing your order as soon as stock becomes available and notify you via email.</p>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="bg-white rounded-2xl shadow-card p-6 flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <p className="text-gray-500 text-sm">Order ID</p>
              <p className="font-bold text-dark font-mono text-xl">{generateOrderId(order._id)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Placed on</p>
              <p className="font-medium">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total</p>
              <p className="font-bold text-dark">{formatPrice(order.totalAmount)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Payment</p>
              <p className="font-medium capitalize">{order.paymentMethod}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="font-display font-bold text-dark text-lg mb-6">Order Status</h3>
            <div className="relative">
              {STATUS_STEPS.map((status, i) => {
                const isDone = i <= currentStepIndex
                const isCurrent = i === currentStepIndex
                const isCancelled = order.orderStatus === 'cancelled'
                const isPreOrderStep = status === 'pre_order'
                return (
                  <div key={status} className="flex items-start gap-4 mb-6 last:mb-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition ${
                        isCancelled ? 'bg-red-100 text-red-400'
                        : isCurrent && isPreOrderStep ? 'bg-amber-500 text-white shadow-lg'
                        : isDone ? 'bg-mango text-white shadow-lg'
                        : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCancelled ? '✗' : isDone ? STATUS_ICONS[status] : '○'}
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={`w-0.5 h-8 mt-1 ${isDone && i < currentStepIndex ? 'bg-mango' : 'bg-gray-200'}`} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className={`font-semibold ${
                        isCurrent && isPreOrderStep ? 'text-amber-600'
                        : isCurrent ? 'text-mango'
                        : isDone ? 'text-dark'
                        : 'text-gray-400'
                      }`}>
                        {STATUS_LABELS[status]}
                        {isCurrent && (
                          <span className={`ml-2 badge text-xs ${isPreOrderStep ? 'bg-amber-100 text-amber-700' : 'bg-mango/10 text-mango'}`}>
                            Current
                          </span>
                        )}
                      </p>
                      {order.statusHistory?.filter(h => h.status === status).map((h, j) => (
                        <p key={j} className="text-gray-400 text-xs mt-1">{h.message} · {formatDateTime(h.timestamp)}</p>
                      ))}
                    </div>
                  </div>
                )
              })}
              {order.orderStatus === 'cancelled' && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center font-bold">✗</div>
                  <p className="font-semibold text-red-600">Order Cancelled</p>
                </div>
              )}
            </div>
          </div>

          {/* Rider info */}
          {order.rider?.name && (
            <div className="bg-white rounded-2xl shadow-card p-6 flex items-center gap-4">
              <span className="text-4xl">🛵</span>
              <div>
                <p className="font-semibold text-dark">Your Rider</p>
                <p className="text-gray-600">{order.rider.name}</p>
              </div>
              <a href={`tel:${order.rider.phone}`} className="ml-auto btn-primary py-2 px-4 text-sm">
                📞 Call Rider
              </a>
            </div>
          )}

          {/* Delivery address */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="font-semibold text-dark mb-3">Delivery Address</h3>
            <p className="text-gray-600">{order.shippingAddress?.name}</p>
            <p className="text-gray-600">{order.shippingAddress?.phone}</p>
            <p className="text-gray-600">{order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.province}</p>
          </div>
        </div>
      )}
    </div>
  )
}
