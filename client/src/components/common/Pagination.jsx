export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null
  const nums = Array.from({ length: pages }, (_, i) => i + 1)
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-mango hover:text-white hover:border-mango disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        ←
      </button>
      {nums.map((n) => (
        <button
          key={n}
          onClick={() => onPageChange(n)}
          className={`px-4 py-2 rounded-xl border transition font-medium ${
            n === page
              ? 'bg-mango text-white border-mango'
              : 'border-gray-200 text-gray-600 hover:bg-mango/10'
          }`}
        >
          {n}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-mango hover:text-white hover:border-mango disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        →
      </button>
    </div>
  )
}
