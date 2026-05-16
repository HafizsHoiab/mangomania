import { useForm } from 'react-hook-form'

export default function EasyPaisaForm({ onSubmit, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm()
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-4 mt-4">
      <p className="font-semibold text-dark">EasyPaisa Payment</p>
      <div>
        <label className="block text-sm font-medium text-dark mb-1">EasyPaisa Account Number *</label>
        <input {...register('accountNumber', { required: 'Required', pattern: { value: /^03\d{9}$/, message: 'Enter valid 11-digit number' } })}
          className="input" placeholder="03001234567" />
        {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber.message}</p>}
      </div>
      <p className="text-xs text-gray-500">An OTP will be sent to your EasyPaisa number. Enter it to confirm payment.</p>
      <button type="submit" disabled={isLoading} className="btn-primary w-full bg-emerald-600 hover:bg-emerald-700">
        {isLoading ? 'Processing...' : 'Pay with EasyPaisa 💚'}
      </button>
    </form>
  )
}
