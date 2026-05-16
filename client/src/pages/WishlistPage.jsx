import { useSelector, useDispatch } from 'react-redux'
import { toggleWishlist } from '../store/slices/wishlistSlice.js'
import { addItem } from '../store/slices/cartSlice.js'
import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/formatPrice.js'
import { toast } from '../hooks/useToast.js'

export default function WishlistPage() {
  const dispatch = useDispatch()
  const items = useSelector((s) => s.wishlist.items)

  if (!items.length) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <span className="text-7xl block mb-6">❤️</span>
      <h2 className="font-display text-3xl font-bold text-dark mb-3">Your wishlist is empty</h2>
      <p className="text-gray-500 mb-8">Save products you love to your wishlist!</p>
      <Link to="/shop" className="btn-primary">Start Exploring 🥭</Link>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-4xl font-bold text-dark mb-8">My Wishlist ❤️ ({items.length})</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((product) => (
          <div key={product._id} className="card p-0 overflow-hidden group">
            <Link to={`/product/${product.slug}`}>
              <img
                src={product.images?.[0]?.url || ''}
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <div className="p-4">
              <Link to={`/product/${product.slug}`} className="font-semibold text-dark hover:text-mango text-sm line-clamp-2">{product.name}</Link>
              <div className="flex items-center justify-between mt-3">
                <p className="font-bold text-dark">{formatPrice(product.salePrice || product.price)}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { dispatch(addItem({ product, qty: 1 })); toast.success('Added to cart 🥭') }}
                    className="text-xs bg-mango/10 text-mango hover:bg-mango hover:text-white px-3 py-1.5 rounded-lg transition"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => { dispatch(toggleWishlist(product)); toast.info('Removed from wishlist') }}
                    className="text-xs text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
