import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useGetProductsQuery } from '../services/productApi.js'
import FilterSidebar from '../components/product/FilterSidebar.jsx'
import ProductGrid from '../components/product/ProductGrid.jsx'
import Pagination from '../components/common/Pagination.jsx'

const SORT_OPTIONS = [
  { label: 'Newest First', value: '-createdAt' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Top Rated', value: '-ratings.average' },
]

export default function ShopPage() {
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    page: 1,
    limit: 12,
    sort: '-createdAt',
    search: searchParams.get('search') || '',
  })

  useEffect(() => {
    const cat = searchParams.get('category') || ''
    setFilters(f => ({ ...f, category: cat, page: 1 }))
  }, [searchParams])

  const queryString = new URLSearchParams(
    Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined))
  ).toString()

  const { data, isLoading } = useGetProductsQuery(queryString)
  const products = data?.data || []
  const pagination = data?.pagination || {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="font-display text-4xl font-bold text-dark">Shop</h1>
        <p className="text-gray-500 mt-1">
          {pagination.total ? `${pagination.total} products found` : 'Exploring our desi collection...'}
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <FilterSidebar filters={filters} onChange={setFilters} />
        </div>

        {/* Main */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <input
              value={filters.search}
              onChange={(e) => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
              placeholder="🔍 Search mangoes, achaar, halwa..."
              className="input sm:max-w-xs py-2 text-sm"
            />
            <select
              value={filters.sort}
              onChange={(e) => setFilters(f => ({ ...f, sort: e.target.value, page: 1 }))}
              className="input py-2 text-sm w-auto"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <ProductGrid products={products} isLoading={isLoading} />
          <Pagination
            page={pagination.page || 1}
            pages={pagination.pages || 1}
            onPageChange={(p) => { setFilters(f => ({ ...f, page: p })); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          />
        </div>
      </div>
    </div>
  )
}
