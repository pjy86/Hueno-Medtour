import Header from '@/components/Header'
import CancerHero from '@/components/CancerHero'
import CancerAdvantages from '@/components/CancerAdvantages'
import CancerTechnologies from '@/components/CancerTechnologies'
import CancerProcess from '@/components/CancerProcess'
import Footer from '@/components/Footer'

export default function CancerOncologyPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <CancerHero />
        <CancerAdvantages />
        <CancerTechnologies />
        <CancerProcess />
      </main>
      <Footer />
    </>
  )
}
