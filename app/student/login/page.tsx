'use client'

import { useState } from 'react'
import { useStudentStore } from '@/lib/store/studentStore'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Mail, Lock, Loader2 } from 'lucide-react'

export default function StudentLoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [localError, setLocalError] = useState('')
    const login = useStudentStore((state) => state.login)
    const loading = useStudentStore((state) => state.loading)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLocalError('')

        if (!email.endsWith('@srec.ac.in')) {
            setLocalError('Only @srec.ac.in email addresses are allowed.')
            return
        }

        const success = await login(email, password)
        if (success) {
            router.push('/student/dashboard')
        } else {
            setLocalError('Invalid credentials. Please try again.')
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-white dark:bg-ash-950">
            <div className="max-w-md w-full relative">
                {/* Decorative elements */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-flame-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-ember-600/10 rounded-full blur-3xl" />

                <div className="relative group card-premium p-10">
                    <div className="premium-card-inner" />

                    <div className="relative z-10">
                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-display font-black tracking-tighter text-ash-900 dark:text-white uppercase mb-4">
                                Student <span className="text-gradient">Portal</span>
                            </h1>
                            <p className="text-ash-500 dark:text-ash-400">
                                Sign in to discover teammates and track your innovation journey
                            </p>
                        </div>

                        {localError && (
                            <div className="mb-6 p-4 rounded-2xl bg-ember-500/10 border border-ember-500/20 text-ember-500 text-sm font-medium animate-shake">
                                {localError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-ash-500 dark:text-ash-400 ml-1">
                                    College Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ash-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="yourname@srec.ac.in"
                                        className="w-full pl-12 pr-4 py-4 bg-ash-50 dark:bg-ash-900 border border-ash-200 dark:border-ash-700 rounded-2xl text-ash-900 dark:text-white placeholder:text-ash-400 focus:outline-none focus:ring-2 focus:ring-flame-500/50 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-ash-500 dark:text-ash-400 ml-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ash-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-4 bg-ash-50 dark:bg-ash-900 border border-ash-200 dark:border-ash-700 rounded-2xl text-ash-900 dark:text-white placeholder:text-ash-400 focus:outline-none focus:ring-2 focus:ring-flame-500/50 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full group flex items-center justify-center px-8 py-5 bg-ash-900 dark:bg-white text-white dark:text-black hover:bg-flame-600 dark:hover:bg-flame-500 hover:text-white transition-all font-bold rounded-2xl shadow-xl hover:shadow-flame-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Sign Into Portal
                                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center border-t border-ash-100 dark:border-ash-800 pt-8">
                            <p className="text-ash-500 dark:text-ash-400 text-sm">
                                Don't have an account yet?{' '}
                                <Link
                                    href="/student/register"
                                    className="text-flame-600 dark:text-flame-400 font-bold hover:underline"
                                >
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
