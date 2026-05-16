import { Link } from 'react-router-dom'
import { useGetFeaturedProductsQuery } from '../../services/productApi.js'
import ProductCard from '../common/ProductCard.jsx'
import Loader from '../common/Loader.jsx'

export default function FeaturedProducts() {
  const { data, isLoading } = useGetFeaturedProductsQuery()
  const products = data?.data || []

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-display text-4xl font-bold text-dark mb-2">Featured Products</h2>
            <p className="text-gray-500">Handpicked favorites from our Multan store</p>
          </div>
          <Link to="/shop" className="btn-outline hidden md:block">View All →</Link>
        </div>
        {isLoading ? <Loader /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
        <div className="text-center mt-8 md:hidden">
          <Link to="/shop" className="btn-primary">View All Products</Link>
        </div>
      </div>
    </section>
  )
}
