const REVIEWS = [
  { name: 'Ahmed Hassan', city: 'Lahore', rating: 5, text: 'The Chaunsa mangoes are absolutely divine! I\'ve been ordering every mango season for 3 years. Quality is always top-notch and delivery is fast.', avatar: 'A' },
  { name: 'Fatima Malik', city: 'Karachi', rating: 5, text: 'The Multani sohan halwa is out of this world! Sent a gift box to my family in Karachi and they loved it. Packaging was perfect.', avatar: 'F' },
  { name: 'Usman Qureshi', city: 'Islamabad', rating: 5, text: 'Ordered the aam ka achaar and desi ghee. Both are exactly like what my dadi used to make. Pure, authentic and absolutely delicious!', avatar: 'U' },
]

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-bold text-dark mb-3">What Our Customers Say</h2>
          <p className="text-gray-500">Real reviews from real mango lovers across Pakistan</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((r) => (
            <div key={r.name} className="bg-cream rounded-2xl p-6 shadow-card relative">
              <div className="text-mango text-3xl font-serif mb-4">"</div>
              <p className="text-gray-700 text-sm leading-relaxed mb-6">{r.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-mango rounded-full flex items-center justify-center text-white font-bold">
                  {r.avatar}
                </div>
                <div>
                  <p className="font-semibold text-dark text-sm">{r.name}</p>
                  <p className="text-gray-400 text-xs">{r.city}</p>
                </div>
                <div className="ml-auto text-mango text-sm">{'★'.repeat(r.rating)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
