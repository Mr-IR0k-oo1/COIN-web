'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import Link from 'next/link'
import { Shield, Lock, Mail, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, login, initializeAuth } = useAuthStore()
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
    initializeAuth()
  }, [initializeAuth])

  useEffect(() => {
    if (isAuthenticated && mounted) {
      router.push('/admin/dashboard')
    }
  }, [isAuthenticated, router, mounted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Please enter your administrator email')
      return
    }

    if (!email.endsWith('@srec.ac.in')) {
      setError('Authorized access is restricted to @srec.ac.in emails.')
      return
    }

    if (!password) {
      setError('Password is required')
      return
    }

    setIsLoading(true)

    // Artificial delay for premium feel & security
    await new Promise(resolve => setTimeout(resolve, 800))

    const success = await login(email, password)
    if (success) {
      router.push('/admin/dashboard')
    } else {
      setError('Invalid credentials. Please verify your email and password.')
      setPassword('')
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-ash-50 dark:bg-ash-950 flex flex-col items-center justify-center px-4 relative overflow-hidden transition-colors duration-500">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-flame-500/10 rounded-full blur-[120px] dark:bg-flame-500/10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-ember-500/10 rounded-full blur-[120px] dark:bg-ember-500/10" />
      </div>

      <div className="absolute top-8 right-8 z-20">
        <ModeToggle />
      </div>

      <div className="w-full max-w-md z-10">
        {/* Header/Logo Section */}
        <div className="text-center mb-10 transition-all duration-700 animate-in fade-in slide-in-from-top-4">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-flame-600 to-flame-400 text-white font-bold text-2xl shadow-xl ring-4 ring-white dark:ring-ash-800 group-hover:scale-110 transition-transform">
              C
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-bold tracking-tight text-ash-900 dark:text-white font-heading">
                CoIN
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-flame-600 uppercase">
                Admin Portal
              </span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-ash-900 dark:text-white font-heading tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-ash-500 dark:text-ash-400">
            Secure access for SREC Faculty & Administrators
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-ash-900/80 backdrop-blur-xl rounded-3xl border border-ash-200 dark:border-ash-700 shadow-2xl shadow-ash-200/50 dark:shadow-black/40 overflow-hidden animate-in fade-in zoom-in-95 duration-500 delay-150">
          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-ash-700 dark:text-ash-300 ml-1">
                  Administrator Email
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ash-400 group-focus-within:text-flame-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@srec.ac.in"
                    className="w-full pl-11 pr-4 py-3.5 bg-ash-50 dark:bg-ash-900 border border-ash-200 dark:border-ash-700 rounded-2xl text-ash-900 dark:text-ash-100 focus:outline-none focus:ring-2 focus:ring-flame-500/20 focus:border-flame-500 transition-all placeholder:text-ash-400 dark:placeholder:text-ash-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-ash-700 dark:text-ash-300 ml-1 flex justify-between">
                  Access Password
                  <span className="text-xs font-normal text-ash-400">Restricted</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ash-400 group-focus-within:text-flame-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 bg-ash-50 dark:bg-ash-900 border border-ash-200 dark:border-ash-700 rounded-2xl text-ash-900 dark:text-ash-100 focus:outline-none focus:ring-2 focus:ring-flame-500/20 focus:border-flame-500 transition-all placeholder:text-ash-400 dark:placeholder:text-ash-500"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-ember-50 dark:bg-ember-900/20 border border-ember-100 dark:border-ember-900/30 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-left-2 transition-all">
                  <AlertCircle className="text-ember-600 dark:text-ember-400 shrink-0 mt-0.5" size={18} />
                  <p className="text-ember-700 dark:text-ember-300 text-sm font-medium leading-tight">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-ash-900 dark:bg-ash-100 text-white dark:text-ash-950 font-bold rounded-2xl shadow-xl shadow-ash-900/10 dark:shadow-ash-950/40 hover:bg-ash-800 dark:hover:bg-ash-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:active:scale-100"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    Sign In to Dashboard
                    <Shield size={18} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="px-8 py-5 bg-ash-50 dark:bg-ash-900/60 border-t border-ash-100 dark:border-ash-800 flex justify-center italic">
            <p className="text-[12px] text-ash-400 dark:text-ash-500 flex items-center gap-2">
              <Shield size={12} />
              End-to-end encrypted session
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-10 flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Link
            href="/"
            className="flex items-center gap-2 text-ash-500 dark:text-ash-400 hover:text-flame-600 dark:hover:text-white transition-colors text-sm font-medium pr-1"
          >
            <ArrowLeft size={16} />
            Back to Public Dashboard
          </Link>

          <div className="h-px w-12 bg-ash-200 dark:bg-ash-800" />

          <p className="text-xs text-ash-400 dark:text-ash-500 text-center leading-relaxed max-w-[280px]">
            Faculty authorized access only. Unauthorized attempts are logged and reported.
          </p>
        </div>
      </div>
    </div>
  )
}
