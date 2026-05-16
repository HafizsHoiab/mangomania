import { useState } from 'react'
import { useSelector } from 'react-redux'
import AdminSidebar from '../../components/admin/AdminSidebar.jsx'
import { useChangePasswordMutation } from '../../services/authApi.js'
import { toast } from '../../hooks/useToast.js'

export default function AdminSettings() {
  const user = useSelector((s) => s.auth.user)
  const [changePassword, { isLoading }] = useChangePasswordMutation()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword) {
      return toast.error('New passwords do not match')
    }
    if (form.newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters')
    }
    if (form.newPassword === form.currentPassword) {
      return toast.error('New password must be different from current password')
    }
    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      }).unwrap()
      toast.success('Password changed successfully! 🔒')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to change password')
    }
  }

  return (
    <div className="flex w-full">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-dark">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your admin account</p>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Account info */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="font-semibold text-dark text-lg mb-4">Account Info</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-mango rounded-2xl flex items-center justify-center text-white font-display font-bold text-2xl flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-dark text-lg">{user?.name}</p>
                <p className="text-gray-500 text-sm">{user?.email}</p>
                <span className="badge bg-mango/20 text-mango-deep text-xs mt-1 inline-block">⚙️ Admin</span>
              </div>
            </div>
          </div>

          {/* Change password */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="font-semibold text-dark text-lg mb-1">Change Password</h3>
            <p className="text-gray-400 text-sm mb-6">Make sure your new password is at least 6 characters.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Current password */}
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                    required
                    placeholder="Enter your current password"
                    className="input pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark text-lg"
                  >
                    {showCurrent ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div>
                <label className="block text-sm font-medium text-dark mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    required
                    placeholder="Min 6 characters"
                    className="input pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark text-lg"
                  >
                    {showNew ? '🙈' : '👁️'}
                  </button>
                </div>
                {/* Strength indicator */}
                {form.newPassword && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => {
                        const strength = form.newPassword.length >= 10 && /[A-Z]/.test(form.newPassword) && /[0-9]/.test(form.newPassword) ? 4
                          : form.newPassword.length >= 8 && /[0-9]/.test(form.newPassword) ? 3
                          : form.newPassword.length >= 6 ? 2
                          : 1
                        return (
                          <div key={level} className={`h-1.5 flex-1 rounded-full transition-colors ${
                            level <= strength
                              ? strength === 1 ? 'bg-red-400'
                              : strength === 2 ? 'bg-yellow-400'
                              : strength === 3 ? 'bg-blue-400'
                              : 'bg-green-500'
                            : 'bg-gray-200'
                          }`} />
                        )
                      })}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {form.newPassword.length < 6 ? 'Too short'
                        : form.newPassword.length >= 10 && /[A-Z]/.test(form.newPassword) && /[0-9]/.test(form.newPassword) ? 'Strong password ✓'
                        : form.newPassword.length >= 8 && /[0-9]/.test(form.newPassword) ? 'Good password'
                        : 'Acceptable — add numbers or uppercase to strengthen'}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm new password */}
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Re-enter new password"
                    className={`input pr-12 ${
                      form.confirmPassword && form.confirmPassword !== form.newPassword
                        ? 'border-red-400 focus:ring-red-300'
                        : form.confirmPassword && form.confirmPassword === form.newPassword
                        ? 'border-green-400 focus:ring-green-300'
                        : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark text-lg"
                  >
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
                {form.confirmPassword && form.confirmPassword !== form.newPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
                {form.confirmPassword && form.confirmPassword === form.newPassword && (
                  <p className="text-xs text-green-600 mt-1">✓ Passwords match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !form.currentPassword || !form.newPassword || !form.confirmPassword}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Updating...' : 'Update Password 🔒'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
