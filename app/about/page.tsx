'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <Section className="bg-slate-900 text-white border-b border-slate-800 pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 tracking-tight">
              Empowering Innovation at SREC
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              CoIN (Collaborative Innovation Center) is the digital backbone for organizing, tracking, and celebrating student innovation.
            </p>
          </div>
        </Section>

        {/* Mission */}
        <Section className="bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg mx-auto text-slate-600">
              <h2 className="text-3xl font-heading font-bold text-slate-900 mb-6 text-center">What is CoIN?</h2>
              <p className="text-center text-lg leading-relaxed mb-12">
                CoIN serves as a centralized hub where faculty publish hackathons, students discover opportunities, and teams report their participation and achievements. More than just a platform, it is an institutional commitment to structured innovation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-4 font-heading">For Students</h3>
                <p className="text-slate-600 mb-4">
                  A central place to discover and participate in hackathons without searching across multiple fragmented sources.
                </p>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li className="flex items-center gap-2">✓ Unified discovery platform</li>
                  <li className="flex items-center gap-2">✓ Verified participation records</li>
                  <li className="flex items-center gap-2">✓ Recognition for achievements</li>
                </ul>
              </div>
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-4 font-heading">For Institution</h3>
                <p className="text-slate-600 mb-4">
                  Visibility into innovation outcomes, department engagement, and student success metrics across the campus.
                </p>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li className="flex items-center gap-2">✓ Centralized data tracking</li>
                  <li className="flex items-center gap-2">✓ Mentorship coordination</li>
                  <li className="flex items-center gap-2">✓ Outcome analysis</li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        {/* Workflow */}
        <Section className="bg-slate-50 border-y border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">How It Works</h2>
              <p className="text-slate-600">A seamless process from discovery to documentation.</p>
            </div>

            <div className="relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-0.5 bg-slate-200 transform -translate-x-1/2" />

              <div className="space-y-12">
                {[
                  {
                    title: 'Faculty Publish',
                    desc: 'Faculty create event listings with official registration links and details.',
                    num: '01'
                  },
                  {
                    title: 'Students Discover',
                    desc: 'Students browse CoIN to find hackathons that match their skills and interests.',
                    num: '02'
                  },
                  {
                    title: 'External Registration',
                    desc: 'Teams register on the official event platforms (e.g., Devfolio, Unstop).',
                    num: '03'
                  },
                  {
                    title: 'Report Participation',
                    desc: 'After registering, teams log their participation entry in CoIN for tracking.',
                    num: '04'
                  },
                  {
                    title: 'Track & Celebrate',
                    desc: 'Outcomes are verified, winners are showcased, and data is aggregated.',
                    num: '05'
                  }
                ].map((step, idx) => (
                  <div key={idx} className={`relative flex items-center justify-between md:justify-center group ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    {/* Center Dot */}
                    <div className="absolute left-0 md:left-1/2 w-8 h-8 bg-white border-4 border-coin-500 rounded-full z-10 transform -translate-x-1/2 flex items-center justify-center shadow-sm">
                      <div className="w-2 h-2 bg-coin-500 rounded-full" />
                    </div>

                    {/* Content Card */}
                    <div className={`ml-12 md:ml-0 md:w-5/12 ${idx % 2 === 0 ? 'md:mr-auto md:text-right' : 'md:ml-auto md:text-left'}`}>
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <span className="text-xs font-bold text-coin-500 tracking-wider uppercase mb-2 block">Step {step.num}</span>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* CTA */}
        <Section className="bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-slate-900 rounded-3xl p-12 relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-coin-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -ml-16 -mb-16" />

              <h2 className="text-3xl font-heading font-bold mb-6 relative z-10">Ready to get involved?</h2>
              <p className="text-slate-300 mb-8 max-w-lg mx-auto relative z-10">
                Join the innovation movement at SREC. Whether you're organized or participating, CoIN is your starting point.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <Link href="/hackathons" className="px-6 py-3 bg-white text-slate-900 rounded-xl font-medium hover:bg-slate-100 transition-colors">
                  Browse Hackathons
                </Link>
                <Link href="/submit" className="px-6 py-3 bg-slate-800 text-white rounded-xl font-medium border border-slate-700 hover:bg-slate-700 transition-colors">
                  Submit Participation
                </Link>
              </div>
            </div>
          </div>
        </Section>

      </main>
      <Footer />
    </>
  )
}
