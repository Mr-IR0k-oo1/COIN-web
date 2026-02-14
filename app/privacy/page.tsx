'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Section from '@/components/ui/Section'
import Link from 'next/link'

export default function PrivacyPage() {
    return (
        <>
            <Header />
            <main className="flex-1">
                <Section fullHeight={true} className="py-24 bg-white dark:bg-black border-b border-slate-200 dark:border-white/10">
                    <div className="max-w-4xl mx-auto text-center">
                        <span className="text-flame-500 font-bold tracking-widest uppercase text-sm mb-4 block">Legal</span>
                        <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 dark:text-white mb-6">
                            Privacy Policy
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            We are committed to protecting your personal information and your right to privacy.
                        </p>
                    </div>
                </Section>

                <Section fullHeight={true} className="py-20 bg-slate-50 dark:bg-black">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div className="bg-white dark:bg-neutral-900/50 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl">
                            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6">
                                1. Information We Collect
                            </h2>
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <p className="text-slate-600 dark:text-slate-400 mb-4">
                                    We collect personal information that you voluntarily provide to us when you register on the CoIN platform, express an interest in obtaining information about us or our products and services, when you participate in activities on the platform, or otherwise when you contact us.
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 marker:text-flame-500">
                                    <li><strong>Personal Information:</strong> Name, email address, student ID, department, and year of study.</li>
                                    <li><strong>Credentials:</strong> Passwords and security information used for authentication and account access.</li>
                                    <li><strong>Activity Data:</strong> Information about your hackathon participation, team formations, and project submissions.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900/50 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl">
                            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6">
                                2. How We Use Your Information
                            </h2>
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <p className="text-slate-600 dark:text-slate-400 mb-4">
                                    We use personal information collected via our platform for a variety of business purposes described below:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 marker:text-flame-500">
                                    <li>To facilitate account creation and logon process.</li>
                                    <li>To send administrative information to you.</li>
                                    <li>To fulfill your hackathon participation and mentorship requests.</li>
                                    <li>To generate institutional reports on innovation activities.</li>
                                    <li>To protect our Services and legal rights.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900/50 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl">
                            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6">
                                3. Information Sharing
                            </h2>
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <p className="text-slate-600 dark:text-slate-400 mb-4">
                                    We may process or share your data that we hold based on the following legal basis:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 marker:text-flame-500">
                                    <li><strong>Consent:</strong> We may process your data if you have given us specific consent to use your personal information for a specific purpose.</li>
                                    <li><strong>Legitimate Interests:</strong> We may process your data when it is reasonably necessary to achieve our legitimate business interests.</li>
                                    <li><strong>Legal Obligations:</strong> We may disclose your information where we are legally required to do so.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900/50 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl">
                            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6">
                                4. Data Security
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-neutral-900/50 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl">
                            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6">
                                5. Contact Us
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                If you have questions or comments about this policy, you may email us at support@srec.ac.in or by post to:
                            </p>
                            <address className="not-italic text-slate-600 dark:text-slate-400">
                                Sri Ramakrishna Engineering College<br />
                                Coimbatore, Tamil Nadu<br />
                                India
                            </address>
                        </div>
                    </div>
                </Section>
            </main>
            <Footer />
        </>
    )
}
