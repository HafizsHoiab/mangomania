import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { usePlaceOrderMutation } from '../services/orderApi.js'
import { useInitiateJazzCashMutation } from '../services/paymentApi.js'
import { useCart } from '../hooks/useCart.js'
import CheckoutSteps from '../components/checkout/CheckoutSteps.jsx'
import AddressForm from '../components/checkout/AddressForm.jsx'
import PaymentOptions from '../components/checkout/PaymentOptions.jsx'
import JazzCashForm from '../components/checkout/JazzCashForm.jsx'
import EasyPaisaForm from '../components/checkout/EasyPaisaForm.jsx'
import CardForm from '../components/checkout/CardForm.jsx'
import { formatPrice } from '../utils/formatPrice.js'
import { toast } from '../hooks/useToast.js'

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [address, setAddress] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [isPlacing, setIsPlacing] = useState(false)
  const { items, clearAllCart } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const { coupon, total } = location.state || {}
  const user = useSelector((s) => s.auth.user)
  const [placeOrder] = usePlaceOrderMutation()
  const [initiateJazzCash] = useInitiateJazzCashMutation()

  const handleAddressSubmit = (data) => {
    setAddress(data)
    setStep(2)
  }

  const handlePlaceOrder = async (extraData = {}) => {
    setIsPlacing(true)
    try {
      // Step 1: Place the order
      const validItems = items.filter((i) => i.product?._id)
      if (!validItems.length) {
        toast.error('Your cart appears empty. Please add items and try again.')
        setIsPlacing(false)
        return
      }

      const res = await placeOrder({
        shippingAddress: address,
        paymentMethod,
        couponCode: coupon?.code,
        items: validItems.map((i) => ({ productId: i.product._id, qty: i.qty, variant: i.variant })),
      }).unwrap()

      const order = res.data
      clearAllCart()

      // Step 2: Handle JazzCash redirect
      if (paymentMethod === 'jazzcash' && extraData.mobileNumber) {
        const jcRes = await initiateJazzCash({
          orderId: order._id,
          amount: order.totalAmount,
          mobileNumber: extraData.mobileNumber,
        }).unwrap()

        const { params, postURL } = jcRes.data

        // Create a hidden form and submit to JazzCash
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = postURL
        Object.entries(params).forEach(([key, value]) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = value
          form.appendChild(input)
        })
        document.body.appendChild(form)
        form.submit()
        return
      }

      // Step 3: For COD and other methods go to success page
      navigate('/order-success', { state: { order } })
    } catch (err) {
      console.error('Place order error:', err)
      toast.error(err?.data?.message || err?.error || 'Failed to place order. Please try again.')
    } finally {
      setIsPlacing(false)
    }
  }

  const hasPreOrder = items.some((i) => i.product?.isPreOrder)
  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0)
  const discount = coupon?.discount || 0
  const delivery = subtotal >= 3000 ? 0 : 200
  const orderTotal = subtotal - discount + delivery

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-4xl font-bold text-dark mb-6">Checkout</h1>

      {hasPreOrder && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3 items-start">
          <span className="text-2xl">🕐</span>
          <div>
            <p className="font-semibold text-amber-800">Your cart contains a Pre-Order item</p>
            <p className="text-amber-700 text-sm mt-0.5">Full payment is collected now. Pre-order items will be dispatched once stock is available. You'll receive an email update when ready.</p>
          </div>
        </div>
      )}

      <CheckoutSteps current={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main area */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="card">
              <h2 className="font-display text-xl font-bold text-dark mb-6">Delivery Details</h2>
              <AddressForm
                defaultValues={{ name: user?.name, phone: user?.phone }}
                onSubmit={handleAddressSubmit}
              />
            </div>
          )}

          {step === 2 && (
            <div className="card">
              <h2 className="font-display text-xl font-bold text-dark mb-6">Payment Method</h2>
              <PaymentOptions selected={paymentMethod} onSelect={setPaymentMethod} />

              {paymentMethod === 'jazzcash' && (
                <JazzCashForm onSubmit={(data) => handlePlaceOrder({ mobileNumber: data.mobileNumber })} isLoading={isPlacing} />
              )}
              {paymentMethod === 'easypaisa' && (
                <EasyPaisaForm onSubmit={() => handlePlaceOrder()} isLoading={isPlacing} />
              )}
              {paymentMethod === 'card' && (
                <CardForm onSubmit={() => handlePlaceOrder()} isLoading={isPlacing} />
              )}
              {paymentMethod === 'cod' && (
                <button
                  onClick={() => handlePlaceOrder()}
                  disabled={isPlacing}
                  className="btn-primary w-full mt-6"
                >
                  {isPlacing ? 'Placing Order...' : 'Place Order (Pay on Delivery) 💵'}
                </button>
              )}

              <button onClick={() => setStep(1)} className="text-mango text-sm hover:underline mt-4 block">
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
                <span className="text-gray-600 truncate">{item.product?.name} × {item.qty}</span>
                <span className="font-medium">{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
            <div className="border-t pt-2">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Coupon</span><span>−{formatPrice(discount)}</span></div>}
              <div className="flex justify-between text-gray-500"><span>Delivery</span><span>{delivery === 0 ? 'FREE' : formatPrice(delivery)}</span></div>
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
