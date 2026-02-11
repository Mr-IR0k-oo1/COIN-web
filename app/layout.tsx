import type { Metadata } from 'next'
import { Manrope, Sora, Unbounded, Fraunces, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/theme-provider'
import Preloader from '@/components/ui/preloader'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' })
const unbounded = Unbounded({ subsets: ['latin'], variable: '--font-unbounded' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata: Metadata = {
  title: 'CoIN: The Innovation Ecosystem',
  description: 'The collaborative hub for innovation, hackathons, and student achievements at Sri Ramakrishna Engineering College.',
  keywords: ['Innovation', 'Hackathon', 'SREC', 'CoIN', 'Student Startup'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={cn(
          manrope.variable,
          sora.variable,
          unbounded.variable,
          fraunces.variable,
          jetbrainsMono.variable,
          'min-h-screen bg-slate-50 dark:bg-black font-sans antialiased text-slate-900 dark:text-slate-50'
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Preloader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
