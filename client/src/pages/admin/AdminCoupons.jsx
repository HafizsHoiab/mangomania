import { useState } from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar.jsx'
import Modal from '../../components/common/Modal.jsx'
import { useGetCouponsQuery, useCreateCouponMutation, useUpdateCouponMutation, useDeleteCouponMutation } from '../../services/adminApi.js'
import { formatDate } from '../../utils/formatDate.js'
import { toast } from '../../hooks/useToast.js'

const emptyForm = { code: '', discountType: 'percent', discount: '', minOrder: '', maxUses: 100, expiry: '', description: '', isActive: true }

export default function AdminCoupons() {
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const { data } = useGetCouponsQuery()
  const [createCoupon, { isLoading: creating }] = useCreateCouponMutation()
  const [updateCoupon] = useUpdateCouponMutation()
  const [deleteCoupon] = useDeleteCouponMutation()
  const coupons = data?.data || []

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form, discount: Number(form.discount), minOrder: Number(form.minOrder || 0), maxUses: Number(form.maxUses) }
      if (editId) { await updateCoupon({ id: editId, ...payload }).unwrap(); toast.success('Coupon updated') }
      else { await createCoupon(payload).unwrap(); toast.success('Coupon created') }
      setShowModal(false); setForm(emptyForm); setEditId(null)
    } catch (err) { toast.error(err?.data?.message || 'Failed') }
  }

  const handleEdit = (c) => { setForm({ ...c, expiry: c.expiry?.slice(0, 10) }); setEditId(c._id); setShowModal(true) }
  const handleDelete = async (id) => { if (!window.confirm('Delete coupon?')) return; await deleteCoupon(id); toast.success('Deleted') }

  return (
    <div className="flex w-full">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold text-dark">Coupons</h1>
          <button onClick={() => { setForm(emptyForm); setEditId(null); setShowModal(true) }} className="btn-primary">+ Create Coupon</button>
        </div>
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>{['Code', 'Type', 'Discount', 'Min Order', 'Used/Max', 'Expiry', 'Status', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {coupons.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-bold text-dark">{c.code}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{c.discountType}</td>
                  <td className="px-4 py-3 font-semibold">{c.discountType === 'percent' ? `${c.discount}%` : `Rs. ${c.discount}`}</td>
                  <td className="px-4 py-3 text-gray-500">Rs. {c.minOrder?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500">{c.usedCount}/{c.maxUses}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(c.expiry)}</td>
                  <td className="px-4 py-3"><span className={`badge ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => handleEdit(c)} className="text-mango text-xs font-semibold hover:underline">Edit</button>
                    <button onClick={() => handleDelete(c._id)} className="text-red-500 text-xs font-semibold hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!coupons.length && <p className="text-center text-gray-400 py-10">No coupons yet</p>}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? 'Edit Coupon' : 'Create Coupon'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Code *</label><input name="code" value={form.code} onChange={handleChange} required className="input uppercase" placeholder="MANGO20" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select name="discountType" value={form.discountType} onChange={handleChange} className="input">
                <option value="percent">Percent (%)</option>
                <option value="flat">Flat (Rs.)</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium mb-1">Discount *</label><input name="discount" type="number" value={form.discount} onChange={handleChange} required className="input" /></div>
            <div><label className="block text-sm font-medium mb-1">Min Order</label><input name="minOrder" type="number" value={form.minOrder} onChange={handleChange} className="input" /></div>
            <div><label className="block text-sm font-medium mb-1">Max Uses</label><input name="maxUses" type="number" value={form.maxUses} onChange={handleChange} className="input" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Expiry *</label><input name="expiry" type="date" value={form.expiry} onChange={handleChange} required className="input" /></div>
          <div><label className="block text-sm font-medium mb-1">Description</label><input name="description" value={form.description} onChange={handleChange} className="input" /></div>
          <label className="flex items-center gap-2"><input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="accent-mango" /><span className="text-sm">Active</span></label>
          <button type="submit" disabled={creating} className="btn-primary w-full">{creating ? 'Saving...' : editId ? 'Update Coupon' : 'Create Coupon'}</button>
        </form>
      </Modal>
    </div>
  )
}
