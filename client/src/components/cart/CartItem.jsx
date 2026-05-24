import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart.js'
import { formatPrice } from '../../utils/formatPrice.js'
import QuantityControl from '../product/QuantityControl.jsx'

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart()
  const image = item.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200'

  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0">
      <Link to={`/product/${item.product?.slug}`}>
        <img src={image} alt={item.product?.name} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/product/${item.product?.slug}`} className="font-semibold text-dark text-sm hover:text-mango transition line-clamp-2">
          {item.product?.name}
        </Link>
        {item.variant && <p className="text-gray-400 text-xs mt-1">{item.variant}</p>}
        {item.product?.expectedDelivery && (
          <p className="text-green-600 text-xs mt-1">🚚 {item.product.expectedDelivery}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <QuantityControl
            qty={item.qty}
            max={item.product?.stock || 99}
            onIncrease={() => updateQuantity(item.product._id, item.variant, item.qty + 1)}
            onDecrease={() => {
              if (item.qty === 1) removeFromCart(item.product._id, item.variant)
              else updateQuantity(item.product._id, item.variant, item.qty - 1)
            }}
          />
          <div className="text-right">
            <p className="font-bold text-dark">{formatPrice(item.price * item.qty)}</p>
            <p className="text-gray-400 text-xs">{formatPrice(item.price)} each</p>
          </div>
        </div>
      </div>
      <button
        onClick={() => removeFromCart(item.product._id, item.variant)}
        className="text-gray-400 hover:text-red-500 transition text-lg p-1"
      >
        ✕
      </button>
    </div>
  )
}
