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
    fullHeight?: boolean
}

export function PageHero({
    badge,
    title,
    description,
    children,
    className,
    align = 'center',
    fullHeight = false,
}: PageHeroProps) {
    return (
        <section className={cn(
            "relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden",
            fullHeight && "min-h-screen flex items-center",
            className
        )}>
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Animated Grid Pattern */}
                <AnimatedGridPattern
                    numSquares={40}
                    maxOpacity={0.1}
                    duration={3}
                    repeatDelay={1}
                    className={cn(
                        "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
                        "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 fill-slate-400/20 stroke-slate-400/20 dark:fill-white/10 dark:stroke-white/10",
                    )}
                />

                {/* Aurora Glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] aurora opacity-20 dark:opacity-30 blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] aurora opacity-10 dark:opacity-20 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
                
                {/* Secondary Center Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] opacity-50" />
            </div>

            <div className={cn("relative z-10 max-w-5xl mx-auto px-6", align === 'center' ? 'text-center' : 'text-left')}>
                {badge && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className={cn(
                            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[11px] font-black uppercase tracking-[0.25em] mb-8 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(var(--primary),0.1)]",
                            align === 'center' ? 'mx-auto' : ''
                        )}
                    >
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        {badge}
                    </motion.div>
                )}

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl md:text-8xl font-display font-black text-foreground mb-8 uppercase tracking-tighter leading-[0.85] text-balance"
                >
                    {title}
                </motion.h1>

                {description && (
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className={cn(
                            "text-lg md:text-2xl text-muted-foreground max-w-2xl leading-relaxed font-light text-balance",
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
