import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../../components/admin/AdminSidebar.jsx'
import { useCreateProductMutation, useGetCategoriesQuery } from '../../services/productApi.js'
import { toast } from '../../hooks/useToast.js'

const BOX_SIZES = [
  { key: '5kg', label: '5 KG Box', weight: '5kg' },
  { key: '7kg', label: '7 KG Box', weight: '7kg' },
]

export default function AdminAddProduct() {
  const navigate = useNavigate()
  const [createProduct, { isLoading }] = useCreateProductMutation()
  const { data: catData } = useGetCategoriesQuery()
  const categories = catData?.data || []

  const [form, setForm] = useState({
    name: '', description: '', price: '', salePrice: '', category: '', stock: 0, weight: '', sku: '', isFeatured: false, isActive: true, isPreOrder: false, preOrderNote: '', expectedDelivery: '',
    images: [{ url: '', public_id: '' }],
  })

  const [boxSizes, setBoxSizes] = useState({
    '5kg': { enabled: false, price: '', stock: '' },
    '7kg': { enabled: false, price: '', stock: '' },
  })

  const selectedCategoryObj = categories.find(c => c._id === form.category)
  const isMangoCategory = selectedCategoryObj?.name?.toLowerCase().includes('mango')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleBoxChange = (key, field, value) => {
    setBoxSizes(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let payload = {
        ...form,
        salePrice: form.salePrice ? Number(form.salePrice) : undefined,
        images: form.images.filter(i => i.url),
      }

      if (isMangoCategory) {
        const enabledSizes = BOX_SIZES.filter(s => boxSizes[s.key].enabled)
        if (enabledSizes.length === 0) {
          toast.error('Please select at least one box size (5KG or 7KG)')
          return
        }
        const variants = enabledSizes.map(s => ({
          label: s.label,
          weight: s.weight,
          price: Number(boxSizes[s.key].price),
          stock: Number(boxSizes[s.key].stock),
        }))
        const minPrice = Math.min(...variants.map(v => v.price))
        const totalStock = variants.reduce((a, v) => a + v.stock, 0)
        payload.variants = variants
        payload.price = minPrice
        payload.stock = totalStock
        payload.weight = enabledSizes.map(s => s.label).join(' / ')
      } else {
        payload.price = Number(form.price)
        payload.stock = Number(form.stock)
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

          {/* Basic Info */}
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
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Expected Delivery</label>
              <input name="expectedDelivery" value={form.expectedDelivery} onChange={handleChange} className="input" placeholder="e.g. 2-3 business days / Same day in Multan" />
              <p className="text-xs text-gray-400 mt-1">Shown to customer in cart and checkout</p>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="card space-y-4">
            <h3 className="font-semibold text-dark">Pricing & Stock</h3>

            {isMangoCategory ? (
              <div className="space-y-4">
                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                  🥭 Mango product — select box sizes and set price for each
                </p>
                {BOX_SIZES.map(size => (
                  <div key={size.key} className={`border-2 rounded-xl p-4 transition ${boxSizes[size.key].enabled ? 'border-mango bg-mango/5' : 'border-gray-200'}`}>
                    <label className="flex items-center gap-3 cursor-pointer mb-3">
                      <input
                        type="checkbox"
                        checked={boxSizes[size.key].enabled}
                        onChange={(e) => handleBoxChange(size.key, 'enabled', e.target.checked)}
                        className="w-5 h-5 accent-mango"
                      />
                      <span className="font-semibold text-dark text-base">📦 {size.label}</span>
                    </label>
                    {boxSizes[size.key].enabled && (
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <div>
                          <label className="block text-sm font-medium text-dark mb-1">Price (Rs.) *</label>
                          <input
                            type="number"
                            value={boxSizes[size.key].price}
                            onChange={(e) => handleBoxChange(size.key, 'price', e.target.value)}
                            required
                            className="input"
                            placeholder={size.key === '5kg' ? '1500' : '2000'}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-dark mb-1">Stock (boxes) *</label>
                          <input
                            type="number"
                            value={boxSizes[size.key].stock}
                            onChange={(e) => handleBoxChange(size.key, 'stock', e.target.value)}
                            required
                            className="input"
                            placeholder="50"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
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
            )}
          </div>

          {/* Images */}
          <div className="card space-y-4">
            <h3 className="font-semibold text-dark">Image URLs</h3>
            <p className="text-xs text-gray-500">Enter Cloudinary or direct image URLs.</p>
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

          {/* Options */}
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
                <p className="text-xs text-amber-700 font-medium">Pre-order mode: customers can order now. Stock will not be deducted until dispatch.</p>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Pre-Order Note</label>
                  <input name="preOrderNote" value={form.preOrderNote} onChange={handleChange} className="input text-sm" placeholder="e.g. Expected dispatch: Mid June 2026" />
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
