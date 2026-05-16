import StarRating from '../common/StarRating.jsx'
import { formatDate } from '../../utils/formatDate.js'

export default function ReviewCard({ review }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-mango rounded-full flex items-center justify-center text-white font-bold text-sm">
            {review.user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-dark text-sm">{review.user?.name}</p>
              {review.isVerifiedBuyer && (
                <span className="badge bg-green-100 text-green-700 text-xs">✓ Verified Buyer</span>
              )}
            </div>
            <StarRating rating={review.rating} size="sm" />
          </div>
        </div>
        <span className="text-gray-400 text-xs whitespace-nowrap">{formatDate(review.createdAt)}</span>
      </div>
      <p className="text-gray-700 text-sm mt-3 leading-relaxed">{review.comment}</p>
    </div>
  )
}
