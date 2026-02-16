'use client'

import { useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useBlogStore } from '@/lib/store/blogStore'
import { useHackathonStore } from '@/lib/store/hackathonStore'
import { formatDate } from '@/lib/utils'
import { PageHero } from '@/components/ui/page-hero'
import Section from '@/components/ui/Section'
import { ArrowRight, Check, Zap, Trophy, Users, Globe, BarChart3, Rocket } from 'lucide-react'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'

export default function Home() {
  const fetchPosts = useBlogStore((state) => state.fetchPosts)
  const latestPosts = useBlogStore((state) => state.getLatestPosts(3))

  const fetchHackathons = useHackathonStore((state) => state.fetchHackathons)
  const allHackathons = useHackathonStore((state) => state.hackathons)
  const activeHackathons = allHackathons.filter((h) => h.status === 'ONGOING')

  useEffect(() => {
    fetchPosts()
    fetchHackathons()
  }, [fetchPosts, fetchHackathons])

  return (
    <>
      <Header />
      <main className="flex-1 overflow-hidden noise-bg">
        {/* Hero Section */}
        <PageHero
          fullHeight={true}
          badge="System v2.0"
          title={
            <>
              Design <span className="text-flame-600">The Future</span>
              <br />
              Of <span className="text-slate-500">Innovation.</span>
            </>
          }
          description="A unified platform to manage, track, and amplify student innovation at scale."
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
        {/* Innovation Ecosystem */}
        <Section fullHeight={true} variant="grid" className="bg-background">
          <div className="relative z-10">
            <div className="text-center mb-24">
              <span className="tech-label text-primary mb-4 block">System Capabilities</span>
              <h2 className="text-4xl md:text-7xl font-display font-bold text-foreground mb-6 tracking-tight">
                The <span className="text-gradient">Innovation</span> Ecosystem
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A unified platform to manage, track, and amplify student innovation at scale.
              </p>
            </div>

            <BentoGrid className="max-w-6xl mx-auto">
              {[
                {
                  title: 'Hackathon Coordination',
                  desc: 'Faculty publish and manage hackathons seamlessly with automated workflows.',
                  icon: <Globe className="w-6 h-6" />,
                  className: "md:col-span-1"
                },
                {
                  title: 'Global Participation Tracking',
                  desc: 'Track when and how students participate globally across multiple categories and events.',
                  icon: <Users className="w-6 h-6" />,
                  className: "md:col-span-2"
                },
                {
                  title: 'Instant Mentorship Support',
                  desc: 'Connect mentors with participating teams instantly to provide guidance and feedback.',
                  icon: <Zap className="w-6 h-6" />,
                  className: "md:col-span-2"
                },
                {
                  title: 'Innovation Projects',
                  desc: 'Showcase student innovation initiatives to the world.',
                  icon: <Rocket className="w-6 h-6" />,
                  className: "md:col-span-1"
                },
                {
                  title: 'Achievement Documentation',
                  desc: 'Record wins and learning outcomes automatically.',
                  icon: <Trophy className="w-6 h-6" />,
                  className: "md:col-span-1"
                },
                {
                  title: 'Centralized Data Reporting',
                  desc: 'Export and analyze innovation data for insights, accreditation, and strategic planning.',
                  icon: <BarChart3 className="w-6 h-6" />,
                  className: "md:col-span-2"
                },
              ].map((item, idx) => (
                <BentoGridItem
                  key={idx}
                  title={item.title}
                  description={item.desc}
                  icon={item.icon}
                  className={item.className}
                  number={String(idx + 1).padStart(2, '0')}
                />
              ))}
            </BentoGrid>
          </div>
        </Section>

        {/* Designed for Everyone */}
        <Section fullHeight={true} variant="animated-grid" className="bg-background border-y border-border/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5">
              <span className="tech-label text-blue-500 mb-4 block">Target Audience</span>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-8 text-balance">
                Designed for <br /><span className="text-gradient">Everyone</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed text-balance">
                Whether you're a student building the next big thing, faculty guiding teams, or administration tracking success, CoIN adapts to your needs.
              </p>

              <div className="flex gap-4">
                <Link href="/student/login" className="px-8 py-4 bg-foreground text-background font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-foreground/5 active:scale-95">
                  Student Portal
                </Link>
                <Link href="/about" className="px-8 py-4 border border-border bg-background/50 backdrop-blur-sm text-foreground font-bold rounded-2xl hover:bg-secondary transition-all active:scale-95">
                  Learn More
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid md:grid-cols-2 gap-6">
              {[
                {
                  who: 'Students',
                  desc: 'Discover hackathons, form teams, and build your portfolio.',
                  features: ['Global Opportunities', 'Team Formation', 'Portfolio Building'],
                  gradient: 'bg-blue-500/10',
                  border: 'group-hover:border-blue-500/50'
                },
                {
                  who: 'Faculty',
                  desc: 'Mentor students and track department achievements.',
                  features: ['Mentorship Tools', 'Progress Tracking', 'Success Stories'],
                  gradient: 'bg-flame-500/10',
                  border: 'group-hover:border-flame-500/50'
                },
                {
                  who: 'Administration',
                  desc: 'Get a bird\'s eye view of institutional innovation.',
                  features: ['Data Analytics', 'Accreditation Reports', 'Impact Assessment'],
                  gradient: 'bg-purple-500/10',
                  border: 'group-hover:border-purple-500/50'
                },
              ].map((card, idx) => (
                <div key={idx} className={`group relative p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-neutral-900/40 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${card.border} ${idx === 2 ? 'md:col-span-2' : ''}`}>
                  <div className={`absolute inset-0 ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-slate-200 dark:border-white/10">
                      <Users className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    </div>

                    <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-2">
                      {card.who}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">{card.desc}</p>
                    <ul className="space-y-3">
                      {card.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-500 group-hover:bg-slate-900 dark:group-hover:bg-white transition-colors" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Visual Workflow Timeline */}
        <Section fullHeight={true} variant="gradient" className="bg-background">
          <div className="text-center mb-20">
            <span className="tech-label text-primary mb-4 block">Process Flow</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Streamlined Workflow
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From discovery to documentation, we've simplified the entire innovation lifecycle.
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Connecting Line */}
            <div className="absolute top-12 left-[10%] w-[80%] h-0.5 bg-border hidden md:block" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
              {[
                { num: '01', title: 'Publish', desc: 'Faculty list opportunities' },
                { num: '02', title: 'Discover', desc: 'Students find challenges' },
                { num: '03', title: 'Participate', desc: 'Teams build solutions' },
                { num: '04', title: 'Report', desc: 'Submit outcomes to CoIN' },
                { num: '05', title: 'Showcase', desc: 'Celebrate achievements' },
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group relative">
                  <div className="w-24 h-24 rounded-full bg-background border-4 border-secondary shadow-xl flex items-center justify-center mb-6 relative z-10 group-hover:border-primary group-hover:scale-110 transition-all duration-500">
                    <span className="font-display font-black text-3xl text-muted-foreground group-hover:text-primary transition-colors">{step.num}</span>
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-muted rotate-3 animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:translate-y-1 transition-transform">{step.title}</h3>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{step.desc}</p>

                  {/* Mobile connecting line */}
                  {idx < 4 && (
                    <div className="h-12 w-0.5 bg-border md:hidden my-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Action Hackathons */}
        {activeHackathons.length > 0 && (
          <Section fullHeight={true} variant="default" className="bg-white dark:bg-black border-t border-slate-200 dark:border-white/5">
            <div className="flex justify-between items-end mb-16">
              <div>
                <span className="tech-label text-green-500 mb-4 block animate-pulse">Live Now</span>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white">
                  Active Challenges
                </h2>
              </div>
              <Link
                href="/hackathons"
                className="hidden md:inline-flex items-center text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-flame-600 dark:hover:text-flame-400 transition-colors"
              >
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeHackathons.slice(0, 3).map((hackathon) => (
                <Link
                  key={hackathon.id}
                  href={`/hackathons/${hackathon.slug}`}
                  className="group relative bg-slate-50 dark:bg-neutral-900/50 rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden hover:border-flame-500/50 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-50">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10">
                      {hackathon.mode}
                    </span>
                  </div>

                  <div className="p-8 flex-1">
                    <div className="mb-6 pt-4">
                      <span className="text-xs font-bold text-flame-600 dark:text-flame-500 uppercase tracking-wider mb-2 block">
                        {hackathon.organizer}
                      </span>
                      <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-flame-500 transition-colors">
                        {hackathon.name}
                      </h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed mb-6">
                      {hackathon.description}
                    </p>
                  </div>

                  <div className="px-8 pb-8 pt-0 mt-auto">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-500 border-t border-slate-200 dark:border-white/5 pt-4">
                      <span>Ends {formatDate(hackathon.registrationDeadline)}</span>
                      <span className="group-hover:translate-x-1 transition-transform">View Details &rarr;</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Section>
        )}

        {/* Mission Statement */}
        <Section fullHeight={true} className="bg-slate-900 dark:bg-slate-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
          <div className="absolute inset-0 bg-slate-900/50" />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-display font-black mb-8 leading-tight tracking-tighter">
              Fueling the <br /><span className="text-blue-400">Future</span> of Innovation
            </h2>
            <p className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed mb-12">
              We believe in tracking impact and celebrating achievements that drive progress. CoIN is the backbone of SREC's collaborative spirit.
            </p>
            <Link href="/about" className="inline-flex items-center px-8 py-4 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-200 transition-colors">
              Our Mission
            </Link>
          </div>
        </Section>

        {/* Latest Updates */}
        {latestPosts.length > 0 && (
          <Section fullHeight={true} variant="minimal" className="bg-background">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-display font-bold text-foreground">
                Latest <span className="text-muted-foreground">Updates</span>
              </h2>
              <div className="h-px bg-border flex-1 mx-8" />
              <Link href="/blog" className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                Read Blog
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <div className="aspect-video bg-secondary rounded-2xl mb-6 overflow-hidden relative shadow-sm">
                    {/* Placeholder for image - using gradient for now */}
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm border ${post.category === 'Winner'
                        ? 'bg-blue-100/80 text-blue-900 border-blue-200'
                        : 'bg-primary/10 text-primary border-primary/20'
                        }`}>
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <span className="text-xs font-mono text-muted-foreground">{formatDate(post.createdAt)}</span>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {post.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Section>
        )}
      </main>
      <Footer />
    </>
  )
}
