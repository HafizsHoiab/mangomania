import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminSidebar from '../../components/admin/AdminSidebar.jsx'
import { useUpdateProductMutation, useGetProductsQuery, useGetCategoriesQuery } from '../../services/productApi.js'
import { toast } from '../../hooks/useToast.js'
import Loader from '../../components/common/Loader.jsx'

export default function AdminEditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [updateProduct, { isLoading }] = useUpdateProductMutation()
  const { data: catData } = useGetCategoriesQuery()
  const { data: productData, isLoading: productLoading } = useGetProductsQuery(`limit=200`)
  const categories = catData?.data || []
  const allProducts = productData?.data || []
  const product = allProducts.find(p => p._id === id)

  const [form, setForm] = useState(null)

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        salePrice: product.salePrice || '',
        category: product.category?._id || '',
        stock: product.stock || 0,
        weight: product.weight || '',
        sku: product.sku || '',
        isFeatured: product.isFeatured || false,
        isActive: product.isActive !== false,
        isPreOrder: product.isPreOrder || false,
        preOrderNote: product.preOrderNote || '',
        images: product.images?.length ? product.images : [{ url: '', public_id: '' }],
      })
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { id, ...form, price: Number(form.price), salePrice: form.salePrice ? Number(form.salePrice) : undefined, stock: Number(form.stock), images: form.images.filter(i => i.url) }
      await updateProduct(payload).unwrap()
      toast.success('Product updated!')
      navigate('/admin/products')
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update')
    }
  }

  if (productLoading || !form) return <div className="flex w-full"><AdminSidebar /><div className="flex-1 p-8"><Loader /></div></div>

  return (
    <div className="flex w-full">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-dark mb-6">Edit Product</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Name</label>
              <input name="name" value={form.name} onChange={handleChange} required className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={4} className="input resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange} required className="input">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="card space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-dark mb-1">Price</label><input name="price" type="number" value={form.price} onChange={handleChange} required className="input" /></div>
              <div><label className="block text-sm font-medium text-dark mb-1">Sale Price</label><input name="salePrice" type="number" value={form.salePrice} onChange={handleChange} className="input" /></div>
              <div><label className="block text-sm font-medium text-dark mb-1">Stock</label><input name="stock" type="number" value={form.stock} onChange={handleChange} required className="input" /></div>
              <div><label className="block text-sm font-medium text-dark mb-1">Weight</label><input name="weight" value={form.weight} onChange={handleChange} className="input" /></div>
            </div>
          </div>
          <div className="card space-y-4">
            <h3 className="font-semibold text-dark">Images</h3>
            {form.images.map((img, i) => (
              <div key={i} className="flex gap-2">
                <input value={img.url} onChange={(e) => { const imgs = [...form.images]; imgs[i] = { url: e.target.value, public_id: '' }; setForm(f => ({ ...f, images: imgs })) }} className="input flex-1 text-sm" placeholder="Image URL" />
                {i > 0 && <button type="button" onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))} className="text-red-500 px-2">✕</button>}
              </div>
            ))}
            <button type="button" onClick={() => setForm(f => ({ ...f, images: [...f.images, { url: '', public_id: '' }] }))} className="text-mango text-sm hover:underline">+ Add Image</button>
          </div>
          <div className="card space-y-4">
            <div className="flex gap-6 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="accent-mango" /><span className="text-sm font-medium">Featured</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="accent-mango" /><span className="text-sm font-medium">Active</span></label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isPreOrder" checked={form.isPreOrder} onChange={handleChange} className="accent-amber-500" />
                <span className="text-sm font-medium text-amber-700">🕐 Enable Pre-Order</span>
              </label>
            </div>
            {form.isPreOrder && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                <p className="text-xs text-amber-700 font-medium">Pre-order mode: customers can order now and pay full amount. Stock will not be deducted until dispatch.</p>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Pre-Order Note</label>
                  <input
                    name="preOrderNote"
                    value={form.preOrderNote}
                    onChange={handleChange}
                    className="input text-sm"
                    placeholder="e.g. Expected dispatch: Mid June 2026 (Chaunsa Season)"
                  />
                  <p className="text-xs text-gray-400 mt-1">This note is shown to customers on the product and checkout pages.</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={isLoading} className="btn-primary">{isLoading ? 'Saving...' : 'Save Changes'}</button>
            <button type="button" onClick={() => navigate('/admin/products')} className="btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
