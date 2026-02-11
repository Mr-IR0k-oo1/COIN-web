'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { AnimatedGridPattern } from './animated-grid-pattern'

interface PageHeroProps {
    badge?: string
    title: React.ReactNode
    description?: string
    children?: React.ReactNode
    className?: string
    align?: 'center' | 'left'
}

export function PageHero({
    badge,
    title,
    description,
    children,
    className,
    align = 'center',
}: PageHeroProps) {
    return (
        <section className={cn("relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden", className)}>
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Animated Grid Pattern */}
                <AnimatedGridPattern
                    numSquares={30}
                    maxOpacity={0.1}
                    duration={3}
                    repeatDelay={1}
                    className={cn(
                        "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
                        "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 fill-slate-400/20 stroke-slate-400/20 dark:fill-white/5 dark:stroke-white/5",
                    )}
                />

                {/* Gradient Orbs */}
                <div className="absolute top-0 transform -translate-x-1/2 left-1/2 w-[1000px] h-[500px] bg-flame-500/20 rounded-[100%] blur-[120px] opacity-20 pointer-events-none" />
                <div className="absolute top-20 transform translate-x-1/3 right-0 w-[600px] h-[400px] bg-ember-500/10 rounded-[100%] blur-[100px] opacity-20 pointer-events-none" />
            </div>

            <div className={cn("relative z-10 max-w-5xl mx-auto px-6", align === 'center' ? 'text-center' : 'text-left')}>
                {badge && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className={cn(
                            "inline-flex items-center gap-2 px-3 py-1 rounded-full border border-flame-500/20 bg-flame-500/5 text-flame-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 backdrop-blur-sm",
                            align === 'center' ? 'mx-auto' : ''
                        )}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-flame-500 animate-pulse" />
                        {badge}
                    </motion.div>
                )}

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    className="text-4xl md:text-7xl font-display font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight leading-[0.9]"
                >
                    {title}
                </motion.h1>

                {description && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        className={cn(
                            "text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed font-light",
                            align === 'center' ? 'mx-auto' : ''
                        )}
                    >
                        {description}
                    </motion.p>
                )}

                {children && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                        className="mt-10"
                    >
                        {children}
                    </motion.div>
                )}
            </div>
        </section>
    )
}
