'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useHackathonStore } from '@/lib/store/hackathonStore'
import { formatDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Hackathon } from '@/lib/types'

interface PageProps {
  params: {
    slug: string
  }
}

export default function HackathonDetailPage({ params }: PageProps) {
  const router = useRouter()
  const getHackathonBySlug = useHackathonStore((state) => state.getHackathonBySlug)
  const [hackathon, setHackathon] = useState<Hackathon | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHackathon = async () => {
      setLoading(true)
      const data = await getHackathonBySlug(params.slug)
      setHackathon(data)
      setLoading(false)
    }
    fetchHackathon()
  }, [params.slug, getHackathonBySlug])

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <section className="py-24 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coin-600"></div>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  if (!hackathon) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <section className="py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl font-bold mb-4">Opportunity Not Found</h1>
              <p className="text-gray-600 mb-8">
                The intelligence record you're seeking protocol for does not exist in our nodes.
              </p>
              <Link href="/hackathons" className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl">
                Back to Feed
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="pt-32 pb-12 bg-white dark:bg-black border-b border-gray-100 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => router.back()}
              className="text-coin-600 hover:text-coin-700 font-bold text-sm mb-6 flex items-center gap-2"
            >
              ← Back to Overview
            </button>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
                {hackathon.name}
              </h1>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest ${hackathon.status === 'Active' ? 'bg-green-100 text-green-700' :
                  hackathon.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                }`}>
                {hackathon.status}
              </span>
            </div>
            <p className="text-lg text-slate-500 font-medium">Platform Infrastructure provided by <span className="text-slate-900 dark:text-white">{hackathon.organizer}</span></p>
          </div>
        </section>

        <section className="py-16 bg-slate-50 dark:bg-black/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                <div className="bg-white dark:bg-neutral-900 p-10 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h2 className="text-2xl font-bold dark:text-white font-heading mb-6">Mission Overview</h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{hackathon.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-12 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Protocol Mode</p>
                      <p className="text-slate-900 dark:text-white font-bold">{hackathon.mode}</p>
                    </div>
                    {hackathon.location && (
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Physical Node</p>
                        <p className="text-slate-900 dark:text-white font-bold">{hackathon.location}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Temporal Node</p>
                      <p className="text-slate-900 dark:text-white font-bold">{hackathon.semester}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 p-10 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h2 className="text-2xl font-bold dark:text-white font-heading mb-8">Temporal Markers</h2>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-6 border-b border-slate-100 dark:border-slate-800">
                      <span className="font-bold text-slate-500">Execution Phase Start</span>
                      <span className="text-slate-900 dark:text-white font-mono font-bold">{formatDate(hackathon.startDate)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-6 border-b border-slate-100 dark:border-slate-800">
                      <span className="font-bold text-slate-500">Execution Phase Termination</span>
                      <span className="text-slate-900 dark:text-white font-mono font-bold">{formatDate(hackathon.endDate)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-bold text-slate-500">Registration Flux Deadline</span>
                      <span className="text-red-500 font-mono font-bold">
                        {formatDate(hackathon.registrationDeadline)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 p-10 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h2 className="text-2xl font-bold dark:text-white font-heading mb-6">Access Clearance</h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{hackathon.eligibility}</p>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-slate-900 dark:bg-neutral-900 p-10 rounded-[40px] text-white sticky top-32 border border-white/5 shadow-2xl overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>

                  <div className="relative z-10 space-y-8">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Command Actions</p>
                      <div className="space-y-4">
                        <a
                          href={hackathon.officialLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center p-4 bg-white text-slate-900 font-bold rounded-2xl hover:scale-105 transition-all text-sm"
                        >
                          Visit Official Node
                        </a>
                        <Link
                          href={`/submit?hackathon=${hackathon.id}`}
                          className="w-full flex items-center justify-center p-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all text-sm border border-white/10"
                        >
                          Report Participation
                        </Link>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/10">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Node Instructions</p>
                      <div className="bg-white/5 rounded-2xl p-6 text-sm text-slate-300 leading-relaxed border border-white/5">
                        Register on the official third-party platform first, then document your engagement on the CoIN framework for institutional credit.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
