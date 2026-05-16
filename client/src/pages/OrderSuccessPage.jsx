import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { formatPrice } from '../utils/formatPrice.js'
import { generateOrderId } from '../utils/helpers.js'

export default function OrderSuccessPage() {
  const { state } = useLocation()
  const [searchParams] = useSearchParams()
  const [order, setOrder] = useState(state?.order || null)
  const [loading, setLoading] = useState(false)
  const [paymentFailed, setPaymentFailed] = useState(false)

  const orderId = searchParams.get('orderId')
  const status = searchParams.get('status')

  useEffect(() => {
    // JazzCash redirect — fetch order from API using orderId in URL
    if (orderId && !order) {
      if (status === 'failed') {
        setPaymentFailed(true)
        return
      }
      setLoading(true)
      fetch(`/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('mangoAccessToken')}`,
        },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data?.data) setOrder(data.data)
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [orderId, status])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4 animate-spin">🥭</div>
        <p className="text-gray-500 text-lg">Loading your order...</p>
      </div>
    )
  }

  if (paymentFailed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-8xl mb-6">❌</div>
        <h1 className="font-display text-4xl font-bold text-dark mb-3">Payment Failed</h1>
        <p className="text-gray-500 text-lg mb-8">
          Your JazzCash payment was not completed. Your order has been saved — please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/checkout" className="btn-primary">Try Again</Link>
          <Link to="/orders" className="btn-outline">My Orders</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-8xl mb-6 animate-bounce">🥭</div>
      <h1 className="font-display text-4xl font-bold text-dark mb-3">Order Placed!</h1>
      <p className="text-gray-500 text-lg mb-8">
        Jazakallah for your order! We'll pack it with love and send it your way.
      </p>

      {order && (
        <div className="bg-cream rounded-2xl p-6 text-left mb-8 shadow-card">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Order ID</p>
              <p className="font-bold text-dark font-mono">{generateOrderId(order._id)}</p>
            </div>
            <div>
              <p className="text-gray-500">Total</p>
              <p className="font-bold text-dark">{formatPrice(order.totalAmount)}</p>
            </div>
            <div>
              <p className="text-gray-500">Payment</p>
              <p className="font-semibold text-dark capitalize">{order.paymentMethod?.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-semibold text-orange-600 capitalize">{order.orderStatus}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500">Delivery Address</p>
              <p className="font-medium text-dark">
                {order.shippingAddress?.street}, {order.shippingAddress?.city}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Estimated Delivery</p>
              <p className="font-semibold text-green-600">
                {order.shippingAddress?.city?.toLowerCase() === 'multan' ? 'Same day / Next day' : '2–4 business days'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/track-order" className="btn-primary">Track My Order 📦</Link>
        <Link to="/shop" className="btn-outline">Continue Shopping 🥭</Link>
      </div>
    </div>
  )
}
