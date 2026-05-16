import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useLoginMutation } from '../services/authApi.js'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/slices/authSlice.js'
import { toast } from '../hooks/useToast.js'

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [login, { isLoading }] = useLoginMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const onSubmit = async (data) => {
    try {
      const res = await login(data).unwrap()
      dispatch(setCredentials(res.data))
      toast.success(`Welcome back, ${res.data.user.name}! 🥭`)
      navigate(res.data.user.role === 'admin' ? '/admin' : from, { replace: true })
    } catch (err) {
      toast.error(err?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🥭</span>
          <h1 className="font-display text-3xl font-bold text-dark mt-3">Welcome Back</h1>
          <p className="text-gray-500 mt-1">Login to your Mango Mania account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Email Address</label>
              <input
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                type="email"
                className="input"
                placeholder="ahmed@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Password</label>
              <input
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                type="password"
                className="input"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-mango text-xs hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full">
              {isLoading ? 'Logging in...' : 'Login to Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-mango font-semibold hover:underline">Register here</Link>
            </p>
          </div>

          <div className="mt-4 p-3 bg-mango/10 rounded-xl text-xs text-center text-gray-600">
            <strong>Demo:</strong> admin@mangomania.pk / admin123
          </div>
        </div>
      </div>
    </div>
  )
}
