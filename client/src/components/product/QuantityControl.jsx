export default function QuantityControl({ qty, onIncrease, onDecrease, max = 99, min = 1 }) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
      <button
        onClick={onDecrease}
        disabled={qty <= min}
        className="w-9 h-9 rounded-lg bg-white shadow text-dark font-bold hover:bg-mango hover:text-white transition disabled:opacity-40"
      >
        −
      </button>
      <span className="w-12 text-center font-bold text-dark">{qty}</span>
      <button
        onClick={onIncrease}
        disabled={qty >= max}
        className="w-9 h-9 rounded-lg bg-white shadow text-dark font-bold hover:bg-mango hover:text-white transition disabled:opacity-40"
      >
        +
      </button>
    </div>
  )
}
