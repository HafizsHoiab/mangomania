import ProductCard from '../common/ProductCard.jsx'
import Loader from '../common/Loader.jsx'

export default function ProductGrid({ products = [], isLoading }) {
  if (isLoading) return <Loader />
  if (!products.length) return (
    <div className="text-center py-20">
      <span className="text-6xl block mb-4">🥭</span>
      <p className="text-gray-500 text-lg">No products found</p>
    </div>
  )
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((p) => <ProductCard key={p._id} product={p} />)}
    </div>
  )
}
