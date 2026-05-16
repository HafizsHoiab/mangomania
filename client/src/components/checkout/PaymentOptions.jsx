const METHODS = [
  { id: 'jazzcash', label: 'JazzCash', icon: '📱', desc: 'Pay with JazzCash mobile wallet or MPIN' },
  { id: 'easypaisa', label: 'EasyPaisa', icon: '💚', desc: 'Pay via EasyPaisa mobile account' },
  { id: 'card', label: 'Credit/Debit Card', icon: '💳', desc: 'Visa, Mastercard via Stripe' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
]

export default function PaymentOptions({ selected, onSelect }) {
  return (
    <div className="space-y-3">
      {METHODS.map((m) => (
        <label key={m.id} className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${selected === m.id ? 'border-mango bg-mango/5' : 'border-gray-200 hover:border-mango/40'}`}>
          <input type="radio" name="payment" value={m.id} checked={selected === m.id} onChange={() => onSelect(m.id)} className="mt-1 accent-mango" />
          <span className="text-2xl">{m.icon}</span>
          <div>
            <p className="font-semibold text-dark">{m.label}</p>
            <p className="text-gray-500 text-xs">{m.desc}</p>
          </div>
        </label>
      ))}
    </div>
  )
}
