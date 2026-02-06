'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, login, initializeAuth } = useAuthStore()
  const [password, setPassword] = useState('')
  const [adminName, setAdminName] = useState('')
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    initializeAuth()
  }, [initializeAuth])

  useEffect(() => {
    if (isAuthenticated && mounted) {
      router.push('/admin/dashboard')
    }
  }, [isAuthenticated, router, mounted])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!adminName.trim()) {
      setError('Please enter your name')
      return
    }

    if (!password) {
      setError('Please enter password')
      return
    }

    if (login(password, adminName)) {
      router.push('/admin/dashboard')
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-coin-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="text-4xl font-bold text-coin-600">CoIN</div>
            <div className="text-gray-600 text-sm">Admin Portal</div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-600 mt-2">
            Sri Ramakrishna Engineering College
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="Enter your full name"
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="input-field"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full">
            Login
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm mb-4">
            Back to <Link href="/" className="text-coin-600 hover:underline">CoIN</Link>
          </p>
          <p className="text-xs text-gray-500">
            Admin access is restricted to authorized faculty members
          </p>
        </div>
      </div>
    </div>
  )
}
