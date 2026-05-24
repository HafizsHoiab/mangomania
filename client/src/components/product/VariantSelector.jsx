export default function VariantSelector({ variants = [], selected, onSelect }) {
  if (!variants.length) return null

  const isBoxSize = variants.some(v => v.weight?.includes('kg') || v.label?.toLowerCase().includes('kg'))

  return (
    <div>
      <p className="font-semibold text-dark text-sm mb-3">{isBoxSize ? 'Select Box Size' : 'Select Variant'}</p>
      <div className="flex flex-wrap gap-3">
        {variants.map((v) => (
          <button
            key={v.label}
            onClick={() => onSelect(v)}
            className={`relative px-5 py-3 rounded-xl border-2 text-sm font-medium transition text-left ${
              selected?.label === v.label
                ? 'border-mango bg-mango text-white shadow-lg'
                : 'border-gray-200 text-gray-700 hover:border-mango hover:bg-mango/5'
            }`}
          >
            <p className="font-bold">📦 {v.label}</p>
            <p className={`text-xs mt-0.5 ${selected?.label === v.label ? 'text-white/80' : 'text-mango font-semibold'}`}>
              Rs. {(v.price || v.salePrice)?.toLocaleString()}
            </p>
            {v.stock !== undefined && (
              <p className={`text-xs mt-0.5 ${selected?.label === v.label ? 'text-white/70' : 'text-gray-400'}`}>
                {v.stock > 0 ? `${v.stock} available` : 'Out of stock'}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
