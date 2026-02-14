'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Section from '@/components/ui/Section'
import Link from 'next/link'
import { Shield, Lock, Server, Eye, FileKey, CheckCircle } from 'lucide-react'

export default function SecurityPage() {
    return (
        <>
            <Header />
            <main className="flex-1">
                <Section fullHeight={true} className="py-24 bg-white dark:bg-black border-b border-slate-200 dark:border-white/10">
                    <div className="max-w-4xl mx-auto text-center">
                        <span className="text-green-500 font-bold tracking-widest uppercase text-sm mb-4 block">Infrastructure</span>
                        <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 dark:text-white mb-6">
                            Security Policy
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            We employ industry-standard security measures to ensure your data and participation records remain safe and integrity-preserved.
                        </p>
                    </div>
                </Section>

                <Section fullHeight={true} className="py-20 bg-slate-50 dark:bg-black">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                            {[
                                {
                                    icon: <Lock className="w-8 h-8" />,
                                    title: 'Encryption at Rest',
                                    desc: 'All sensitive data, including student records and authentication credentials, are encrypted in our database using AES-256 standards.',
                                    color: 'text-blue-500'
                                },
                                {
                                    icon: <Shield className="w-8 h-8" />,
                                    title: 'Secure Transmission',
                                    desc: 'All data transmitted between your device and our servers is protected using TLS 1.3 encryption protocols.',
                                    color: 'text-green-500'
                                },
                                {
                                    icon: <Server className="w-8 h-8" />,
                                    title: 'Infrastructure Security',
                                    desc: 'Our platform is hosted on secure, compliant cloud infrastructure with regular vulnerability assessments and automated patching.',
                                    color: 'text-purple-500'
                                },
                                {
                                    icon: <Eye className="w-8 h-8" />,
                                    title: 'Access Control',
                                    desc: 'Strict role-based access control (RBAC) ensures that only authorized personnel can access sensitive student or institutional data.',
                                    color: 'text-flame-500'
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white dark:bg-neutral-900/50 p-8 rounded-3xl border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-colors shadow-lg">
                                    <div className={`w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-6 ${item.color}`}>
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-slate-900 dark:bg-neutral-900 rounded-3xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[100px] rounded-full" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />

                            <div className="relative z-10 p-10 md:p-16">
                                <div className="flex flex-col md:flex-row gap-12 items-center">
                                    <div className="flex-1">
                                        <h2 className="text-3xl font-display font-bold text-white mb-6">
                                            Vulnerability Reporting
                                        </h2>
                                        <p className="text-slate-400 mb-8 leading-relaxed">
                                            If you believe you have found a security vulnerability in CoIN, we encourage you to let us know right away. We will investigate all legitimate reports and do our best to quickly fix the problem.
                                        </p>
                                        <div className="flex gap-4">
                                            <Link href="mailto:security@srec.ac.in" className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                                Report Issue
                                            </Link>
                                            <Link href="/contact" className="px-6 py-3 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
                                                Contact Support
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="flex-1 w-full bg-slate-800/50 rounded-2xl p-6 border border-white/10">
                                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <FileKey className="w-4 h-4" /> Response Timeline
                                        </h3>
                                        <ul className="space-y-4">
                                            {[
                                                'Acknowledgement of report within 24 hours',
                                                'Triage and verification within 48 hours',
                                                'Target resolution for critical issues: 5 days',
                                                'Public disclosure after fix verification'
                                            ].map((step, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                    {step}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>
            </main>
            <Footer />
        </>
    )
}
