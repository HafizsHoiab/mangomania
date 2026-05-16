const REASONS = [
  { icon: '🥭', title: 'Farm to Table', desc: 'Directly sourced from Multan orchards — no middlemen, maximum freshness guaranteed.' },
  { icon: '🚀', title: 'Fast Delivery', desc: 'Same-day delivery within Multan city. All-Pakistan delivery in 2–4 days.' },
  { icon: '💯', title: '100% Pure', desc: 'No artificial preservatives or additives. Everything is pure, natural and desi.' },
  { icon: '💰', title: 'Best Prices', desc: 'Wholesale prices for retail customers. Bulk discounts available for large orders.' },
  { icon: '📦', title: 'Safe Packaging', desc: 'Mangoes packed in protective crates. Achaar and halwa in airtight, leak-proof containers.' },
  { icon: '⭐', title: '5-Star Reviews', desc: 'Thousands of happy customers across Pakistan rave about our authentic quality.' },
]

export default function WhyUs() {
  return (
    <section className="py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-bold text-dark mb-3">Why Choose Mango Mania?</h2>
          <p className="text-gray-500 text-lg">The reason thousands trust us for their desi cravings</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map((r) => (
            <div key={r.title} className="bg-white rounded-2xl p-6 shadow-card hover:shadow-lg transition-shadow">
              <span className="text-4xl block mb-4">{r.icon}</span>
              <h3 className="font-semibold text-dark text-lg mb-2">{r.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
