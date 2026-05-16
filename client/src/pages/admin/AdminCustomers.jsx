import { useState } from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar.jsx'
import { useGetAdminUsersQuery, useBlockUserMutation } from '../../services/adminApi.js'
import { formatDate } from '../../utils/formatDate.js'
import { toast } from '../../hooks/useToast.js'
import Loader from '../../components/common/Loader.jsx'

export default function AdminCustomers() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useGetAdminUsersQuery(`search=${search}`)
  const [blockUser] = useBlockUserMutation()
  const users = data?.data || []

  const handleBlock = async (id, name, isBlocked) => {
    try {
      await blockUser(id).unwrap()
      toast.success(`${name} ${isBlocked ? 'unblocked' : 'blocked'}`)
    } catch { toast.error('Failed') }
  }

  return (
    <div className="flex w-full">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="font-display text-3xl font-bold text-dark mb-6">Customers</h1>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Search by name or email..." className="input max-w-xs py-2 text-sm mb-6" />
        {isLoading ? <Loader /> : (
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Customer', 'Email', 'Phone', 'Joined', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-mango/20 text-mango rounded-full flex items-center justify-center font-bold text-xs">{u.name?.charAt(0).toUpperCase()}</div>
                        <span className="font-medium text-dark">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 text-gray-600">{u.phone || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${u.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {u.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleBlock(u._id, u.name, u.isBlocked)} className={`text-xs font-semibold hover:underline ${u.isBlocked ? 'text-green-600' : 'text-red-500'}`}>
                        {u.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!users.length && <p className="text-center text-gray-400 py-10">No customers found</p>}
          </div>
        )}
      </div>
    </div>
  )
}
