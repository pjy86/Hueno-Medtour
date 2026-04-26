import Header from '@/components/Header'
import CheckupHero from '@/components/CheckupHero'
import CheckupServices from '@/components/CheckupServices'
import CheckupPackages from '@/components/CheckupPackages'
import CheckupProcess from '@/components/CheckupProcess'
import CheckupEnvironment from '@/components/CheckupEnvironment'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'

export default function CheckupPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <CheckupHero />
        <CheckupServices />
        <CheckupPackages />
        <CheckupProcess />
        <CheckupEnvironment />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
