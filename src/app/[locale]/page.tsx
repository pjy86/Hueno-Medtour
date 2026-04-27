import Header from '@/components/Header'
import Hero from '@/components/Hero'
import WhyChina from '@/components/WhyChina'
import Features from '@/components/Features'
import Services from '@/components/Services'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <WhyChina />
        <Features />
        <Services />
        <Testimonials />
      </main>
      <Footer />
    </>
  )
}
