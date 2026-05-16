import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/formatPrice.js'
import { useDeleteProductMutation } from '../../services/productApi.js'
import { toast } from '../../hooks/useToast.js'

export default function ProductsTable({ products = [] }) {
  const [deleteProduct] = useDeleteProductMutation()

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    try {
      await deleteProduct(id).unwrap()
      toast.success('Product deleted')
    } catch { toast.error('Failed to delete') }
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['Image', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {products.map((p) => (
            <tr key={p._id} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3">
                <img src={p.images?.[0]?.url || ''} alt={p.name} className="w-12 h-12 object-cover rounded-lg" />
              </td>
              <td className="px-4 py-3">
                <p className="font-medium text-dark line-clamp-1">{p.name}</p>
                <p className="text-gray-400 text-xs">{p.sku}</p>
              </td>
              <td className="px-4 py-3 text-gray-500">{p.category?.name}</td>
              <td className="px-4 py-3">
                {p.salePrice ? (
                  <div>
                    <p className="font-semibold text-dark">{formatPrice(p.salePrice)}</p>
                    <p className="text-gray-400 text-xs line-through">{formatPrice(p.price)}</p>
                  </div>
                ) : <p className="font-semibold text-dark">{formatPrice(p.price)}</p>}
              </td>
              <td className="px-4 py-3">
                <span className={`badge ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`badge ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {p.isActive ? 'Active' : 'Hidden'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Link to={`/admin/products/edit/${p._id}`} className="text-mango hover:underline text-xs font-semibold">Edit</Link>
                  <button onClick={() => handleDelete(p._id, p.name)} className="text-red-500 hover:underline text-xs font-semibold">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!products.length && <p className="text-center text-gray-400 py-10">No products found</p>}
    </div>
  )
}
