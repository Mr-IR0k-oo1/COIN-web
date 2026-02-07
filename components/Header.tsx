'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ModeToggle } from '@/components/mode-toggle'
import { useStudentStore } from '@/lib/store/studentStore'
import { useAuthStore } from '@/lib/store/authStore'

interface HeaderProps {
  hideNav?: boolean
}

export default function Header({ hideNav = false }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const { isAuthenticated: isStudent, initializeAuth: initStudent } = useStudentStore()
  const { isAuthenticated: isAdmin, initializeAuth: initAdmin } = useAuthStore()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    initStudent()
    initAdmin()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [initStudent, initAdmin])

  const navLinks = [
    { href: '/hackathons', label: 'Hackathons' },
    { href: '/student/dashboard', label: 'Find Teammates' },
    { href: '/submit', label: 'Submit Participation' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        scrolled
          ? 'bg-white/95 dark:bg-ash-950/95 border-ash-200 dark:border-ash-800 backdrop-blur-md py-2'
          : 'bg-white/80 dark:bg-ash-950/80 border-transparent backdrop-blur-sm py-4'
      )}
    >
      <div className="max-w-[90rem] mx-auto px-4 sm:px-12 lg:px-16">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-[0.9rem] bg-ash-950 dark:bg-white text-white dark:text-ash-950 font-black text-xl shadow-2xl transition-all group-hover:rotate-6 group-hover:scale-110">
                C.
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-ash-950 dark:text-white transition-colors font-display uppercase leading-none">
                  CoIN
                </span>
                <span className="hidden sm:block text-[8px] font-black tracking-[0.3em] text-ash-400 uppercase mt-1">
                  SREC Innovation
                </span>
              </div>
            </Link>
          </div>

          {!hideNav && (
            <>
              <nav className="hidden md:flex items-center gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-ash-500 dark:text-ash-400 hover:text-ash-950 dark:hover:text-white transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="w-px h-6 bg-ash-100 dark:bg-ash-800 mx-4" />
                {isStudent ? (
                  <Link
                    href="/student/dashboard"
                    className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-flame-600 dark:text-flame-400 border border-flame-600/20 rounded-xl hover:bg-flame-50 dark:hover:bg-flame-500/10 transition-all active:scale-95"
                  >
                    My Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/student/login"
                    className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-ash-950 dark:text-white border border-ash-200 dark:border-ash-800 rounded-xl hover:bg-ash-50 dark:hover:bg-ash-900 transition-all active:scale-95"
                  >
                    Student Portal
                  </Link>
                )}
                {isAdmin ? (
                  <Link
                    href="/admin/dashboard"
                    className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-flame-600 rounded-xl shadow-xl hover:scale-105 transition-all active:scale-95"
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <Link
                    href="/admin/login"
                    className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-ash-950 dark:bg-white dark:text-ash-950 rounded-xl shadow-xl hover:scale-105 transition-all active:scale-95"
                  >
                    Admin
                  </Link>
                )}
                <div className="ml-4">
                  <ModeToggle />
                </div>
              </nav>

              <button
                className="md:hidden p-2 text-ash-600 dark:text-ash-300 rounded-lg hover:bg-ash-100/60 dark:hover:bg-ash-800 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle navigation menu"
                aria-expanded={isOpen}
              >
                <div className="space-y-1.5">
                  <span
                    className={cn(
                      'block w-6 h-0.5 bg-current transition-transform duration-300',
                      isOpen ? 'rotate-45 translate-y-2' : ''
                    )}
                  />
                  <span
                    className={cn(
                      'block w-6 h-0.5 bg-current transition-opacity duration-300',
                      isOpen ? 'opacity-0' : ''
                    )}
                  />
                  <span
                    className={cn(
                      'block w-6 h-0.5 bg-current transition-transform duration-300',
                      isOpen ? '-rotate-45 -translate-y-2' : ''
                    )}
                  />
                </div>
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
            isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          )}
        >
          <div className="glass dark:bg-ash-900/80 dark:border-ash-700/70 rounded-2xl border border-ash-200/70 shadow-lg p-2">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-ash-600 dark:text-ash-300 hover:text-flame-600 dark:hover:text-white hover:bg-ash-50/70 dark:hover:bg-ash-800 rounded-xl font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {isStudent ? (
                <Link
                  href="/student/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-flame-600 dark:text-flame-400 font-black text-[10px] uppercase tracking-[0.2em] bg-flame-50 dark:bg-flame-500/10 hover:bg-flame-100 dark:hover:bg-flame-500/20 rounded-xl transition-colors"
                >
                  My Dashboard
                </Link>
              ) : (
                <Link
                  href="/student/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-ash-900 dark:text-ash-100 font-black text-[10px] uppercase tracking-[0.2em] bg-ash-50 dark:bg-ash-800/40 hover:bg-ash-100 dark:hover:bg-ash-800 rounded-xl transition-colors"
                >
                  Student Portal
                </Link>
              )}
              {isAdmin ? (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-white font-black text-[10px] uppercase tracking-[0.2em] bg-flame-600 hover:bg-flame-700 rounded-xl transition-colors"
                >
                  Admin Panel
                </Link>
              ) : (
                <Link
                  href="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-ash-900 dark:text-ash-100 font-black text-[10px] uppercase tracking-[0.2em] bg-ash-100 dark:bg-white dark:text-ash-950 hover:bg-ash-200 dark:hover:bg-ash-50 rounded-xl transition-colors"
                >
                  Admin Login
                </Link>
              )}
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-ash-600 dark:text-ash-400 font-medium">Theme</span>
                <ModeToggle />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
