import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function AdminRoute({ children }) {
  const { user, accessToken } = useSelector((state) => state.auth)
  if (!accessToken || user?.role !== 'admin') return <Navigate to="/login" replace />
  return children
}
