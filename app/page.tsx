'use client'

import { useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useBlogStore } from '@/lib/store/blogStore'
import { useHackathonStore } from '@/lib/store/hackathonStore'
import { formatDate } from '@/lib/utils'
import dynamic from 'next/dynamic'
import Section from '@/components/ui/Section'
import { ArrowRight, Check } from 'lucide-react'

const EtherealBeamsHero = dynamic(() => import('@/components/ui/ethereal-beams-hero'), {
  ssr: false,
  loading: () => <div className="h-screen w-full bg-black animate-pulse" />
})

export default function Home() {
  const fetchPosts = useBlogStore((state) => state.fetchPosts)
  const latestPosts = useBlogStore((state) => state.getLatestPosts(3))

  const fetchHackathons = useHackathonStore((state) => state.fetchHackathons)
  const allHackathons = useHackathonStore((state) => state.hackathons)
  const activeHackathons = allHackathons.filter((h) => h.status === 'Active')

  useEffect(() => {
    fetchPosts()
    fetchHackathons()
  }, [fetchPosts, fetchHackathons])

  return (
    <>
      <Header />
      <main className="flex-1 overflow-hidden">
        {/* Ethereal Beams Hero */}
        <EtherealBeamsHero />

        {/* What CoIN Does */}
        <Section className="bg-white dark:bg-black transition-colors duration-300">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 dark:text-white mb-16 text-center">
            The Innovation Ecosystem
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Hackathon Coordination', desc: 'Faculty publish and manage hackathons' },
              { title: 'Participation Tracking', desc: 'Track when and how students participate' },
              { title: 'Mentorship Support', desc: 'Connect mentors with participating teams' },
              { title: 'Innovation Projects', desc: 'Showcase student innovation initiatives' },
              { title: 'Achievement Documentation', desc: 'Record wins and learning outcomes' },
              { title: 'Centralized Reporting', desc: 'Export and analyze innovation data' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200 bg-white dark:bg-slate-950"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Who It's For */}
        <Section className="bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-16 text-center">
            Designed for Everyone
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                who: 'Students',
                features: ['Discover opportunities', 'Register externally', 'Report participation', 'Get recognized'],
              },
              {
                who: 'Faculty',
                features: ['Publish initiatives', 'Mentor teams', 'Track participation', 'Publish success stories'],
              },
              {
                who: 'SREC',
                features: ['Centralized data', 'Structured reporting', 'Engagement insights', 'Export analytics'],
              },
            ].map((card, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-950 p-6 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  {card.who}
                </h3>
                <ul className="space-y-3">
                  {card.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-sm">
                      <Check className="h-4 w-4 flex-shrink-0 mt-0.5 text-flame-500" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* How It Works */}
        <Section className="bg-white dark:bg-black transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6">
                Streamlined Workflow
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                CoIN simplifies tracking innovation activities across campus from discovery to documentation.
              </p>
              <div className="space-y-4">
                {[
                  { num: '01', text: 'Faculty publish hackathons on CoIN' },
                  { num: '02', text: 'Students browse and discover opportunities' },
                  { num: '03', text: 'Students register on official hackathon websites' },
                  { num: '04', text: 'Students submit participation report to CoIN' },
                  { num: '05', text: 'CoIN tracks outcomes and showcases achievements' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-slate-100 dark:bg-slate-800 text-flame-600 dark:text-flame-400 rounded-lg flex items-center justify-center font-semibold text-sm">
                      {item.num}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-slate-700 dark:text-slate-300 font-medium">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-8 border border-slate-200 dark:border-slate-800">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Ready to start?</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Join students participating in hackathons and track your innovation journey.
              </p>
              <Link
                href="/hackathons"
                className="inline-flex items-center px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                Explore Hackathons
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </Section>

        {/* Current Hackathons */}
        {activeHackathons.length > 0 && (
          <Section className="bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">
                  Active Hackathons
                </h2>
                <p className="text-slate-600 dark:text-slate-400">Opportunities closing soon</p>
              </div>
              <Link
                href="/hackathons"
                className="hidden md:inline-flex items-center text-flame-600 dark:text-flame-400 font-medium hover:text-flame-700 dark:hover:text-flame-300 transition-colors"
              >
                View All Hackathons <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeHackathons.slice(0, 3).map((hackathon) => (
                <div
                  key={hackathon.id}
                  className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200 flex flex-col"
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
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
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
          </Section>
        )}

        {/* Mission */}
        <Section className="bg-slate-900 dark:bg-slate-950 text-white">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
              Fueling the Future of Innovation
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
              We believe in tracking impact and celebrating achievements that drive progress. CoIN is the backbone of SREC's collaborative spirit.
            </p>
          </div>
        </Section>

        {/* Latest Blog Posts */}
        {latestPosts.length > 0 && (
          <Section className="bg-white dark:bg-black transition-colors duration-300">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-12 text-center">
              Latest Updates
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="flex flex-col bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200"
                >
                  <div className="p-6 flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${post.category === 'Winner'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        : post.category === 'Announcement'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                        }`}>
                        {post.category}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed">
                      {post.summary}
                    </p>
                  </div>
                  <div className="px-6 pb-6 pt-0">
                    <span className="text-sm font-medium text-flame-600 dark:text-flame-400">
                      Read Article <ArrowRight className="inline ml-1 h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/blog"
                className="inline-flex items-center px-6 py-3 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                View All Updates
              </Link>
            </div>
          </Section>
        )}
      </main>
      <Footer />
    </>
  )
}
