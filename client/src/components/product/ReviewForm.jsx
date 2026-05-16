import { useState } from 'react'
import { useCreateReviewMutation } from '../../services/reviewApi.js'
import StarRating from '../common/StarRating.jsx'
import { toast } from '../../hooks/useToast.js'

export default function ReviewForm({ productId, onSuccess }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [createReview, { isLoading }] = useCreateReviewMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) return toast.error('Please select a rating')
    if (comment.length < 10) return toast.error('Comment must be at least 10 characters')
    try {
      await createReview({ productId, rating, comment }).unwrap()
      toast.success('Review submitted! It will appear after approval.')
      setRating(0)
      setComment('')
      onSuccess?.()
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to submit review')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-6">
      <h3 className="font-semibold text-dark mb-4">Write a Review</h3>
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Your Rating</p>
        <StarRating rating={rating} size="lg" interactive onRate={setRating} />
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this product..."
        rows={4}
        className="input mb-4 resize-none"
      />
      <button type="submit" disabled={isLoading} className="btn-primary w-full">
        {isLoading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}
