export default function StarRating({ rating = 0, count, size = 'sm', interactive = false, onRate }) {
  const sizes = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' }
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          onClick={() => interactive && onRate?.(star)}
          className={`${sizes[size]} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} ${star <= Math.round(rating) ? 'text-mango' : 'text-gray-300'}`}
        >
          ★
        </button>
      ))}
      {count !== undefined && (
        <span className="text-gray-500 text-xs ml-1">({count})</span>
      )}
    </div>
  )
}
