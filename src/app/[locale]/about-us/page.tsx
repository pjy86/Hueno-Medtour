import Header from '@/components/Header'
import AboutHero from '@/components/AboutHero'
import AboutContact from '@/components/AboutContact'
import AboutConsultation from '@/components/AboutConsultation'
import Footer from '@/components/Footer'

export default function AboutUsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <AboutHero />
        <AboutContact />
        <AboutConsultation />
      </main>
      <Footer />
    </>
  )
}
