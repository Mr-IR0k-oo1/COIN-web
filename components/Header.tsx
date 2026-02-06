'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface HeaderProps {
  hideNav?: boolean
}

export default function Header({ hideNav = false }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/hackathons', label: 'Hackathons' },
    { href: '/submit', label: 'Submit Participation' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent',
        scrolled ? 'glass border-white/20 py-2' : 'bg-transparent py-4'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-coin-600 to-coin-400 text-white font-bold text-xl shadow-lg ring-2 ring-white/50 transition-transform group-hover:scale-105">
                C
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-coin-600 transition-colors font-heading">
                  CoIN
                </span>
                <span className="hidden sm:block text-[10px] font-medium tracking-wider text-slate-500 uppercase">
                  Collaborative Innovation
                </span>
              </div>
            </Link>
          </div>

          {!hideNav && (
            <>
              <nav className="hidden md:flex gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-coin-600 hover:bg-slate-50/50 rounded-full transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/admin/login"
                  className="ml-2 px-5 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  Admin
                </Link>
              </nav>

              <button
                className="md:hidden p-2 text-slate-600"
                onClick={() => setIsOpen(!isOpen)}
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
          <nav className="flex flex-col gap-2 pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-slate-600 hover:text-coin-600 hover:bg-slate-50 rounded-xl font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-coin-600 font-semibold hover:bg-coin-50 rounded-xl transition-colors"
            >
              Admin Login
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
