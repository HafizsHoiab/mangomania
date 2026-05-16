import { useState } from 'react'

export default function ProductImageGallery({ images = [] }) {
  const [selected, setSelected] = useState(0)
  const fallback = 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800'
  const imgs = images.length ? images : [{ url: fallback }]

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50">
        <img src={imgs[selected]?.url || fallback} alt="Product" className="w-full h-full object-cover" />
      </div>
      {imgs.length > 1 && (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {imgs.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${selected === i ? 'border-mango' : 'border-transparent'}`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
