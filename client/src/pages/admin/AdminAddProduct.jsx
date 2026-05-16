import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../../components/admin/AdminSidebar.jsx'
import { useCreateProductMutation } from '../../services/productApi.js'
import { useGetCategoriesQuery } from '../../services/productApi.js'
import { toast } from '../../hooks/useToast.js'

export default function AdminAddProduct() {
  const navigate = useNavigate()
  const [createProduct, { isLoading }] = useCreateProductMutation()
  const { data: catData } = useGetCategoriesQuery()
  const categories = catData?.data || []
  const [form, setForm] = useState({
    name: '', description: '', price: '', salePrice: '', category: '', stock: 0, weight: '', sku: '', isFeatured: false, isActive: true, isPreOrder: false, preOrderNote: '',
    images: [{ url: '', public_id: '' }],
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : undefined,
        stock: Number(form.stock),
        images: form.images.filter(i => i.url),
      }
      await createProduct(payload).unwrap()
      toast.success('Product created!')
      navigate('/admin/products')
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create product')
    }
  }

  return (
    <div className="flex w-full">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-dark mb-6">Add New Product</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card space-y-4">
            <h3 className="font-semibold text-dark">Basic Info</h3>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Product Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required className="input" placeholder="Chaunsa Mango Premium" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={4} className="input resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required className="input">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">SKU</label>
              <input name="sku" value={form.sku} onChange={handleChange} className="input" placeholder="MNG-001" />
            </div>
          </div>

          <div className="card space-y-4">
            <h3 className="font-semibold text-dark">Pricing & Stock</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Price (Rs.) *</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} required className="input" placeholder="1200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Sale Price (Rs.)</label>
                <input name="salePrice" type="number" value={form.salePrice} onChange={handleChange} className="input" placeholder="999" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Stock *</label>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} required className="input" placeholder="50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Weight</label>
                <input name="weight" value={form.weight} onChange={handleChange} className="input" placeholder="1 kg" />
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <h3 className="font-semibold text-dark">Image URLs</h3>
            <p className="text-xs text-gray-500">Enter Cloudinary or direct image URLs. Upload via the Upload API for production use.</p>
            {form.images.map((img, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={img.url}
                  onChange={(e) => {
                    const imgs = [...form.images]
                    imgs[i] = { url: e.target.value, public_id: '' }
                    setForm(f => ({ ...f, images: imgs }))
                  }}
                  className="input flex-1 text-sm"
                  placeholder="https://res.cloudinary.com/..."
                />
                {i > 0 && (
                  <button type="button" onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))} className="text-red-500 px-2">✕</button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setForm(f => ({ ...f, images: [...f.images, { url: '', public_id: '' }] }))} className="text-mango text-sm hover:underline">+ Add Image</button>
          </div>

          <div className="card space-y-4">
            <div className="flex gap-6 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="accent-mango" />
                <span className="text-sm font-medium">Featured Product</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="accent-mango" />
                <span className="text-sm font-medium">Active (visible)</span>
              </label>
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
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Creating...' : 'Create Product 🥭'}
            </button>
            <button type="button" onClick={() => navigate('/admin/products')} className="btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
