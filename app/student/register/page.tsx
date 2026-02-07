'use client'

import { useState } from 'react'
import { useStudentStore } from '@/lib/store/studentStore'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Mail, Lock, User, GraduationCap, BookOpen, Loader2 } from 'lucide-react'

export default function StudentRegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        year: 1,
        branch: '',
    })
    const [localError, setLocalError] = useState('')
    const register = useStudentStore((state) => state.register)
    const loading = useStudentStore((state) => state.loading)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLocalError('')

        if (!formData.email.endsWith('@srec.ac.in')) {
            setLocalError('Please use your official @srec.ac.in email address.')
            return
        }

        const success = await register(formData)
        if (success) {
            router.push('/student/profile')
        } else {
            setLocalError('Registration failed. Please try again.')
        }
    }

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 bg-white dark:bg-ash-950">
            <div className="max-w-2xl w-full relative">
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-flame-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-ember-600/10 rounded-full blur-3xl" />

                <div className="relative group premium-card p-10">
                    <div className="premium-card-inner" />

                    <div className="relative z-10">
                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-display font-black tracking-tighter text-ash-900 dark:text-white uppercase mb-4">
                                Join <span className="text-gradient">CoIN</span>
                            </h1>
                            <p className="text-ash-500 dark:text-ash-400 max-w-md mx-auto">
                                Create your student profile and connect with the innovation ecosystem at SREC
                            </p>
                        </div>

                        {localError && (
                            <div className="mb-6 p-4 rounded-2xl bg-ember-500/10 border border-ember-500/20 text-ember-500 text-sm font-medium">
                                {localError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-ash-500 dark:text-ash-400 ml-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ash-400" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="John Doe"
                                        className="w-full pl-12 pr-4 py-4 bg-ash-50 dark:bg-ash-900 border border-ash-200 dark:border-ash-700 rounded-2xl text-ash-900 dark:text-white placeholder:text-ash-400 focus:outline-none focus:ring-2 focus:ring-flame-500/50 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-ash-500 dark:text-ash-400 ml-1">
                                    College Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ash-400" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-4 bg-ash-50 dark:bg-ash-900 border border-ash-200 dark:border-ash-700 rounded-2xl text-ash-900 dark:text-white placeholder:text-ash-400 focus:outline-none focus:ring-2 focus:ring-flame-500/50 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-ash-500 dark:text-ash-400 ml-1">
                                    Academic Year
                                </label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ash-400" />
                                    <select
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                                        className="w-full pl-12 pr-4 py-4 bg-ash-50 dark:bg-ash-900 border border-ash-200 dark:border-ash-700 rounded-2xl text-ash-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-flame-500/50 transition-all appearance-none"
                                    >
                                        <option value={1}>1st Year</option>
                                        <option value={2}>2nd Year</option>
                                        <option value={3}>3rd Year</option>
                                        <option value={4}>4th Year</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-ash-500 dark:text-ash-400 ml-1">
                                    Department / Branch
                                </label>
                                <div className="relative">
                                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ash-400" />
                                    <input
                                        type="text"
                                        value={formData.branch}
                                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                        placeholder="e.g. Computer Science"
                                        className="w-full pl-12 pr-4 py-4 bg-ash-50 dark:bg-ash-900 border border-ash-200 dark:border-ash-700 rounded-2xl text-ash-900 dark:text-white placeholder:text-ash-400 focus:outline-none focus:ring-2 focus:ring-flame-500/50 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full col-span-1 md:col-span-2 group flex items-center justify-center px-8 py-5 bg-ash-900 dark:bg-white text-white dark:text-black hover:bg-flame-600 dark:hover:bg-flame-500 hover:text-white transition-all font-bold rounded-2xl shadow-xl hover:shadow-flame-500/30 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Create My Student Account
                                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center border-t border-ash-100 dark:border-ash-800 pt-8">
                            <p className="text-ash-500 dark:text-ash-400 text-sm">
                                Already have an account?{' '}
                                <Link
                                    href="/student/login"
                                    className="text-flame-600 dark:text-flame-400 font-bold hover:underline"
                                >
                                    Sign In Instead
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
