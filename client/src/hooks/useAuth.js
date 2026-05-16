import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/slices/authSlice.js'
import { useLogoutMutation } from '../services/authApi.js'

export const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, accessToken } = useSelector((state) => state.auth)
  const [logoutApi] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('mangoRefreshToken')
      await logoutApi({ refreshToken })
    } catch (_) {}
    dispatch(logout())
    navigate('/login')
  }

  return {
    user,
    isAuthenticated: !!accessToken,
    isAdmin: user?.role === 'admin',
    logout: handleLogout,
  }
}
