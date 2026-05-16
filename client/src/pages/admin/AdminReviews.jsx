import AdminSidebar from '../../components/admin/AdminSidebar.jsx'
import { useGetPendingReviewsQuery, useApproveReviewMutation, useDeleteReviewMutation } from '../../services/reviewApi.js'
import StarRating from '../../components/common/StarRating.jsx'
import { formatDate } from '../../utils/formatDate.js'
import { toast } from '../../hooks/useToast.js'
import Loader from '../../components/common/Loader.jsx'

export default function AdminReviews() {
  const { data, isLoading } = useGetPendingReviewsQuery()
  const [approveReview] = useApproveReviewMutation()
  const [deleteReview] = useDeleteReviewMutation()
  const reviews = data?.data || []

  const handleApprove = async (id) => {
    try { await approveReview(id).unwrap(); toast.success('Review approved') }
    catch { toast.error('Failed to approve') }
  }

  const handleDelete = async (id) => {
    try { await deleteReview(id).unwrap(); toast.success('Review deleted') }
    catch { toast.error('Failed to delete') }
  }

  return (
    <div className="flex w-full">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="font-display text-3xl font-bold text-dark mb-6">Pending Reviews</h1>
        {isLoading ? <Loader /> : (
          <div className="space-y-4">
            {reviews.length === 0 && <div className="text-center py-16 text-gray-400">No pending reviews! ✅</div>}
            {reviews.map((r) => (
              <div key={r._id} className="bg-white rounded-2xl shadow-card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-dark">{r.user?.name} <span className="text-gray-400 text-sm font-normal">on {r.product?.name}</span></p>
                    <StarRating rating={r.rating} size="sm" />
                    <p className="text-gray-700 text-sm mt-2">{r.comment}</p>
                    <p className="text-gray-400 text-xs mt-2">{formatDate(r.createdAt)}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleApprove(r._id)} className="bg-green-100 text-green-700 hover:bg-green-200 text-xs font-semibold px-3 py-2 rounded-lg transition">✓ Approve</button>
                    <button onClick={() => handleDelete(r._id)} className="bg-red-100 text-red-600 hover:bg-red-200 text-xs font-semibold px-3 py-2 rounded-lg transition">✕ Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
