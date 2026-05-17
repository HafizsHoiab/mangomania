import { Link, useNavigate } from 'react-router-dom'
import { formatPrice } from '../../utils/formatPrice.js'
import { calcDelivery, FREE_DELIVERY_THRESHOLD } from '../../utils/helpers.js'
import CouponInput from './CouponInput.jsx'
import { useState } from 'react'

export default function OrderSummary({ items, showCheckout = true }) {
  const [coupon, setCoupon] = useState({ code: '', discount: 0 })
  const navigate = useNavigate()
  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0)
  const delivery = calcDelivery(subtotal)
  const total = subtotal - coupon.discount + delivery

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
      <h3 className="font-display text-xl font-bold text-dark mb-6">Order Summary</h3>
      <div className="space-y-3 text-sm mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({items.reduce((a, i) => a + i.qty, 0)} items)</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {coupon.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Coupon Discount</span>
            <span>− {formatPrice(coupon.discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600">
          <span>Delivery</span>
          <span className={delivery === 0 ? 'text-green-600 font-semibold' : ''}>
            {delivery === 0 ? 'FREE 🎉' : formatPrice(delivery)}
          </span>
        </div>
        {subtotal < FREE_DELIVERY_THRESHOLD && (
          <p className="text-xs text-mango bg-mango/10 px-3 py-2 rounded-lg">
            Add {formatPrice(FREE_DELIVERY_THRESHOLD - subtotal)} more for free delivery!
          </p>
        )}
        <div className="border-t pt-3 flex justify-between font-bold text-dark text-base">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      <div className="mb-4">
        <CouponInput subtotal={subtotal} onApply={setCoupon} />
      </div>
      {showCheckout && (
        <div className="flex flex-col gap-3">
          <Link
            to="/checkout"
            state={{ coupon, total, subtotal, delivery }}
            className="btn-primary w-full text-center block text-sm"
          >
            🛒 Checkout for Yourself
          </Link>
          <button
            onClick={() => navigate('/checkout', { state: { coupon, total, subtotal, delivery, isGift: true } })}
            className="w-full py-3 px-4 rounded-xl border-2 border-pink-300 bg-pink-50 text-pink-700 font-semibold text-sm hover:bg-pink-100 transition"
          >
            🎁 Gift to Your Loved Ones
          </button>
        </div>
      )}
    </div>
  )
}
