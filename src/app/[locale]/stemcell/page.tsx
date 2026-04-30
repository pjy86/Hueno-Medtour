import Header from '@/components/Header'
import StemCellHero from '@/components/StemCellHero'
import StemCellAdvantages from '@/components/StemCellAdvantages'
import StemCellPrograms from '@/components/StemCellPrograms'
import StemCellWhyChina from '@/components/StemCellWhyChina'
import StemCellBoaoZone from '@/components/StemCellBoaoZone'
import Footer from '@/components/Footer'

export default function StemCellPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <StemCellHero />
        <StemCellAdvantages />
        <StemCellPrograms />
        <StemCellWhyChina />
        <StemCellBoaoZone />
      </main>
      <Footer />
    </>
  )
}
