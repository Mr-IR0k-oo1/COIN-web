'use client'

import { useEffect, useState, useMemo } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useHackathonStore } from '@/lib/store/hackathonStore'
import { formatDate, cn } from '@/lib/utils'
import Section from '@/components/ui/Section'
import { Badge } from '@/components/ui/badge'
import { PageHero } from '@/components/ui/page-hero'
import { ArrowRight, Filter } from 'lucide-react'

export default function HackathonsPage() {
  const hackathons = useHackathonStore((state) => state.hackathons)
  const fetchHackathons = useHackathonStore((state) => state.fetchHackathons)
  const isLoading = useHackathonStore((state) => state.isLoading)
  const [statusFilter, setStatusFilter] = useState<string>('All')

  useEffect(() => {
    fetchHackathons()
  }, [fetchHackathons])

  const statusMap = {
    'All': 'All',
    'Active': 'ONGOING',
    'Upcoming': 'UPCOMING',
    'Closed': 'CLOSED'
  }

  const filtered = useMemo(() =>
    hackathons.filter((h) => {
      if (statusFilter === 'All') return true
      const backendStatus = statusMap[statusFilter as keyof typeof statusMap]
      return h.status === backendStatus
    }),
    [hackathons, statusFilter]
  )

  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHero
          fullHeight={true}
          title="Find Your Challenge"
          description="Discover upcoming hackathons, coding competitions, and innovation opportunities. Compete, collaborate, and create impact."
          badge="SREC Innovation Hub"
          align="center"
        />

        <Section fullHeight={true} variant="minimal" className="bg-white dark:bg-black">
          <div className="sticky top-24 z-30 mb-16 glass-premium rounded-2xl p-4 md:p-6 border border-slate-200 dark:border-white/10 flex flex-col md:flex-row gap-8 items-center justify-between shadow-xl backdrop-blur-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="mr-4 flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <Filter className="w-4 h-4" /> Filter
              </div>
              {['All', 'Active', 'Upcoming', 'Closed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border",
                    statusFilter === status
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg transform scale-105"
                      : "bg-transparent text-slate-500 border-transparent hover:bg-slate-100 dark:hover:bg-white/10"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="bg-flame-500/10 px-6 py-3 rounded-xl border border-flame-500/20 flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-flame-500 animate-pulse" />
              <span className="text-[10px] font-black text-flame-600 dark:text-flame-400 uppercase tracking-[0.2em]">
                {filtered.length} Opportunities
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-flame-500"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-32 bg-slate-50 dark:bg-slate-900/20 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-6 text-slate-400">
                <Filter className="w-8 h-8 opacity-50" />
              </div>
              <p className="text-slate-900 dark:text-white font-bold text-xl mb-2">No hackathons found</p>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto">We couldn't find any hackathons matching your filter. Try selecting a different status.</p>
              <button onClick={() => setStatusFilter('All')} className="inline-flex items-center justify-center px-6 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-black hover:bg-slate-50 transition-colors">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {filtered.map((hackathon) => (
                <div
                  key={hackathon.id}
                  className="group relative bg-white dark:bg-neutral-900/30 rounded-[2.5rem] border border-slate-200 dark:border-white/5 hover:border-flame-500/30 transition-all duration-500 overflow-hidden hover:shadow-2xl"
                >
                  <div className="absolute top-0 right-0 p-8 md:p-10 pointer-events-none">
                    <span className={cn(
                      "inline-flex items-center px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md border",
                      hackathon.status === 'ONGOING' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                        hackathon.status === 'UPCOMING' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                          'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                    )}>
                      {hackathon.status === 'ONGOING' ? 'Active' : hackathon.status === 'UPCOMING' ? 'Upcoming' : 'Closed'}
                    </span>
                  </div>

                  <div className="p-8 md:p-14">
                    <div className="flex flex-col lg:flex-row gap-12 lg:items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-flame-500">
                          <span>{hackathon.mode}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-slate-400">{hackathon.organizer}</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-display font-black text-slate-900 dark:text-white mb-6 tracking-tighter uppercase leading-none group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-flame-500 group-hover:to-ember-500 transition-all duration-300">
                          {hackathon.name}
                        </h2>

                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed font-light mb-10">
                          {hackathon.description}
                        </p>

                        <div className="flex flex-wrap gap-x-12 gap-y-6">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Registration Deadline</p>
                            <p className="text-slate-900 dark:text-white font-bold font-display text-lg tracking-tight">{formatDate(hackathon.registrationDeadline)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Event Duration</p>
                            <p className="text-slate-900 dark:text-white font-bold font-display text-lg tracking-tight">
                              {formatDate(hackathon.startDate)} — {formatDate(hackathon.endDate)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="lg:w-px lg:h-32 bg-gradient-to-b from-transparent via-slate-200 dark:via-white/10 to-transparent hidden lg:block" />

                      <div className="flex-shrink-0">
                        <Link
                          href={`/hackathons/${hackathon.slug}`}
                          className="group/btn inline-flex items-center justify-center px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-flame-600 dark:hover:bg-flame-500 hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl w-full md:w-auto"
                        >
                          Explore Brief
                          <ArrowRight className="ml-3 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
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
