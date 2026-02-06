'use client'

import Link from 'next/link'
import { useAuthStore } from '@/lib/store/authStore'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, adminName, logout } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const { initializeAuth } = useAuthStore.getState()
    initializeAuth()
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated && !pathname.includes('/login')) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, pathname, mounted, router])

  if (!mounted) return null

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/hackathons', label: 'Hackathons', icon: '🎯' },
    { href: '/admin/participation', label: 'Participation', icon: '👥' },
    { href: '/admin/blog', label: 'Blog', icon: '📝' },
    { href: '/admin/reports', label: 'Reports', icon: '📋' },
    { href: '/admin/guidelines', label: 'Guidelines', icon: '📖' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:w-64 md:bg-gray-900 md:pt-6">
        <div className="px-6 mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-coin-400">CoIN</div>
            <div className="text-sm text-gray-400">Admin</div>
          </Link>
        </div>

        <nav className="space-y-1 px-3">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-coin-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 text-sm'
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="md:pl-64">
        {/* Topbar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">CoIN @ SREC</h2>

            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{adminName}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>

              <button
                onClick={() => {
                  logout()
                  router.push('/admin/login')
                }}
                className="btn-secondary text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden px-4 py-3 border-t border-gray-200 flex flex-wrap gap-2">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
