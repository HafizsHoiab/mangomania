import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdminSidebar from '../../components/admin/AdminSidebar.jsx'
import ProductsTable from '../../components/admin/ProductsTable.jsx'
import { useGetProductsQuery } from '../../services/productApi.js'
import Loader from '../../components/common/Loader.jsx'

export default function AdminProducts() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useGetProductsQuery(`search=${search}&limit=50`)
  const products = data?.data || []

  return (
    <div className="flex w-full">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold text-dark">Products</h1>
          <Link to="/admin/products/add" className="btn-primary">+ Add Product</Link>
        </div>
        <div className="mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search products..."
            className="input max-w-xs py-2 text-sm"
          />
        </div>
        {isLoading ? <Loader /> : (
          <div className="bg-white rounded-2xl shadow-card p-6">
            <ProductsTable products={products} />
          </div>
        )}
      </div>
    </div>
  )
}
