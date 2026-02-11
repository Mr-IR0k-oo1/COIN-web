import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import { FileQuestion, AlertTriangle } from 'lucide-react'

export default function NotFound() {
    return (
        <>
            <Header />
            <main className="flex-1 min-h-screen flex flex-col justify-center">
                <Section className="py-24 bg-white dark:bg-black">
                    <div className="max-w-4xl mx-auto text-center relative">

                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                            <span className="text-[20rem] font-bold">404</span>
                        </div>

                        <div className="relative z-10">
                            <div className="w-24 h-24 mx-auto bg-flame-50 dark:bg-flame-500/10 rounded-full flex items-center justify-center mb-8 border border-flame-100 dark:border-flame-500/20">
                                <FileQuestion className="w-12 h-12 text-flame-500" />
                            </div>

                            <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 dark:text-white mb-6">
                                Page Not Found
                            </h1>

                            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/" className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg">
                                    Return Home
                                </Link>
                                <Link href="/hackathons" className="px-8 py-4 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    Browse Hackathons
                                </Link>
                            </div>

                            <div className="mt-16 pt-16 border-t border-slate-100 dark:border-white/5 max-w-lg mx-auto">
                                <p className="text-sm text-slate-500 mb-4 font-medium uppercase tracking-widest">Helpful Links</p>
                                <div className="flex justify-center gap-6 text-sm font-medium text-flame-600 dark:text-flame-500">
                                    <Link href="/help" className="hover:underline">Help Center</Link>
                                    <Link href="/contact" className="hover:underline">Contact Support</Link>
                                    <Link href="/sitemap" className="hover:underline">Sitemap</Link>
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
