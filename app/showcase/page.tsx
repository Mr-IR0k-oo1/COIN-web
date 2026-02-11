import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { PageHero } from '@/components/ui/page-hero'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function ShowcasePage() {
  return (
    <>
      <Header />
      <main className="w-full min-h-screen">
        <PageHero
          badge="Innovation"
          title="CoIN — Collaborative Innovation Experience"
          description="Discover a new dimension of innovation tracking. Fluid interactions, responsive feedback, and cutting-edge technology for SREC's innovation platform."
        >
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/hackathons"
              className="px-8 py-4 bg-flame-600 hover:bg-flame-500 text-white shadow-lg shadow-flame-500/25 hover:shadow-flame-500/40 hover:-translate-y-1 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Explore Hackathons
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/student/login"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 backdrop-blur-sm rounded-xl font-bold transition-all duration-300 flex items-center justify-center"
            >
              Student Portal
            </Link>
          </div>
        </PageHero>
      </main>
      <Footer />
    </>
  )
}
