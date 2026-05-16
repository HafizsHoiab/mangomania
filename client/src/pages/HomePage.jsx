import Hero from '../components/home/Hero.jsx'
import CategoryGrid from '../components/home/CategoryGrid.jsx'
import FeaturedProducts from '../components/home/FeaturedProducts.jsx'
import WhyUs from '../components/home/WhyUs.jsx'
import Testimonials from '../components/home/Testimonials.jsx'
import CtaBanner from '../components/home/CtaBanner.jsx'

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <WhyUs />
      <Testimonials />
      <CtaBanner />
    </>
  )
}
