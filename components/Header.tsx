'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ModeToggle } from '@/components/mode-toggle'
import { useStudentStore } from '@/lib/store/studentStore'
import { useAuthStore } from '@/lib/store/authStore'
import { Menu, X, ChevronRight } from 'lucide-react'

interface HeaderProps {
  hideNav?: boolean
}

export default function Header({ hideNav = false }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const { isAuthenticated: isStudent, initializeAuth: initStudent } = useStudentStore()
  const { isAuthenticated: isAdmin, initializeAuth: initAdmin } = useAuthStore()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    initStudent()
    initAdmin()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [initStudent, initAdmin])

  const navLinks = [
    { href: '/hackathons', label: 'Hackathons' },
    { href: '/student/dashboard', label: 'Feeds' },
    { href: '/submit', label: 'Submit' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]',
        scrolled ? 'py-4' : 'py-8'
      )}
    >
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-flame-400 via-flame-500 to-ember-600 origin-left z-[60]"
        style={{ scaleX }}
      />
      <div className="max-w-[90rem] mx-auto px-6 sm:px-12 lg:px-16">
        <div className="relative flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.1)] transition-all"
              >
                C.
              </motion.div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-black dark:text-white transition-colors font-display uppercase leading-tight">
                  CoIN
                </span>
                <span className="hidden sm:block text-[9px] font-black tracking-[0.4em] text-ash-400 dark:text-ash-500 uppercase mt-0.5">
                  SREC Innovation
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Absolute Centered */}
          {!hideNav && (
            <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center p-1.5 rounded-2xl bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/20 dark:border-white/5 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
              <div className="flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "relative px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-300 rounded-xl",
                        isActive 
                          ? "text-black dark:text-white" 
                          : "text-ash-500 dark:text-ash-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute inset-0 bg-white dark:bg-neutral-800 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(255,255,255,0.05)] z-[-1]"
                          transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                        />
                      )}
                      {link.label}
                    </Link>
                  )
                })}
              </div>
            </nav>
          )}

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3">
            {!hideNav && (
              <div className="hidden md:flex items-center gap-3">
                {isStudent ? (
                  <Link
                    href="/student/dashboard"
                    className="group relative px-6 py-3 overflow-hidden rounded-2xl bg-flame-500 text-white transition-all active:scale-95 shadow-lg shadow-flame-500/20"
                  >
                    <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.2em]">Dashboard</span>
                    <div className="absolute inset-0 bg-flame-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </Link>
                ) : (
                  <Link
                    href="/student/login"
                    className="px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-black dark:text-white border border-black/10 dark:border-white/10 rounded-2xl hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all active:scale-95"
                  >
                    Login
                  </Link>
                )}
                
                {isAdmin ? (
                  <Link
                    href="/admin/dashboard"
                    className="px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-white bg-black dark:bg-white dark:text-black rounded-2xl shadow-xl hover:scale-105 transition-all active:scale-95"
                  >
                    Admin
                  </Link>
                ) : (
                  <Link
                    href="/admin/login"
                    className="hidden xl:flex px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-black dark:text-white border border-black/10 dark:border-white/10 rounded-2xl hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all active:scale-95"
                  >
                    Admin Panel
                  </Link>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <ModeToggle />
              
              {!hideNav && (
                <button
                  className="lg:hidden p-3 text-black dark:text-white rounded-2xl bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 transition-all"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label="Toggle menu"
                >
                  {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="lg:hidden absolute top-full left-6 right-6 mt-4 z-50"
            >
              <div className="overflow-hidden rounded-3xl bg-white/80 dark:bg-black/80 backdrop-blur-3xl border border-black/5 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
                <nav className="p-3 flex flex-col gap-1">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-6 py-4 rounded-2xl transition-all group",
                          isActive 
                            ? "bg-flame-500/10 text-flame-600 dark:text-flame-400" 
                            : "hover:bg-black/5 dark:hover:bg-white/5 text-ash-600 dark:text-ash-400 hover:text-black dark:hover:text-white"
                        )}
                      >
                        <span className="text-[14px] font-bold tracking-tight">{link.label}</span>
                        <ChevronRight size={18} className={cn(
                          "transition-transform duration-300",
                          isActive ? "opacity-100" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                        )} />
                      </Link>
                    )
                  })}
                  
                  <div className="h-px bg-black/5 dark:bg-white/5 my-2 mx-4" />
                  
                  {isStudent ? (
                    <Link
                      href="/student/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between px-6 py-5 bg-flame-500 text-white rounded-2xl shadow-xl shadow-flame-500/20"
                    >
                      <span className="text-[12px] font-black uppercase tracking-[0.2em]">Go to Dashboard</span>
                      <ChevronRight size={18} />
                    </Link>
                  ) : (
                    <Link
                      href="/student/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between px-6 py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl shadow-xl"
                    >
                      <span className="text-[12px] font-black uppercase tracking-[0.2em]">Student Portal</span>
                      <ChevronRight size={18} />
                    </Link>
                  )}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
