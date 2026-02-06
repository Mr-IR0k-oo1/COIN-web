'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useBlogStore } from '@/lib/store/blogStore'
import { useHackathonStore } from '@/lib/store/hackathonStore'
import { formatDate } from '@/lib/utils'
import SyntheticHero from '@/components/ui/synthetic-hero'
import Section from '@/components/ui/Section'

export default function Home() {
  const latestPosts = useBlogStore((state) => state.getLatestPosts(3))
  const allHackathons = useHackathonStore((state) => state.getAllHackathons())
  const activeHackathons = allHackathons.filter((h) => h.status === 'Active')

  return (
    <>
      <Header />
      <main className="flex-1 overflow-hidden">
        {/* Modern 3D/GL Hero */}
        <SyntheticHero
          title="Innovate. Collaborate. Excel."
          description="CoIN is Sri Ramakrishna Engineering College's central hub for organizing, tracking, and showcasing innovation. Join the movement."
          badgeText="SREC CoIN"
          badgeLabel="Official"
          ctaButtons={[
            { text: 'Browse Hackathons', href: '/hackathons', primary: true },
            { text: 'My Participation', href: '/submit' },
          ]}
          microDetails={[
            'Participation Tracking',
            'Faculty Mentorship',
            'Innovation Analytics',
          ]}
        />

        {/* What CoIN Does */}
        <Section className="bg-white dark:bg-black transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tighter text-slate-900 dark:text-white mb-16 text-center uppercase">
              The <span className="text-gradient">Innovation</span> Ecosystem
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Hackathon Coordination', desc: 'Faculty publish and manage hackathons' },
                {
                  title: 'Participation Tracking',
                  desc: 'Track when and how students participate',
                },
                {
                  title: 'Mentorship Support',
                  desc: 'Connect mentors with participating teams',
                },
                {
                  title: 'Innovation Projects',
                  desc: 'Showcase student innovation initiatives',
                },
                {
                  title: 'Achievement Documentation',
                  desc: 'Record wins and learning outcomes',
                },
                {
                  title: 'Centralized Reporting',
                  desc: 'Export and analyze innovation data',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group bg-slate-50 dark:bg-white/5 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-coin-200 hover:shadow-xl hover:shadow-coin-900/5 transition-all duration-300"
                >
                  <div className="h-10 w-10 bg-coin-100 rounded-lg flex items-center justify-center mb-6 text-coin-600 group-hover:bg-coin-600 group-hover:text-white transition-colors">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-fancy tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Who It's For */}
        <Section className="bg-slate-50/50 dark:bg-white/[0.02] border-y border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tighter text-slate-900 dark:text-white mb-16 text-center uppercase">
              Designed for <span className="text-gradient">Everyone</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  who: 'Students',
                  features: [
                    'Discover opportunities',
                    'Register externally',
                    'Report participation',
                    'Get recognized',
                  ],
                },
                {
                  who: 'Faculty',
                  features: [
                    'Publish initiatives',
                    'Mentor teams',
                    'Track participation',
                    'Publish success stories',
                  ],
                },
                {
                  who: 'SREC',
                  features: [
                    'Centralized data',
                    'Structured reporting',
                    'Engagement insights',
                    'Export analytics',
                  ],
                },
              ].map((card, idx) => (
                <div key={idx} className="bg-white dark:bg-black p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 font-display tracking-tight uppercase">
                    {card.who}
                  </h3>
                  <ul className="space-y-4">
                    {card.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                        <span className="flex-shrink-0 h-5 w-5 rounded-full bg-coin-100 text-coin-600 flex items-center justify-center text-xs mt-0.5">
                          ✓
                        </span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* How It Works */}
        <Section className="bg-white dark:bg-black transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="md:w-1/2">
                <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tighter text-slate-900 dark:text-white mb-6 uppercase">
                  Streamlined <span className="text-gradient">Workflow</span>
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                  CoIN simplifies the complexity of tracking innovation activities across the campus.
                  From discovery to documentation, we've got it covered.
                </p>
                <div className="space-y-8">
                  {[
                    { num: '01', text: 'Faculty publish hackathons on CoIN' },
                    { num: '02', text: 'Students browse and discover opportunities' },
                    { num: '03', text: 'Students register on official hackathon websites' },
                    { num: '04', text: 'Students submit participation report to CoIN' },
                    { num: '05', text: 'CoIN tracks outcomes and showcases achievements' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-white dark:bg-black border border-slate-200 dark:border-slate-700 text-coin-600 dark:text-coin-400 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm transition-colors duration-300">
                        {item.num}
                      </div>
                      <div className="flex-1 pt-2">
                        <p className="text-lg font-bold text-slate-800 dark:text-slate-200 font-fancy tracking-tight">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:w-1/2 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-coin-100 to-transparent rounded-3xl transform rotate-3 scale-105 opacity-50" />
                <div className="relative bg-slate-900 rounded-3xl p-8 shadow-2xl text-white overflow-hidden group">
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-coin-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-4">Ready to start?</h3>
                    <p className="text-slate-300 mb-8">
                      Join hundreds of students participating in top-tier hackathons.
                    </p>
                    <Link
                      href="/hackathons"
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-coin-600 bg-white hover:bg-slate-50 transition-colors"
                    >
                      Explore Hackathons
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Current Hackathons */}
        {activeHackathons.length > 0 && (
          <Section className="bg-slate-50 dark:bg-black border-y border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tighter text-slate-900 dark:text-white mb-4 uppercase">
                    Active <span className="text-gradient">Hackathons</span>
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">Opportunities closing soon</p>
                </div>
                <Link
                  href="/hackathons"
                  className="hidden md:inline-flex items-center text-coin-600 dark:text-coin-400 font-medium hover:text-coin-700 hover:underline"
                >
                  View All Hackathons &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeHackathons.slice(0, 3).map((hackathon) => (
                  <div
                    key={hackathon.id}
                    className="group bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-coin-900/5 hover:border-coin-200 dark:hover:border-coin-700 transition-all duration-300 flex flex-col"
                  >
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          {hackathon.mode}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          Deadline: {formatDate(hackathon.registrationDeadline)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-coin-600 dark:group-hover:text-coin-400 transition-colors font-fancy tracking-tight">
                        {hackathon.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{hackathon.organizer}</p>
                      <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2">
                        {hackathon.description}
                      </p>
                    </div>
                    <div className="p-6 pt-0 mt-auto">
                      <Link
                        href={`/hackathons/${hackathon.slug}`}
                        className="block w-full text-center px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-10 md:hidden">
                <Link
                  href="/hackathons"
                  className="btn-outline inline-block"
                >
                  View All Hackathons
                </Link>
              </div>
            </div>
          </Section>
        )}

        {/* Mission */}
        <Section className="bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl md:text-7xl font-display font-extrabold mb-8 leading-[0.9] tracking-tighter uppercase">
              Fueling the <span className="text-outline">Future</span> of Innovation.
            </h2>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              We believe in tracking impact and celebrating achievements that drive progress.
              CoIN is the backbone of SREC's collaborative spirit.
            </p>
          </div>
        </Section>

        {/* Latest Blog Posts */}
        {latestPosts.length > 0 && (
          <Section className="bg-white dark:bg-black transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white mb-12 text-center">
                Latest Updates
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {latestPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-coin-900/5 hover:border-coin-200 dark:hover:border-coin-700 transition-all duration-300"
                  >
                    <div className="p-6 flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${post.category === 'Winner'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : post.category === 'Announcement'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                            }`}
                        >
                          {post.category}
                        </span>
                        <span className="text-xs text-slate-400">
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-coin-600 dark:group-hover:text-coin-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed">
                        {post.summary}
                      </p>
                    </div>
                    <div className="px-6 pb-6 pt-0">
                      <span className="text-sm font-medium text-coin-600 dark:text-coin-400 group-hover:underline">
                        Read Article &rarr;
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  href="/blog"
                  className="inline-flex items-center px-6 py-3 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-black hover:bg-slate-50 dark:hover:bg-neutral-900 transition-colors"
                >
                  View All Updates
                </Link>
              </div>
            </div>
          </Section>
        )}
      </main>
      <Footer />
    </>
  )
}
