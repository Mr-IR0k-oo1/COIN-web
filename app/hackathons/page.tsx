'use client'

import { useEffect, useState, useMemo } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useHackathonStore } from '@/lib/store/hackathonStore'
import { formatDate, cn } from '@/lib/utils'
import Section from '@/components/ui/Section'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'

export default function HackathonsPage() {
  const hackathons = useHackathonStore((state) => state.hackathons)
  const fetchHackathons = useHackathonStore((state) => state.fetchHackathons)
  const isLoading = useHackathonStore((state) => state.isLoading)
  const [statusFilter, setStatusFilter] = useState<string>('All')

  useEffect(() => {
    fetchHackathons()
  }, [fetchHackathons])

  const filtered = useMemo(() =>
    hackathons.filter((h) => statusFilter === 'All' || h.status === statusFilter),
    [hackathons, statusFilter]
  )

  return (
    <>
      <Header />
      <main className="flex-1">
        <Section className="bg-ash-50 dark:bg-ash-950 border-b border-ash-200 dark:border-ash-800 pt-32 pb-16">
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-ash-900 dark:text-white mb-6 uppercase tracking-tighter">
            Find Your Next <span className="text-gradient">Challenge</span>
          </h1>
          <p className="text-lg text-ash-600 max-w-2xl">
            Discover upcoming hackathons, coding competitions, and innovation opportunities at
            SREC. Filter by status to find open registrations.
          </p>
        </Section>

        <Section className="bg-white dark:bg-ash-950">
          <div className="mb-16 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="flex flex-wrap items-center gap-4">
              {['All', 'Active', 'Upcoming', 'Closed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all border",
                    statusFilter === status
                      ? "bg-ash-900 dark:bg-white text-white dark:text-ash-950 border-transparent shadow-xl scale-105"
                      : "bg-white dark:bg-ash-900 text-ash-500 border-ash-200 dark:border-ash-800 hover:border-ash-400 dark:hover:border-ash-600"
                  )}
                >
                  {status} {status === 'All' ? 'Challenges' : ''}
                </button>
              ))}
            </div>
            <div className="bg-flame-500/5 px-6 py-3 rounded-2xl border border-flame-500/10 flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-flame-500 animate-pulse" />
              <span className="text-[10px] font-black text-flame-600 dark:text-flame-400 uppercase tracking-[0.3em]">
                {filtered.length} Active Listings
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-flame-600"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 bg-ash-50 dark:bg-ash-950 rounded-3xl border border-dashed border-ash-200 dark:border-ash-800">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ash-100 mb-4 text-ash-400">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-ash-900 font-medium mb-2">No hackathons found</p>
              <p className="text-ash-500 mb-6">Try adjusting your filters or check back later.</p>
              <Link href="/" className="inline-flex items-center justify-center px-5 py-2.5 border border-ash-200 rounded-lg text-sm font-medium text-ash-700 bg-white hover:bg-ash-50 transition-colors">
                Back to Home
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {filtered.map((hackathon) => (
                <div
                  key={hackathon.id}
                  className="group relative bg-white dark:bg-ash-900/40 rounded-[2.5rem] border border-ash-200 dark:border-ash-800 hover:border-flame-500/30 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8">
                    <div className={cn(
                      "w-3 h-3 rounded-full shadow-[0_0_15px]",
                      hackathon.status === 'Active' ? 'bg-green-500 shadow-green-500/50' :
                        hackathon.status === 'Upcoming' ? 'bg-blue-500 shadow-blue-500/50' : 'bg-ash-400 shadow-ash-400/50'
                    )} />
                  </div>

                  <div className="p-10 md:p-14">
                    <div className="flex flex-col lg:flex-row gap-12 lg:items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-ash-400">
                          <span>{hackathon.mode}</span>
                          <span className="w-1 h-1 rounded-full bg-ash-300" />
                          <span className="text-flame-600 dark:text-flame-400">{hackathon.organizer}</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-ash-900 dark:text-white mb-6 tracking-tighter uppercase leading-none group-hover:text-gradient">
                          {hackathon.name}
                        </h2>

                        <p className="text-lg text-ash-600 dark:text-ash-400 max-w-2xl leading-relaxed font-light mb-8">
                          {hackathon.description}
                        </p>

                        <div className="flex flex-wrap gap-10">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-ash-400 mb-2">Registration</p>
                            <p className="text-ash-900 dark:text-white font-bold">{formatDate(hackathon.registrationDeadline)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-ash-400 mb-2">Event Window</p>
                            <p className="text-ash-900 dark:text-white font-bold">
                              {formatDate(hackathon.startDate)} — {formatDate(hackathon.endDate)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="lg:w-px lg:h-32 bg-ash-100 dark:bg-ash-800 hidden lg:block" />

                      <div className="flex-shrink-0">
                        <Link
                          href={`/hackathons/${hackathon.slug}`}
                          className="inline-flex items-center justify-center px-10 py-5 bg-ash-950 dark:bg-white text-white dark:text-ash-950 font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-flame-600 dark:hover:bg-flame-500 hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl"
                        >
                          Explore Brief
                          <ArrowRight className="ml-3 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </main>
      <Footer />
    </>
  )
}
