'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import Link from 'next/link'
import { Shield, Lock, Mail, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, login } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isAuthenticated && mounted) {
      router.push('/admin/dashboard')
    }
  }, [isAuthenticated, router, mounted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    if (!password) {
      setError('Password is required')
      return
    }

    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        router.push('/admin/dashboard')
      } else {
        setError('Invalid credentials. Please verify your email and password.')
        setPassword('')
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
      setPassword('')
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden transition-colors duration-500">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-coin-500/10 rounded-full blur-[120px] dark:bg-coin-600/5" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] dark:bg-blue-600/5" />
      </div>

      <div className="absolute top-8 right-8 z-20">
        <ModeToggle />
      </div>

      <div className="w-full max-w-md z-10">
        {/* Header/Logo Section */}
        <div className="text-center mb-10 transition-all duration-700 animate-in fade-in slide-in-from-top-4">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-coin-600 to-coin-400 text-white font-bold text-2xl shadow-xl ring-4 ring-white dark:ring-slate-900 group-hover:scale-110 transition-transform">
              C
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
                CoIN
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-coin-600 uppercase">
                Admin Portal
              </span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-heading tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Secure access for SREC Faculty & Administrators
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-neutral-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden animate-in fade-in zoom-in-95 duration-500 delay-150">
          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-coin-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@srec.ac.in"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 flex justify-between">
                  Password
                  <span className="text-xs font-normal text-slate-400">Restricted</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-coin-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-left-2 transition-all">
                  <AlertCircle className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" size={18} />
                  <p className="text-red-700 dark:text-red-300 text-sm font-medium leading-tight">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-white/5 hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:active:scale-100"
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

          <div className="px-8 py-5 bg-slate-50 dark:bg-black/40 border-t border-slate-100 dark:border-slate-800 flex justify-center italic">
            <p className="text-[12px] text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <Shield size={12} />
              End-to-end encrypted session
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-10 flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-coin-600 dark:hover:text-white transition-colors text-sm font-medium pr-1"
          >
            <ArrowLeft size={16} />
            Back to Public Dashboard
          </Link>

          <div className="h-px w-12 bg-slate-200 dark:bg-slate-800" />

          <p className="text-xs text-slate-400 dark:text-slate-500 text-center leading-relaxed max-w-[280px]">
            Faculty authorized access only. Unauthorized attempts are logged and reported.
          </p>
        </div>
      </div>
    </div>
  )
}
