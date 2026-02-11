'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Section from '@/components/ui/Section'
import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react'

export default function ContactPage() {
    return (
        <>
            <Header />
            <main className="flex-1">
                <Section className="py-24 bg-white dark:bg-black border-b border-slate-200 dark:border-white/10">
                    <div className="max-w-4xl mx-auto text-center">
                        <span className="text-blue-500 font-bold tracking-widest uppercase text-sm mb-4 block">Get touch</span>
                        <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 dark:text-white mb-6">
                            Contact Us
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Have questions about CoIN? We're here to help you navigate your innovation journey.
                        </p>
                    </div>
                </Section>

                <Section className="py-20 bg-slate-50 dark:bg-black">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

                        {/* Contact Info */}
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-8">
                                    Reach Out
                                </h2>
                                <div className="space-y-8">
                                    {[
                                        {
                                            icon: <Mail className="w-6 h-6" />,
                                            title: 'Email',
                                            details: 'coin-support@srec.ac.in',
                                            desc: 'For general inquiries and support'
                                        },
                                        {
                                            icon: <Phone className="w-6 h-6" />,
                                            title: 'Phone',
                                            details: '+91 422 246 0088',
                                            desc: 'Mon-Fri from 9am to 4pm'
                                        },
                                        {
                                            icon: <MapPin className="w-6 h-6" />,
                                            title: 'Office',
                                            details: 'Innovation Center, SREC Campus',
                                            desc: 'Vattamalaipalayam, N.G.G.O. Colony Post, Coimbatore - 641022'
                                        }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex gap-6 items-start group">
                                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 group-hover:text-flame-500 group-hover:border-flame-500/30 transition-colors shadow-sm">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                                                <p className="text-flame-600 dark:text-flame-500 font-medium mb-1">{item.details}</p>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-slate-900 dark:bg-neutral-900 p-8 rounded-3xl text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-flame-500/20 blur-[50px] rounded-full" />
                                <h3 className="text-xl font-bold mb-4 relative z-10">FAQ</h3>
                                <p className="text-slate-300 mb-6 relative z-10">
                                    Check our Frequently Asked Questions for quick answers to common queries about hackathons and participation.
                                </p>
                                <button className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-colors font-bold text-sm uppercase tracking-wide">
                                    View FAQ
                                </button>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="bg-white dark:bg-neutral-900/30 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                <MessageSquare className="w-6 h-6 text-flame-500" />
                                Send a Message
                            </h3>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">First Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-flame-500 transition-colors"
                                            placeholder="Jane"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Last Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-flame-500 transition-colors"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-flame-500 transition-colors"
                                        placeholder="jane@srec.ac.in"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Message</label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-flame-500 transition-colors resize-none"
                                        placeholder="How can we help you?"
                                    />
                                </div>

                                <button
                                    type="button"
                                    className="w-full py-4 bg-flame-600 hover:bg-flame-700 text-white font-bold rounded-xl shadow-lg shadow-flame-500/20 active:scale-[0.98] transition-all"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>

                    </div>
                </Section>
            </main>
            <Footer />
        </>
    )
}
