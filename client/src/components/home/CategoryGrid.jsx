import { Link } from 'react-router-dom'

const CATEGORIES = [
  { name: 'Mangoes', slug: 'mangoes', icon: '🥭', desc: 'Chaunsa, Sindhri, Langra & more', bg: 'from-yellow-50 to-amber-100', border: 'border-amber-200' },
  { name: 'Dairy Products', slug: 'dairy-products', icon: '🥛', desc: 'Lassi, Dahi, Makkhan & Paneer', bg: 'from-blue-50 to-sky-100', border: 'border-sky-200' },
  { name: 'Multani Halwa', slug: 'multani-halwa', icon: '🍯', desc: 'Sohan Halwa, Rewri & more', bg: 'from-orange-50 to-orange-100', border: 'border-orange-200' },
  { name: 'Desi Items', slug: 'desi-items', icon: '🫙', desc: 'Achaar, Spices & Murabbas', bg: 'from-green-50 to-emerald-100', border: 'border-emerald-200' },
]

export default function CategoryGrid() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="font-display text-4xl font-bold text-dark mb-3">Shop by Category</h2>
        <p className="text-gray-500 text-lg">Everything desi, delivered fresh from Multan</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            to={`/shop?category=${cat.slug}`}
            className={`group bg-gradient-to-br ${cat.bg} border-2 ${cat.border} rounded-2xl p-6 text-center hover:shadow-card transition-all duration-300 hover:-translate-y-1`}
          >
            <span className="text-5xl block mb-3 group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
            <h3 className="font-display font-bold text-dark text-lg mb-1">{cat.name}</h3>
            <p className="text-gray-500 text-xs">{cat.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
