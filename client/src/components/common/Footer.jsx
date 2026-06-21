import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🥭</span>
              <span className="font-display text-2xl font-bold text-mango">Mango Mania</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Pakistan's finest desi store from the heart of Multan. Bringing you premium mangoes, authentic dairy, traditional sweets, and beloved desi pantry staples — delivered to your doorstep.
            </p>
            <p className="text-sm">📍 Multan, Punjab, Pakistan</p>
            <p className="text-sm">📞 +92-370-0044688</p>
            <p className="text-sm">✉️ hello@mangomania.pk</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop?category=mangoes" className="hover:text-mango transition">🥭 Mangoes</Link></li>
              <li><Link to="/shop?category=dairy-products" className="hover:text-mango transition">🥛 Dairy Products</Link></li>
              <li><Link to="/shop?category=multani-halwa" className="hover:text-mango transition">🍯 Multani Halwa</Link></li>
              <li><Link to="/shop?category=desi-items" className="hover:text-mango transition">🫙 Desi Items</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Help</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/track-order" className="hover:text-mango transition">Track Order</Link></li>
              <li><Link to="/profile" className="hover:text-mango transition">My Account</Link></li>
              <li><a href="tel:+923700044688" className="hover:text-mango transition">Call Us</a></li>
              <li><a href="https://wa.me/923700044688" target="_blank" rel="noreferrer" className="hover:text-mango transition">WhatsApp</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">© {new Date().getFullYear()} Mango Mania. Made with ❤️ in Multan, Pakistan.</p>
          <div className="flex items-center gap-3 text-sm">
            <span>Pay with:</span>
            <span className="bg-gray-700 px-2 py-1 rounded text-xs">JazzCash</span>
            <span className="bg-gray-700 px-2 py-1 rounded text-xs">EasyPaisa</span>
            <span className="bg-gray-700 px-2 py-1 rounded text-xs">SadaPay</span>
            <span className="bg-gray-700 px-2 py-1 rounded text-xs">Bank Transfer</span>
            <span className="bg-gray-700 px-2 py-1 rounded text-xs">COD</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
