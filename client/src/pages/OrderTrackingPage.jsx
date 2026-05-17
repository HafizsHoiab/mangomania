import { useState, useEffect } from 'react'
import { useGetPublicOrderQuery, useTrackByPhoneQuery } from '../services/orderApi.js'
import { useLocation, useSearchParams } from 'react-router-dom'
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
  const [searchParams] = useSearchParams()
  const [searchMode, setSearchMode] = useState('id') // 'id' or 'phone'
  const [inputValue, setInputValue] = useState('')
  const [searchId, setSearchId] = useState('')
  const [searchPhone, setSearchPhone] = useState('')

  // Auto-fill from URL params (JazzCash return or email link)
  useEffect(() => {
    const urlOrderId = searchParams.get('orderId')
    if (urlOrderId) {
      setSearchId(urlOrderId)
      setInputValue(urlOrderId)
      setSearchMode('id')
    } else if (location.state?.orderId) {
      setSearchId(location.state.orderId)
      setInputValue(location.state.orderId)
      setSearchMode('id')
    }
  }, [location.state, searchParams])

  const { data: orderData, isLoading: orderLoading, isError: orderError } = useGetPublicOrderQuery(searchId, { skip: !searchId })
  const { data: phoneData, isLoading: phoneLoading, isError: phoneError } = useTrackByPhoneQuery(searchPhone, { skip: !searchPhone })

  const order = orderData?.data
  const phoneOrders = phoneData?.data || []
  const isLoading = orderLoading || phoneLoading
  const isError = (searchId && orderError) || (searchPhone && phoneError)

  const STATUS_STEPS = order?.isPreOrder ? PREORDER_STEPS : REGULAR_STEPS
  const currentStepIndex = order ? STATUS_STEPS.indexOf(order.orderStatus) : -1

  const handleSearch = () => {
    if (searchMode === 'id') {
      setSearchPhone('')
      setSearchId(inputValue.replace('#', '').trim())
    } else {
      setSearchId('')
      setSearchPhone(inputValue.trim())
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl font-bold text-dark mb-3">Track Your Order</h1>
        <p className="text-gray-500">Use your Order ID or phone number to check your order status</p>
      </div>

      {/* Search */}
      <div className="max-w-lg mx-auto mb-10">
        <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-3">
          <button
            onClick={() => setSearchMode('id')}
            className={`flex-1 py-2 text-sm font-medium transition ${searchMode === 'id' ? 'bg-mango text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >Order ID</button>
          <button
            onClick={() => setSearchMode('phone')}
            className={`flex-1 py-2 text-sm font-medium transition ${searchMode === 'phone' ? 'bg-mango text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >Phone Number</button>
        </div>
        <div className="flex gap-3">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={searchMode === 'id' ? 'Enter Order ID (e.g. #A1B2C3D4)' : 'Enter phone number (e.g. 03001234567)'}
            className="input flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="btn-primary">Track</button>
        </div>
      </div>

      {isLoading && <Loader />}
      {isError && <p className="text-center text-red-500">Not found. Please check and try again.</p>}

      {/* Phone search results — show list of orders */}
      {!isLoading && searchPhone && phoneOrders.length > 0 && !order && (
        <div className="space-y-3 mb-8">
          <p className="text-gray-600 font-medium">Found {phoneOrders.length} order(s) for this number:</p>
          {phoneOrders.map((o) => (
            <button
              key={o._id}
              onClick={() => { setSearchMode('id'); setInputValue(o._id); setSearchId(o._id); setSearchPhone(''); }}
              className="w-full bg-white rounded-xl shadow-card p-4 flex justify-between items-center hover:shadow-md transition text-left"
            >
              <div>
                <p className="font-bold text-dark font-mono">#{o._id.slice(-8).toUpperCase()}</p>
                <p className="text-sm text-gray-500">{formatDate(o.createdAt)} · {o.items.length} item(s)</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-dark">{formatPrice(o.totalAmount)}</p>
                <span className="text-xs bg-mango/10 text-mango px-2 py-0.5 rounded-full capitalize">{o.orderStatus}</span>
              </div>
            </button>
          ))}
        </div>
      )}
      {!isLoading && searchPhone && phoneOrders.length === 0 && !phoneLoading && (
        <p className="text-center text-red-500">No orders found for this phone number.</p>
      )}

      {order && (
        <div className="space-y-6">
          {/* Pre-order notice */}
          {order.isPreOrder && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-start">
              <span className="text-2xl">🕐</span>
              <div>
                <p className="font-semibold text-amber-800">This is a Pre-Order</p>
                <p className="text-amber-700 text-sm mt-0.5">
                  {order.paymentMethod === 'cod'
                    ? 'Your order is confirmed. Payment will be collected on delivery once stock is available and dispatched.'
                    : 'Your payment is confirmed. We will start processing your order as soon as stock becomes available and notify you via email.'}
                </p>
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
