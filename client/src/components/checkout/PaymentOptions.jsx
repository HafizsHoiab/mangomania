const ACCOUNTS = [
  { label: 'JazzCash', icon: '📱', number: '03032073062', name: 'Moiz Imran' },
  { label: 'EasyPaisa', icon: '💚', number: '03032073062', name: 'Moiz Imran' },
  { label: 'SadaPay', icon: '🟣', number: '03032073062', name: 'Moiz Imran' },
]

const BANK = {
  name: 'MOIZ IMRAN',
  account: '60010113456250',
  iban: 'PK15MEZN0060010113456250',
  bank: 'Meezan Bank',
}

const METHODS = [
  { id: 'manual', label: 'Bank / Wallet Transfer', icon: '🏦', desc: 'JazzCash · EasyPaisa · SadaPay · Bank — send slip on WhatsApp' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives at your door' },
]

export default function PaymentOptions({ selected, onSelect }) {
  return (
    <div className="space-y-3">
      {METHODS.map((m) => (
        <div key={m.id}>
          <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${selected === m.id ? 'border-mango bg-mango/5' : 'border-gray-200 hover:border-mango/40'}`}>
            <input type="radio" name="payment" value={m.id} checked={selected === m.id} onChange={() => onSelect(m.id)} className="mt-1 accent-mango" />
            <span className="text-2xl">{m.icon}</span>
            <div>
              <p className="font-semibold text-dark">{m.label}</p>
              <p className="text-gray-500 text-xs">{m.desc}</p>
            </div>
          </label>

          {m.id === 'manual' && selected === 'manual' && (
            <div className="mt-2 mx-1 bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-4">
              <p className="text-sm font-semibold text-blue-800">📋 Transfer to any of these accounts:</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ACCOUNTS.map(acc => (
                  <div key={acc.label} className="bg-white rounded-xl p-3 border border-blue-100 text-center">
                    <p className="text-xs font-bold text-gray-500 mb-1">{acc.icon} {acc.label}</p>
                    <p className="font-bold text-dark text-base tracking-wide">{acc.number}</p>
                    <p className="text-xs text-gray-500">{acc.name}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl p-3 border border-blue-100">
                <p className="text-xs font-bold text-gray-500 mb-2">🏦 Bank Transfer — {BANK.bank}</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Name</span><span className="font-semibold text-dark">{BANK.name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Account No.</span><span className="font-semibold text-dark">{BANK.account}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">IBAN</span><span className="font-semibold text-dark font-mono text-xs">{BANK.iban}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Bank</span><span className="font-semibold text-dark">{BANK.bank}</span></div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                📲 After transferring, place your order below and send your payment screenshot on WhatsApp. Your order will be confirmed once we verify the payment.
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
