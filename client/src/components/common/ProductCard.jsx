import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addItem } from '../../store/slices/cartSlice.js'
import { toggleWishlist } from '../../store/slices/wishlistSlice.js'
import { formatPrice, formatDiscount } from '../../utils/formatPrice.js'
import StarRating from './StarRating.jsx'
import { toast } from '../../hooks/useToast.js'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const wishlistItems = useSelector((s) => s.wishlist.items)
  const isWishlisted = wishlistItems.some((i) => i._id === product._id)
  const discount = formatDiscount(product.price, product.salePrice)
  const image = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400'

  const handleAddToCart = (e) => {
    e.preventDefault()
    dispatch(addItem({ product, qty: 1 }))
    toast.success(product.isPreOrder ? `${product.name} added — pre-order 🥭` : `${product.name} added to cart 🥭`)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    dispatch(toggleWishlist(product))
    toast.info(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️')
  }

  return (
    <Link to={`/product/${product.slug}`} className="group block bg-white rounded-2xl shadow-card hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={product.name}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.isPreOrder && (
          <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            🕐 Pre-Order
          </span>
        )}
        {!product.isPreOrder && discount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            -{discount}%
          </span>
        )}
        {!product.isPreOrder && product.stock === 0 && (
          <div className="absolute inset-0 bg-dark/50 flex items-center justify-center">
            <span className="bg-white text-dark font-semibold px-4 py-2 rounded-xl text-sm">Out of Stock</span>
          </div>
        )}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow transition ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'}`}
        >
          ♥
        </button>
      </div>
      <div className="p-4">
        <p className="text-xs text-mango font-semibold uppercase tracking-wide mb-1">{product.category?.name || ''}</p>
        <h3 className="font-semibold text-dark text-sm leading-tight mb-2 line-clamp-2 group-hover:text-mango-deep transition">
          {product.name}
        </h3>
        <StarRating rating={product.ratings?.average} count={product.ratings?.count} />
        <div className="flex items-center gap-2 mt-2">
          {product.salePrice ? (
            <>
              <span className="font-bold text-dark">{formatPrice(product.salePrice)}</span>
              <span className="text-gray-400 text-sm line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="font-bold text-dark">{formatPrice(product.price)}</span>
          )}
        </div>
        {product.isPreOrder && product.preOrderNote && (
          <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-2 py-1 mt-2">{product.preOrderNote}</p>
        )}
        <button
          onClick={handleAddToCart}
          disabled={!product.isPreOrder && product.stock === 0}
          className={`w-full mt-3 font-semibold py-2 rounded-xl text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            product.isPreOrder
              ? 'bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white'
              : 'bg-mango/10 hover:bg-mango text-mango hover:text-white'
          }`}
        >
          {product.isPreOrder ? 'Pre-Order Now 🥭' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart 🛒'}
        </button>
      </div>
    </Link>
  )
}
