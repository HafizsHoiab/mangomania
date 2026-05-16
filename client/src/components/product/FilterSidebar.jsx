import { useState } from 'react'

const CATEGORIES = [
  { label: 'All Products', value: '' },
  { label: '🥭 Mangoes', value: 'mangoes' },
  { label: '🥛 Dairy Products', value: 'dairy-products' },
  { label: '🍯 Multani Halwa', value: 'multani-halwa' },
  { label: '🫙 Desi Items', value: 'desi-items' },
]

export default function FilterSidebar({ filters, onChange }) {
  const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 10000])

  const handleCategory = (val) => onChange({ ...filters, category: val, page: 1 })
  const handlePrice = () => onChange({ ...filters, minPrice: priceRange[0], maxPrice: priceRange[1], page: 1 })
  const handleStock = (e) => onChange({ ...filters, inStock: e.target.checked ? 'true' : '', page: 1 })
  const handleReset = () => { onChange({}); setPriceRange([0, 10000]) }

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-dark text-lg">Filters</h3>
        <button onClick={handleReset} className="text-xs text-mango hover:underline">Reset All</button>
      </div>

      {/* Category */}
      <div className="mb-6">
        <p className="font-semibold text-dark text-sm mb-3">Category</p>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategory(cat.value)}
              className={`text-left text-sm px-3 py-2 rounded-lg transition ${
                filters.category === cat.value || (!filters.category && cat.value === '')
                  ? 'bg-mango text-white font-semibold'
                  : 'text-gray-600 hover:bg-mango/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <p className="font-semibold text-dark text-sm mb-3">Price Range</p>
        <div className="flex items-center gap-2 mb-3">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="input py-2 text-sm w-24"
            placeholder="Min"
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="input py-2 text-sm w-24"
            placeholder="Max"
          />
        </div>
        <button onClick={handlePrice} className="w-full btn-primary py-2 text-sm">Apply</button>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock === 'true'}
            onChange={handleStock}
            className="w-4 h-4 accent-mango"
          />
          <span className="text-sm text-gray-600">In Stock Only</span>
        </label>
      </div>
    </div>
  )
}
