'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useHackathonStore } from '@/lib/store/hackathonStore'
import { formatDate } from '@/lib/utils'
import { useState } from 'react'
import Section from '@/components/ui/Section'
import { Badge } from '@/components/ui/badge'

export default function HackathonsPage() {
  const hackathons = useHackathonStore((state) => state.getAllHackathons())
  const [statusFilter, setStatusFilter] = useState<string>('All')

  const filtered = hackathons.filter(
    (h) => statusFilter === 'All' || h.status === statusFilter
  )

  return (
    <>
      <Header />
      <main className="flex-1">
        <Section className="bg-slate-50 border-b border-slate-200 pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6">
              Find Your Next Challenge
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              Discover upcoming hackathons, coding competitions, and innovation opportunities at
              SREC. Filter by status to find open registrations.
            </p>
          </div>
        </Section>

        <Section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700">Filter by Status:</label>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-coin-500 focus:border-coin-500 block w-full p-2.5 pr-8 transition-colors"
                  >
                    <option value="All">All Hackathons</option>
                    <option value="Active">Active</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Closed">Closed</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="text-sm text-slate-500">
                Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-24 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4 text-slate-400">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-slate-900 font-medium mb-2">No hackathons found</p>
                <p className="text-slate-500 mb-6">Try adjusting your filters or check back later.</p>
                <Link href="/" className="inline-flex items-center justify-center px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                  Back to Home
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {filtered.map((hackathon) => (
                  <div
                    key={hackathon.id}
                    className="group bg-white rounded-2xl border border-slate-200 p-6 md:p-8 hover:shadow-xl hover:shadow-coin-900/5 hover:border-coin-200 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <h2 className="text-2xl font-bold text-slate-900 font-heading">
                            {hackathon.name}
                          </h2>
                          <Badge
                            variant={
                              hackathon.status === 'Active'
                                ? 'default'
                                : hackathon.status === 'Upcoming'
                                  ? 'secondary'
                                  : hackathon.status === 'Closed'
                                    ? 'destructive'
                                    : 'outline'
                            }
                            className="text-xs uppercase tracking-wider"
                          >
                            {hackathon.status}
                          </Badge>
                        </div>

                        <p className="text-sm font-medium text-coin-600 mb-4 uppercase tracking-wide">
                          {hackathon.organizer}
                        </p>

                        <p className="text-slate-600 mb-6 leading-relaxed max-w-3xl">
                          {hackathon.description}
                        </p>

                        <div className="flex flex-wrap gap-y-4 gap-x-12 text-sm border-t border-slate-100 pt-6">
                          <div>
                            <p className="text-slate-400 mb-1 text-xs uppercase font-semibold tracking-wider">Mode</p>
                            <p className="text-slate-900 font-medium">{hackathon.mode}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 mb-1 text-xs uppercase font-semibold tracking-wider">Event Dates</p>
                            <p className="text-slate-900 font-medium">
                              {formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-400 mb-1 text-xs uppercase font-semibold tracking-wider">Registration Deadline</p>
                            <p className="text-slate-900 font-medium">
                              {formatDate(hackathon.registrationDeadline)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center items-stretch md:w-48 flex-shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8 mt-2 md:mt-0">
                        <Link
                          href={`/hackathons/${hackathon.slug}`}
                          className="flex items-center justify-center w-full px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 active:scale-95"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  )
}
