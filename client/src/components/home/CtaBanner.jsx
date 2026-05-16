import { Link } from 'react-router-dom'

export default function CtaBanner() {
  return (
    <section className="bg-gradient-to-r from-dark to-mango-deep py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <span className="text-6xl block mb-6">🥭</span>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
          Mango Season Is Here!
        </h2>
        <p className="text-mango-light text-lg mb-8 max-w-2xl mx-auto">
          Order now and get fresh Chaunsa, Sindhri, and Langra mangoes delivered to your doorstep. Use code <span className="text-mango font-bold">MANGO20</span> for 20% off your first order.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/shop?category=mangoes" className="bg-mango hover:bg-mango-deep text-white font-bold px-8 py-4 rounded-xl text-lg transition-all">
            Shop Mangoes Now 🥭
          </Link>
          <Link to="/track-order" className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl text-lg transition-all">
            Track My Order
          </Link>
        </div>
      </div>
    </section>
  )
}
