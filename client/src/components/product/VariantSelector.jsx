export default function VariantSelector({ variants = [], selected, onSelect }) {
  if (!variants.length) return null
  return (
    <div>
      <p className="font-semibold text-dark text-sm mb-3">Select Weight</p>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => (
          <button
            key={v.label}
            onClick={() => onSelect(v)}
            className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition ${
              selected?.label === v.label
                ? 'border-mango bg-mango text-white'
                : 'border-gray-200 text-gray-600 hover:border-mango'
            }`}
          >
            {v.label}
            {v.price && <span className="ml-1 opacity-75">— Rs. {v.price.toLocaleString()}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
