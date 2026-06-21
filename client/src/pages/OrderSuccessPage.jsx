import { Link, useLocation } from 'react-router-dom'
import { formatPrice } from '../utils/formatPrice.js'
import { generateOrderId } from '../utils/helpers.js'

export default function OrderSuccessPage() {
  const { state } = useLocation()
  const order = state?.order || null

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-8xl mb-6 animate-bounce">🥭</div>
      <h1 className="font-display text-4xl font-bold text-dark mb-3">Order Placed!</h1>
      <p className="text-gray-500 text-lg mb-4">
        Jazakallah for your order! We'll pack it with love and send it your way.
      </p>

      {/* Manual payment WhatsApp slip reminder */}
      {order?.paymentMethod === 'manual' && (
        <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-5 mb-6 text-left max-w-lg mx-auto">
          <p className="font-bold text-green-800 text-base mb-2">📲 Last Step — Send Your Payment Slip</p>
          <p className="text-green-700 text-sm mb-4">
            Please send your transfer screenshot on WhatsApp. Your order will be confirmed once we verify it.
          </p>
          <a
            href={`https://wa.me/923700044688?text=${encodeURIComponent(`Assalam o Alaikum! I just placed an order on Mango Mania.\n\nOrder ID: #${order._id?.slice(-8).toUpperCase()}\nAmount: Rs. ${order.totalAmount?.toLocaleString()}\n\nAttaching payment slip below.`)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 px-5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition text-sm"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.843L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.884 0-3.652-.493-5.188-1.357l-.372-.22-3.862.92.961-3.77-.242-.39A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            Send Slip on WhatsApp
          </a>
        </div>
      )}

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
              <p className="font-semibold text-dark capitalize">
                {order.paymentMethod === 'manual' ? 'Bank / Wallet Transfer' : 'Cash on Delivery'}
              </p>
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

          {/* Gift details */}
          {order.isGift && (
            <div className="mt-4 pt-4 border-t border-amber-200 bg-pink-50 rounded-xl p-4">
              <p className="text-sm font-bold text-pink-700 mb-2">🎁 Gift Order</p>
              <p className="text-sm text-gray-700"><span className="text-gray-500">For:</span> {order.giftRecipientName}</p>
              <p className="text-sm text-gray-700"><span className="text-gray-500">Phone:</span> {order.giftRecipientPhone}</p>
              {order.giftMessage && (
                <p className="text-sm text-gray-500 italic mt-1">"{order.giftMessage}"</p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/track-order" className="btn-primary">Track My Order 📦</Link>
        <Link to="/shop" className="btn-outline">Continue Shopping 🥭</Link>
      </div>
    </div>
  )
}
