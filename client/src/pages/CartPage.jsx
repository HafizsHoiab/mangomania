import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart.js'
import CartItem from '../components/cart/CartItem.jsx'
import OrderSummary from '../components/cart/OrderSummary.jsx'

export default function CartPage() {
  const { items } = useCart()

  if (items.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <span className="text-7xl block mb-6">🛒</span>
      <h2 className="font-display text-3xl font-bold text-dark mb-3">Your cart is empty</h2>
      <p className="text-gray-500 mb-8">Add some delicious desi products to get started!</p>
      <Link to="/shop" className="btn-primary">Start Shopping 🥭</Link>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-4xl font-bold text-dark mb-8">Your Cart 🛒</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-card p-6">
            {items.map((item) => <CartItem key={`${item.product?._id}-${item.variant}`} item={item} />)}
          </div>
        </div>
        <div>
          <OrderSummary items={items} showCheckout />
        </div>
      </div>
    </div>
  )
}
