import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { usePlaceOrderMutation } from '../services/orderApi.js'
import { useCart } from '../hooks/useCart.js'
import CheckoutSteps from '../components/checkout/CheckoutSteps.jsx'
import AddressForm from '../components/checkout/AddressForm.jsx'
import PaymentOptions from '../components/checkout/PaymentOptions.jsx'
import { formatPrice } from '../utils/formatPrice.js'
import { toast } from '../hooks/useToast.js'

export default function CheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { coupon, isGift: isGiftFromCart } = location.state || {}
  const user = useSelector((s) => s.auth.user)
  const isGuest = !user
  const { items, clearAllCart } = useCart()
  const [placeOrder] = usePlaceOrderMutation()
  const [step, setStep] = useState(1)
  const [address, setAddress] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState(isGiftFromCart ? 'manual' : 'manual')
  const [isPlacing, setIsPlacing] = useState(false)
  const [isGift, setIsGift] = useState(!!isGiftFromCart)
  const [giftDetails, setGiftDetails] = useState({ recipientName: '', recipientPhone: '', message: '' })
  const [transferConfirmed, setTransferConfirmed] = useState(false)

  const handleAddressSubmit = (data) => {
    setAddress(data)
    setStep(2)
  }

  const handlePlaceOrder = async () => {
    setIsPlacing(true)
    try {
      const validItems = items.filter((i) => i.product?._id)
      if (!validItems.length) {
        toast.error('Your cart appears empty. Please add items and try again.')
        setIsPlacing(false)
        return
      }

      if (isGift) {
        if (!giftDetails.recipientName.trim()) {
          toast.error('Please enter the recipient name for gift order.')
          setIsPlacing(false)
          return
        }
        if (!giftDetails.recipientPhone.trim()) {
          toast.error('Please enter the recipient phone for gift order.')
          setIsPlacing(false)
          return
        }
      }

      const orderPayload = {
        shippingAddress: {
          name: isGuest ? address.guestName : address.name,
          phone: address.phone,
          street: address.street,
          city: address.city,
          province: address.province,
          notes: address.notes,
        },
        paymentMethod,
        couponCode: coupon?.code,
        items: validItems.map((i) => ({ productId: i.product._id, qty: i.qty, variant: i.variant })),
      }

      if (isGuest) {
        orderPayload.guestName = address.guestName
        orderPayload.guestPhone = address.guestPhone
        orderPayload.guestEmail = address.guestEmail
      }

      if (isGift) {
        orderPayload.isGift = true
        orderPayload.giftRecipientName = giftDetails.recipientName
        orderPayload.giftRecipientPhone = giftDetails.recipientPhone
        orderPayload.giftMessage = giftDetails.message
      }

      const res = await placeOrder(orderPayload).unwrap()
      clearAllCart()
      navigate('/order-success', { state: { order: res.data } })
    } catch (err) {
      console.error('Place order error:', err)
      toast.error(err?.data?.message || 'Failed to place order. Please try again.')
    } finally {
      setIsPlacing(false)
    }
  }

  const hasPreOrder = items.some((i) => i.product?.isPreOrder)
  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0)
  const discount = coupon?.discount || 0
  const delivery = subtotal >= 3000 ? 0 : 200
  const orderTotal = subtotal - discount + delivery

  const canPlaceOrder = paymentMethod === 'cod' || (paymentMethod === 'manual' && transferConfirmed)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-4xl font-bold text-dark mb-6">Checkout</h1>

      {hasPreOrder && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3 items-start">
          <span className="text-2xl">🕐</span>
          <div>
            <p className="font-semibold text-amber-800">Your cart contains a Pre-Order item</p>
            <p className="text-amber-700 text-sm mt-0.5">Pre-order items will be dispatched once stock is available. You'll be notified by email.</p>
          </div>
        </div>
      )}

      {isGift && (
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 mb-6 flex gap-3 items-start">
          <span className="text-xl">🎁</span>
          <div>
            <p className="font-semibold text-pink-800">You're sending a Gift!</p>
            <p className="text-pink-700 text-sm mt-0.5">Fill in the recipient details below.</p>
          </div>
        </div>
      )}

      {isGuest && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex gap-3 items-start">
          <span className="text-xl">ℹ️</span>
          <div>
            <p className="font-semibold text-blue-800">Ordering as Guest</p>
            <p className="text-blue-700 text-sm mt-0.5">
              No account needed!{' '}
              <a href="/login" className="underline font-medium">Login</a> if you have one.
            </p>
          </div>
        </div>
      )}

      <CheckoutSteps current={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="card">
              <h2 className="font-display text-xl font-bold text-dark mb-6">Delivery Details</h2>
              <AddressForm
                defaultValues={isGuest ? {} : { name: user?.name, phone: user?.phone }}
                onSubmit={handleAddressSubmit}
                isGuest={isGuest}
              />
            </div>
          )}

          {step === 2 && (
            <div className="card space-y-6">
              <h2 className="font-display text-xl font-bold text-dark">Payment</h2>

              <PaymentOptions
                selected={paymentMethod}
                onSelect={(m) => {
                  setPaymentMethod(m)
                  setTransferConfirmed(false)
                  if (m === 'cod') setIsGift(false)
                }}
              />

              {/* Gift recipient details */}
              {isGift && (
                <div className="border-2 border-pink-200 bg-pink-50 rounded-2xl p-4 space-y-3">
                  <p className="font-semibold text-pink-700">🎁 Gift Recipient Details</p>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">Recipient Name <span className="text-red-500">*</span></label>
                    <input value={giftDetails.recipientName} onChange={(e) => setGiftDetails(g => ({ ...g, recipientName: e.target.value }))} placeholder="e.g. Ahmed Ali" className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">Recipient Phone <span className="text-red-500">*</span></label>
                    <input value={giftDetails.recipientPhone} onChange={(e) => setGiftDetails(g => ({ ...g, recipientPhone: e.target.value }))} placeholder="e.g. 03001234567" className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">Gift Message <span className="text-gray-400 font-normal">(optional)</span></label>
                    <textarea value={giftDetails.message} onChange={(e) => setGiftDetails(g => ({ ...g, message: e.target.value }))} placeholder="e.g. Eid Mubarak! Enjoy the best mangoes from Multan 🥭" className="input resize-none" rows={3} />
                  </div>
                </div>
              )}

              {/* Manual transfer confirmation checkbox */}
              {paymentMethod === 'manual' && (
                <label className="flex items-start gap-3 cursor-pointer bg-green-50 border-2 border-green-200 rounded-xl p-4">
                  <input
                    type="checkbox"
                    checked={transferConfirmed}
                    onChange={(e) => setTransferConfirmed(e.target.checked)}
                    className="w-5 h-5 mt-0.5 accent-green-600 flex-shrink-0"
                  />
                  <span className="text-sm text-green-800 font-medium">
                    I have noted the payment details and I will transfer the amount and send the slip on WhatsApp after placing the order.
                  </span>
                </label>
              )}

              {/* Place Order button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacing || !canPlaceOrder}
                className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isPlacing
                  ? 'Placing Order...'
                  : paymentMethod === 'cod'
                  ? 'Place Order (Pay on Delivery) 💵'
                  : 'Place Order & Send Slip on WhatsApp 📲'}
              </button>

              {paymentMethod === 'manual' && !transferConfirmed && (
                <p className="text-center text-xs text-gray-400">Please check the box above to confirm you have noted the payment details</p>
              )}

              <button onClick={() => setStep(1)} className="text-mango text-sm hover:underline block">
                ← Back to Details
              </button>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-2xl shadow-card p-6 h-fit sticky top-24">
          <h3 className="font-display font-bold text-dark text-lg mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm mb-4">
            {items.map((item) => (
              <div key={`${item.product?._id}-${item.variant}`} className="flex justify-between gap-2">
                <span className="text-gray-600 truncate">{item.product?.name} {item.variant ? `(${item.variant})` : ''} × {item.qty}</span>
                <span className="font-medium">{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
            <div className="border-t pt-2 space-y-1">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Coupon</span><span>−{formatPrice(discount)}</span></div>}
              <div className="flex justify-between text-gray-500"><span>Delivery</span><span>{delivery === 0 ? 'FREE 🎉' : formatPrice(delivery)}</span></div>
              <div className="flex justify-between font-bold text-dark text-base border-t mt-2 pt-2">
                <span>Total</span><span>{formatPrice(orderTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
