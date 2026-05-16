import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useRegisterMutation } from '../services/authApi.js'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/slices/authSlice.js'
import { toast } from '../hooks/useToast.js'

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const [registerUser, { isLoading }] = useRegisterMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    const { confirmPassword, ...payload } = data
    try {
      const res = await registerUser(payload).unwrap()
      dispatch(setCredentials(res.data))
      toast.success(`Welcome to Mango Mania, ${res.data.user.name}! 🥭`)
      navigate('/')
    } catch (err) {
      toast.error(err?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🥭</span>
          <h1 className="font-display text-3xl font-bold text-dark mt-3">Create Account</h1>
          <p className="text-gray-500 mt-1">Join the Mango Mania family</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Full Name</label>
              <input {...register('name', { required: 'Name is required' })} className="input" placeholder="Ahmed Hassan" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Email Address</label>
              <input {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} type="email" className="input" placeholder="ahmed@example.com" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Phone Number</label>
              <input {...register('phone')} className="input" placeholder="+92-300-1234567" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Password</label>
              <input {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })} type="password" className="input" placeholder="••••••••" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Confirm Password</label>
              <input {...register('confirmPassword', { required: 'Required', validate: (v) => v === watch('password') || 'Passwords do not match' })} type="password" className="input" placeholder="••••••••" />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full">
              {isLoading ? 'Creating account...' : 'Create Account 🥭'}
            </button>
          </form>
          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account? <Link to="/login" className="text-mango font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
