'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useSubmissionStore } from '@/lib/store/submissionStore'
import { useState, useEffect, Suspense } from 'react'
import { Submission } from '@/lib/types'

function SuccessContent() {
  const searchParams = useSearchParams()
  const submissionId = searchParams.get('id')
  const [submission, setSubmission] = useState<Submission | undefined>(undefined)
  const getSubmissionById = useSubmissionStore((state) => state.getSubmissionById)

  useEffect(() => {
    if (submissionId) {
      getSubmissionById(submissionId).then(setSubmission)
    }
  }, [submissionId, getSubmissionById])

  return (
    <>
      <Header />
      <main className="flex-1">
        <Section className="bg-white dark:bg-ash-950 pt-40 pb-32">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-12 relative inline-block">
              <div className="absolute inset-0 bg-flame-500 blur-2xl opacity-20 animate-pulse" />
              <div className="w-24 h-24 bg-flame-500/10 border border-flame-500/20 rounded-3xl flex items-center justify-center mx-auto relative z-10">
                <svg
                  className="w-12 h-12 text-flame-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-extrabold text-ash-900 dark:text-white mb-6 uppercase tracking-tighter">Mission <span className="text-gradient">Accomplished</span></h1>
            <p className="text-xl text-ash-600 dark:text-ash-400 mb-12 font-light">
              Your participation record has been successfully transmitted and registered within the CoIN system.
            </p>

            {submission && (
              <div className="premium-card p-1 mb-12 text-left">
                <div className="premium-card-inner" />
                <div className="relative z-10 p-10 md:p-12">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-ash-100 dark:border-ash-800 pb-8">
                    <div>
                      <p className="text-[10px] font-bold text-ash-400 dark:text-ash-500 mb-1 uppercase tracking-widest">Entry ID</p>
                      <p className="text-2xl md:text-3xl font-mono font-bold text-flame-600 dark:text-flame-400 break-all">{submission.id}</p>
                    </div>
                    <Badge className="bg-flame-500/10 text-flame-500 border-flame-500/20 py-2 px-6 rounded-full font-bold uppercase tracking-widest whitespace-nowrap">VERIFIED ENTRY</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                      <p className="text-[10px] font-bold text-ash-400 dark:text-ash-500 mb-2 uppercase tracking-widest">HACKATHON</p>
                      <p className="text-xl font-bold text-ash-900 dark:text-white leading-snug">{submission.hackathonName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-ash-400 dark:text-ash-500 mb-2 uppercase tracking-widest">TEAM IDENTITY</p>
                      <p className="text-xl font-bold text-ash-900 dark:text-white leading-snug">{submission.teamName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-ash-400 dark:text-ash-500 mb-2 uppercase tracking-widest">OPERATIONAL NODES</p>
                      <p className="text-xl font-bold text-ash-900 dark:text-white">{submission.participantCount} Participants</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="glass dark:glass-dark border-ember-500/20 dark:border-ember-500/10 rounded-[2.5rem] p-10 md:p-12 mb-16 text-left">
              <h3 className="text-2xl font-bold text-ash-900 dark:text-white mb-8 border-b border-ember-500/10 pb-4 inline-block tracking-tight">Next Protocols</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { step: '01', text: 'Participation is now officially archived in CoIN.' },
                  { step: '02', text: 'Academic review will validate these credentials.' },
                  { step: '03', text: 'Exceptional outcomes will be featured in the global feed.' },
                  { step: '04', text: 'Monitor your dashboard for institutional recognition.' }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <span className="text-lg font-bold text-flame-600 dark:text-flame-400 font-mono tracking-tighter bg-flame-500/10 px-3 py-1 rounded-lg border border-flame-500/20">{item.step}</span>
                    <span className="text-ash-600 dark:text-ash-400 leading-relaxed font-light">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/" className="group/btn px-10 py-5 bg-ash-900 dark:bg-flame-600 text-white rounded-full font-bold hover:bg-ash-800 dark:hover:bg-flame-500 transition-all shadow-2xl shadow-flame-500/20 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center">
                RETURN TO HUB
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
              </Link>
              <Link href="/blog" className="group/btn px-10 py-5 bg-white dark:bg-ash-900 text-ash-900 dark:text-white border border-ash-200 dark:border-ash-700 rounded-full font-bold hover:bg-ash-50 dark:hover:bg-ash-800 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center">
                READ UPDATES
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-flame-600"></div>
            <p className="mt-4 text-ash-600 dark:text-ash-400">Loading success details...</p>
          </div>
        </main>
        <Footer />
      </>
    }>
      <SuccessContent />
    </Suspense>
  )
}
