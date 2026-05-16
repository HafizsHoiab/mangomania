import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative bg-dark overflow-hidden min-h-[90vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark/95 to-mango-deep/30" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-mango/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-20 w-64 h-64 bg-mango/5 rounded-full blur-2xl" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="inline-flex items-center gap-2 bg-mango/20 text-mango px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <span>🥭</span> Fresh from Multan's Orchards
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Taste of{' '}
            <span className="text-mango">Authentic</span>{' '}
            Pakistan
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
            Premium mangoes, pure desi dairy, Multani sohan halwa, and traditional achaar — straight from the heart of Multan to your table.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/shop" className="btn-primary text-center text-lg">
              Shop Now 🛒
            </Link>
            <Link to="/shop?category=mangoes" className="btn-outline text-center text-lg border-mango/50 text-mango hover:border-mango">
              🥭 Explore Mangoes
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-8">
            {[['2000+', 'Happy Customers'], ['100%', 'Pure & Natural'], ['Same Day', 'Delivery in Multan']].map(([val, label]) => (
              <div key={label}>
                <p className="text-mango font-bold text-xl">{val}</p>
                <p className="text-gray-400 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:flex justify-center items-center">
          <div className="relative">
            <div className="w-80 h-80 bg-mango/20 rounded-full flex items-center justify-center">
              <div className="w-60 h-60 bg-mango/30 rounded-full flex items-center justify-center">
                <span className="text-9xl animate-bounce">🥭</span>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-3 shadow-xl">
              <p className="text-xs font-semibold text-dark">⭐ 4.9/5 Rating</p>
              <p className="text-xs text-gray-500">2000+ reviews</p>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-mango rounded-2xl p-3 shadow-xl">
              <p className="text-xs font-semibold text-white">🚀 Fast Delivery</p>
              <p className="text-xs text-mango-light">Within Multan city</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
