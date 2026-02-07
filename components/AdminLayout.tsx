'use client'

import Link from 'next/link'
import { useAuthStore } from '@/lib/store/authStore'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Target,
  Users,
  FileText,
  BarChart3,
  BookOpen,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ModeToggle } from '@/components/mode-toggle'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, adminName, logout } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/hackathons', label: 'Hackathons', icon: Target },
    { href: '/admin/participation', label: 'Participation', icon: Users },
    { href: '/admin/blog', label: 'Blog', icon: FileText },
    { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { href: '/admin/guidelines', label: 'Guidelines', icon: BookOpen },
  ]

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-ash-50 dark:bg-ash-950 transition-colors duration-300">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-white dark:bg-ash-950 border-r border-ash-200 dark:border-ash-800 z-50 transition-transform duration-300 md:translate-x-0 shadow-lg md:shadow-none",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-8 pb-10">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ash-900 dark:bg-ash-100 text-white dark:text-ash-950 font-bold text-xl shadow-sm transition-transform group-hover:scale-105">
                C
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-ash-900 dark:text-white font-heading">
                  CoIN
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-ash-500 dark:text-ash-400 uppercase">
                  Admin System
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
            {adminLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all group",
                    isActive
                      ? "bg-ash-900 dark:bg-ash-100 text-white dark:text-ash-950 shadow-sm"
                      : "text-ash-500 dark:text-ash-400 hover:text-ash-900 dark:hover:text-white hover:bg-ash-100 dark:hover:bg-ash-800"
                  )}
                >
                  <link.icon size={20} className={cn(
                    "transition-transform",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )} />
                  <span className="flex-1 text-sm tracking-wide">{link.label}</span>
                  {isActive && <ChevronRight size={14} className="opacity-60" />}
                </Link>
              )
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 mt-auto">
            <div className="bg-ash-50 dark:bg-ash-900 rounded-2xl p-4 border border-ash-200 dark:border-ash-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-ash-900 dark:bg-ash-100 flex items-center justify-center text-white dark:text-ash-950 font-bold">
                  {adminName?.charAt(0) || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ash-900 dark:text-white truncate">{adminName}</p>
                  <p className="text-[10px] text-ash-400 dark:text-ash-500 font-medium uppercase tracking-wider">Faculty</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-ash-600 dark:text-ash-400 hover:text-ash-900 dark:hover:text-white hover:bg-ash-100 dark:hover:bg-ash-800 rounded-xl transition-all"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="md:pl-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-ash-950/90 backdrop-blur-md border-b border-ash-200 dark:border-ash-800 transition-colors duration-300">
          <div className="h-20 px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="md:hidden p-2 text-ash-600 dark:text-ash-300 hover:bg-ash-100 dark:hover:bg-ash-800 rounded-xl transition-colors"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
              <div className="flex items-center gap-2 text-ash-500 dark:text-ash-500 text-sm font-medium">
                <ShieldCheck size={16} />
                <span>Authorized Session</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ModeToggle />
              <div className="h-8 w-px bg-ash-200 dark:bg-ash-800 mx-2 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-bold text-ash-900 dark:text-white leading-tight">{adminName}</p>
                  <p className="text-[10px] text-ash-400 font-medium tracking-[0.05em] uppercase">Control Panel</p>
                </div>
                <div className="h-9 w-9 rounded-xl bg-ash-900 dark:bg-ash-100 flex items-center justify-center text-white dark:text-ash-950 shadow-sm">
                  <LayoutDashboard size={18} />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 animate-in fade-in duration-700">
          <div className="max-w-[95rem] mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
