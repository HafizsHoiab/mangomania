import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetProductBySlugQuery } from '../services/productApi.js'
import { useGetProductReviewsQuery } from '../services/reviewApi.js'
import { useSelector, useDispatch } from 'react-redux'
import { addItem } from '../store/slices/cartSlice.js'
import { toggleWishlist } from '../store/slices/wishlistSlice.js'
import ProductImageGallery from '../components/product/ProductImageGallery.jsx'
import VariantSelector from '../components/product/VariantSelector.jsx'
import QuantityControl from '../components/product/QuantityControl.jsx'
import StarRating from '../components/common/StarRating.jsx'
import ReviewCard from '../components/product/ReviewCard.jsx'
import ReviewForm from '../components/product/ReviewForm.jsx'
import Loader from '../components/common/Loader.jsx'
import { formatPrice, formatDiscount } from '../utils/formatPrice.js'
import { toast } from '../hooks/useToast.js'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const [qty, setQty] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const wishlistItems = useSelector((s) => s.wishlist.items)

  const { data: productData, isLoading } = useGetProductBySlugQuery(slug)
  const product = productData?.data
  const { data: reviewData } = useGetProductReviewsQuery(product?._id, { skip: !product?._id })
  const reviews = reviewData?.data || []

  const isWishlisted = wishlistItems.some((i) => i._id === product?._id)
  const activePrice = selectedVariant?.price || product?.salePrice || product?.price || 0
  const discount = formatDiscount(selectedVariant?.price || product?.price, product?.salePrice)

  const handleAddToCart = () => {
    if (!product) return
    if (product.variants?.length > 0 && !selectedVariant) {
      toast.error('Please select a box size first')
      return
    }
    dispatch(addItem({ product, qty, variant: selectedVariant?.label, price: selectedVariant?.price || product.salePrice || product.price }))
    toast.success(`${product.name} added to cart 🥭`)
  }

  const handleWishlist = () => {
    if (!product) return
    dispatch(toggleWishlist(product))
    toast.info(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️')
  }

  if (isLoading) return <Loader />
  if (!product) return <div className="text-center py-20 text-gray-500">Product not found</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <ProductImageGallery images={product.images} />

        {/* Details */}
        <div>
          <p className="text-mango font-semibold text-sm uppercase tracking-wide mb-2">{product.category?.name}</p>
          <h1 className="font-display text-3xl font-bold text-dark mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={product.ratings?.average} count={product.ratings?.count} size="md" />
            <span className="text-gray-400 text-sm">({reviews.length} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-dark">{formatPrice(activePrice)}</span>
            {product.salePrice && !selectedVariant && (
              <span className="text-gray-400 text-lg line-through">{formatPrice(product.price)}</span>
            )}
            {discount && !selectedVariant && (
              <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded-lg">-{discount}% OFF</span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Pre-order notice */}
          {product.isPreOrder && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3 items-start">
              <span className="text-2xl">🕐</span>
              <div>
                <p className="font-semibold text-amber-800">Pre-Order Available</p>
                {product.preOrderNote && (
                  <p className="text-amber-700 text-sm mt-0.5">{product.preOrderNote}</p>
                )}
                <p className="text-amber-600 text-xs mt-1">Full payment is collected now. Your order will be dispatched as soon as stock arrives.</p>
              </div>
            </div>
          )}

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div className="mb-6">
              <VariantSelector variants={product.variants} selected={selectedVariant} onSelect={setSelectedVariant} />
            </div>
          )}

          {/* Qty */}
          <div className="flex items-center gap-4 mb-6">
            <div>
              <p className="text-sm font-medium text-dark mb-2">Quantity</p>
              <QuantityControl
                qty={qty}
                max={selectedVariant?.stock || product.stock}
                onIncrease={() => setQty(q => q + 1)}
                onDecrease={() => setQty(q => Math.max(1, q - 1))}
              />
            </div>
            <p className={`text-sm mt-6 font-semibold ${
              product.isPreOrder ? 'text-amber-600'
              : product.stock > 0 ? 'text-green-600'
              : 'text-red-500'
            }`}>
              {product.isPreOrder ? '🕐 Pre-order' : product.stock > 0 ? `✓ ${product.stock} in stock` : '✗ Out of stock'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={!product.isPreOrder && product.stock === 0}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                product.isPreOrder
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'btn-primary'
              }`}
            >
              {product.isPreOrder ? 'Pre-Order Now 🥭' : 'Add to Cart 🛒'}
            </button>
            <button
              onClick={handleWishlist}
              className={`px-5 py-3 rounded-xl border-2 transition font-semibold ${isWishlisted ? 'border-red-400 text-red-500 bg-red-50' : 'border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-500'}`}
            >
              {isWishlisted ? '❤️' : '🤍'}
            </button>
          </div>

          {/* Meta */}
          <div className="bg-cream rounded-xl p-4 space-y-2 text-sm">
            {product.sku && <div className="flex gap-3"><span className="text-gray-500 w-24">SKU:</span><span className="font-medium">{product.sku}</span></div>}
            {product.weight && <div className="flex gap-3"><span className="text-gray-500 w-24">Weight:</span><span className="font-medium">{product.weight}</span></div>}
            <div className="flex gap-3"><span className="text-gray-500 w-24">Delivery:</span><span className="font-medium">Free on orders above Rs. 3,000</span></div>
            <div className="flex gap-3"><span className="text-gray-500 w-24">Payment:</span><span className="font-medium">JazzCash · EasyPaisa · Card · COD</span></div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl font-bold text-dark mb-6">Customer Reviews ({reviews.length})</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => <ReviewCard key={r._id} review={r} />)}
            </div>
          )}
        </div>
        <div>
          <ReviewForm productId={product._id} />
        </div>
      </div>
    </div>
  )
}
