'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Section from '@/components/ui/Section'
import Link from 'next/link'
import { Search, Book, User, GraduationCap, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react'

export default function HelpPage() {
    return (
        <>
            <Header />
            <main className="flex-1">
                <Section fullHeight={true} className="py-24 bg-slate-900 dark:bg-black relative overflow-hidden">
                    <div className="absolute inset-0 bg-flame-500/10 opacity-30 blur-[100px]" />

                    <div className="max-w-4xl mx-auto text-center relative z-10 text-white">
                        <span className="text-flame-400 font-bold tracking-widest uppercase text-sm mb-4 block">Support Center</span>
                        <h1 className="text-4xl md:text-6xl font-display font-black mb-8">
                            How can we help you?
                        </h1>

                        <div className="relative max-w-xl mx-auto">
                            <input
                                type="text"
                                placeholder="Search for articles, guides, and more..."
                                className="w-full px-6 py-4 pl-14 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:bg-white/20 focus:border-flame-500 transition-all backdrop-blur-sm"
                            />
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                        </div>
                    </div>
                </Section>

                <Section fullHeight={true} className="py-20 bg-slate-50 dark:bg-black">
                    <div className="max-w-6xl mx-auto">
                        {/* Categories */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                            {[
                                {
                                    icon: <GraduationCap className="w-8 h-8" />,
                                    title: 'Student Guide',
                                    desc: 'Everything you need to know about participating in hackathons and building your profile.',
                                    items: ['Finding Hackathons', 'Team Formation', 'Submitting Projects']
                                },
                                {
                                    icon: <User className="w-8 h-8" />,
                                    title: 'Account Settings',
                                    desc: 'Manage your profile, password, and notification preferences.',
                                    items: ['Reset Password', 'Profile Privacy', 'Email Settings']
                                },
                                {
                                    icon: <ShieldCheck className="w-8 h-8" />,
                                    title: 'Rules & Policy',
                                    desc: 'Understanding our community guidelines, terms of service, and privacy policies.',
                                    items: ['Code of Conduct', 'Intellectual Property', 'Dispute Resolution']
                                }
                            ].map((category, idx) => (
                                <div key={idx} className="bg-white dark:bg-neutral-900/50 p-8 rounded-3xl border border-slate-200 dark:border-white/5 hover:border-flame-500/30 transition-all shadow-lg group">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-6 text-flame-500 group-hover:scale-110 transition-transform">
                                        {category.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{category.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">{category.desc}</p>
                                    <ul className="space-y-3">
                                        {category.items.map((item, i) => (
                                            <li key={i} className="flex items-center text-sm font-medium text-slate-500 hover:text-flame-500 cursor-pointer transition-colors">
                                                <ArrowRight className="w-4 h-4 mr-2" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* FAQs */}
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-10 text-center">
                                Frequently Asked Questions
                            </h2>

                            <div className="space-y-4">
                                {[
                                    {
                                        q: 'How do I register for a hackathon?',
                                        a: 'Navigate to the Hackathons page, select an event, and click the "Register" button. You may be redirected to an external site if the hackathon is hosted on another platform.'
                                    },
                                    {
                                        q: 'Can I form a team with students from other departments?',
                                        a: 'Yes! We encourage interdisciplinary collaboration. You can invite any registered student to join your team via the dashboard.'
                                    },
                                    {
                                        q: 'How are winners selected?',
                                        a: 'Winners are selected based on the criteria specified for each hackathon, usually involving innovation, technical complexity, and presentation quality. Judges are typically industry experts and faculty.'
                                    }
                                ].map((faq, idx) => (
                                    <div key={idx} className="bg-white dark:bg-neutral-900/30 p-6 rounded-2xl border border-slate-200 dark:border-white/5">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-start gap-3">
                                            <HelpCircle className="w-6 h-6 text-flame-500 flex-shrink-0 mt-0.5" />
                                            {faq.q}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm pl-9 leading-relaxed">
                                            {faq.a}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 text-center">
                                <p className="text-slate-600 dark:text-slate-400 mb-4">Can't find what you're looking for?</p>
                                <Link href="/contact" className="inline-flex items-center px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition-opacity">
                                    Contact Support
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
