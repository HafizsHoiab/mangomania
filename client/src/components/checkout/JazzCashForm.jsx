import { useForm } from 'react-hook-form'

export default function JazzCashForm({ onSubmit, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm()
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-green-50 border border-green-200 rounded-xl p-5 space-y-4 mt-4">
      <p className="font-semibold text-dark">JazzCash Payment</p>
      <div>
        <label className="block text-sm font-medium text-dark mb-1">JazzCash Mobile Number *</label>
        <input {...register('mobileNumber', { required: 'Required', pattern: { value: /^03\d{9}$/, message: 'Enter valid 11-digit number (03XXXXXXXXX)' } })}
          className="input" placeholder="03001234567" />
        {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber.message}</p>}
      </div>
      <p className="text-xs text-gray-500">You will receive a payment confirmation SMS on your JazzCash number.</p>
      <button type="submit" disabled={isLoading} className="btn-primary w-full">
        {isLoading ? 'Processing...' : 'Pay with JazzCash 📱'}
      </button>
    </form>
  )
}
