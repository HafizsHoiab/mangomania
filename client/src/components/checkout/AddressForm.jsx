import { useForm } from 'react-hook-form'

const PROVINCES = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Gilgit-Baltistan', 'AJK']

export default function AddressForm({ defaultValues, onSubmit }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Full Name *</label>
          <input {...register('name', { required: 'Required' })} className="input" placeholder="Ahmed Hassan" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Phone *</label>
          <input {...register('phone', { required: 'Required' })} className="input" placeholder="+92-300-1234567" />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-dark mb-1">Street Address *</label>
        <input {...register('street', { required: 'Required' })} className="input" placeholder="House #12, Street 5, Hussain Agahi" />
        {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark mb-1">City *</label>
          <input {...register('city', { required: 'Required' })} className="input" placeholder="Multan" />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Province *</label>
          <select {...register('province', { required: 'Required' })} className="input">
            <option value="">Select Province</option>
            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-dark mb-1">Order Notes (optional)</label>
        <textarea {...register('notes')} className="input resize-none" rows={2} placeholder="Delivery instructions, landmark, etc." />
      </div>
      <button type="submit" className="btn-primary w-full">Continue to Payment →</button>
    </form>
  )
}
