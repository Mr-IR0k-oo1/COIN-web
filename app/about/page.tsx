'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import { PageHero } from '@/components/ui/page-hero'
import { ArrowRight, Check } from 'lucide-react'


export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        {/* Hero Section */}
        <PageHero
          title="Empowering Innovation"
          description="CoIN is the digital backbone for organizing, tracking, and celebrating student innovation at SREC."
          badge="Our Mission"
          align="center"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/hackathons"
              className="inline-flex items-center px-8 py-4 bg-white text-ash-950 font-semibold rounded-lg hover:bg-ash-100 transition-colors"
            >
              Explore Hackathons
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/student/login"
              className="inline-flex items-center px-8 py-4 border border-slate-300 dark:border-white/30 text-slate-900 dark:text-white font-semibold rounded-lg hover:bg-slate-50 dark:hover:border-white/50 transition-colors"
            >
              Student Portal
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </PageHero>

        {/* Purpose */}
        <Section className="bg-white dark:bg-ash-950">
          <div className="max-w-4xl mx-auto text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-ash-900 dark:text-white mb-8 uppercase tracking-tighter">Unified <span className="text-gradient">Knowledge</span></h2>
            <p className="text-xl text-ash-600 dark:text-ash-400 leading-relaxed font-light">
              CoIN serves as a centralized hub where faculty publish hackathons, students discover opportunities, and teams report their participation and achievements. More than just a platform, it is an institutional commitment to structured innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            <div className="md:col-span-7 group premium-card p-10 md:p-14">
              <div className="premium-card-inner" />
              <div className="relative z-10">
                <div className="text-xs font-black uppercase tracking-[0.4em] text-flame-500 mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-flame-500" />
                  For the Builders
                </div>
                <h3 className="text-4xl font-bold text-ash-900 dark:text-white mb-8 font-display tracking-tighter uppercase group-hover:text-gradient transition-all">For Students</h3>
                <p className="text-xl text-ash-600 dark:text-ash-400 mb-10 leading-relaxed font-light">
                  A central place to discover and participate in hackathons without searching across multiple fragmented sources. Your innovation journey starts here.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {['Unified discovery', 'Verified records', 'Institutional memory', 'Direct mentorship'].map(item => (
                    <li key={item} className="flex items-center gap-4 text-[10px] font-black text-ash-500 uppercase tracking-widest bg-ash-50 dark:bg-ash-900/50 p-4 rounded-xl border border-ash-200 dark:border-ash-800 group-hover:border-flame-500/20 transition-all">
                      <Check className="h-3 w-3 text-flame-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:col-span-5 group premium-card p-10 md:p-14 md:mt-12">
              <div className="premium-card-inner" />
              <div className="relative z-10">
                <div className="text-xs font-black uppercase tracking-[0.4em] text-ember-500 mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-ember-500" />
                  For the Future
                </div>
                <h3 className="text-4xl font-bold text-ash-900 dark:text-white mb-8 font-display tracking-tighter uppercase group-hover:text-gradient transition-all">Institution</h3>
                <p className="text-xl text-ash-600 dark:text-ash-400 mb-10 leading-relaxed font-light">
                  Visibility into innovation outcomes, department engagement, and student success metrics.
                </p>
                <div className="space-y-4">
                  {['Data Analytics', 'Strategic Insights', 'Unified Reporting'].map(item => (
                    <div key={item} className="flex items-center justify-between p-4 rounded-xl border border-ash-200 dark:border-ash-800 bg-ash-50 dark:bg-ash-900/30">
                      <span className="text-xs font-bold uppercase tracking-widest text-ash-500">{item}</span>
                      <div className="w-2 h-2 rounded-full bg-ember-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Workflow */}
        <Section className="bg-ash-50 dark:bg-ash-950 border-y border-ash-200 dark:border-ash-800">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-ash-900 mb-4">How It Works</h2>
            <p className="text-ash-600">A seamless process from discovery to documentation.</p>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-0.5 bg-ash-200 transform -translate-x-1/2" />

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
                  <div className="absolute left-0 md:left-1/2 w-8 h-8 bg-white dark:bg-ash-900 border-4 border-flame-500 rounded-full z-10 transform -translate-x-1/2 flex items-center justify-center shadow-sm">
                    <div className="w-2 h-2 bg-flame-500 rounded-full" />
                  </div>

                  {/* Content Card */}
                  <div className={`ml-12 md:ml-0 md:w-5/12 ${idx % 2 === 0 ? 'md:mr-auto md:text-right' : 'md:ml-auto md:text-left'}`}>
                    <div className="bg-white dark:bg-ash-900 p-6 rounded-2xl border border-ash-200 dark:border-ash-800 shadow-sm hover:shadow-md transition-shadow">
                      <span className="text-xs font-bold text-flame-500 tracking-wider uppercase mb-2 block">Step {step.num}</span>
                      <h3 className="text-xl font-bold text-ash-900 mb-2">{step.title}</h3>
                      <p className="text-ash-600 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* CTA */}
        <Section className="bg-white dark:bg-ash-950">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-flame-600/30 via-ember-600/30 to-ember-600/30 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
            <div className="relative bg-ash-950 rounded-[3rem] p-16 md:p-24 overflow-hidden border border-white/10 text-center">
              <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-flame-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20" />

              <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-8 uppercase tracking-tighter relative z-10 leading-tight">Ready to get <span className="text-gradient">involved?</span></h2>
              <p className="text-xl text-ash-400 mb-12 max-w-2xl mx-auto relative z-10 font-light leading-relaxed">
                Join the innovation movement at SREC. Whether you're organizing or participating, CoIN is your digital command center.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                <Link href="/hackathons" className="group/btn px-10 py-5 bg-white text-ash-950 rounded-full font-bold hover:bg-flame-50 transition-all shadow-2xl shadow-white/10 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center">
                  EXPLORE HACKATHONS
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                </Link>
                <Link href="/submit" className="group/btn px-10 py-5 bg-white/5 text-white border border-white/10 rounded-full font-bold hover:bg-white/10 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center">
                  SUBMIT PARTICIPATION
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
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
