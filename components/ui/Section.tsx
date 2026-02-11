'use client'

import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'

import { AnimatedGridPattern } from './animated-grid-pattern'

gsap.registerPlugin(ScrollTrigger)

type SectionVariant = 'default' | 'grid' | 'minimal' | 'gradient' | 'dots' | 'animated-grid'

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    className?: string
    delay?: number
    variant?: SectionVariant
}

const Section = ({ children, className, delay = 0, variant = 'default', ...props }: SectionProps) => {
    const sectionRef = useRef<HTMLElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useGSAP(
        () => {
            if (!containerRef.current) return

            gsap.fromTo(
                containerRef.current.children,
                {
                    opacity: 0,
                    y: 30,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power2.out',
                    delay: delay,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    },
                }
            )
        },
        { scope: sectionRef }
    )

    return (
        <section
            ref={sectionRef}
            className={cn('py-20 md:py-32 relative overflow-hidden', className)}
            {...props}
        >
            {/* Background Variants */}
            {variant === 'grid' && (
                <div className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-20 bg-grid-black dark:bg-grid-white bg-[length:32px_32px] mask-radial-fade" />
            )}

            {variant === 'animated-grid' && (
                <AnimatedGridPattern
                    numSquares={30}
                    maxOpacity={0.1}
                    duration={3}
                    repeatDelay={1}
                    className={cn(
                        "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)] opacity-40 dark:opacity-20",
                        "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 fill-slate-400/20 stroke-slate-400/20 dark:fill-white/5 dark:stroke-white/5",
                    )}
                />
            )}

            {variant === 'dots' && (
                <div className="absolute inset-0 pointer-events-none opacity-[0.1] dark:opacity-[0.3] mask-radial-fade"
                    style={{ backgroundImage: 'radial-gradient(circle, #808080 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                />
            )}

            {variant === 'gradient' && (
                <div className="absolute inset-0 pointer-events-none opacity-30">
                    <div className="absolute inset-0 bg-gradient-to-tr from-flame-500/5 via-transparent to-ember-500/5" />
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white dark:from-black to-transparent" />
                </div>
            )}

            {/* Premium Side Decorations (only for default variant) */}
            {variant === 'default' && (
                <>
                    <div className="absolute inset-y-0 left-0 w-12 md:w-24 border-r border-ash-200/20 dark:border-ash-800/20 pointer-events-none hidden lg:block">
                        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-32 w-px bg-gradient-to-b from-transparent via-flame-500/50 to-transparent" />
                        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 h-32 w-px bg-gradient-to-b from-transparent via-flame-500/50 to-transparent" />
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 -rotate-90 origin-left text-[10px] font-black uppercase tracking-[0.5em] text-ash-400/30 dark:text-ash-400/50 whitespace-nowrap">
                            Institutional Innovation Signal
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 w-12 md:w-24 border-l border-ash-200/20 dark:border-ash-800/20 pointer-events-none hidden lg:block">
                        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-32 w-px bg-gradient-to-b from-transparent via-flame-500/50 to-transparent" />
                        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 h-32 w-px bg-gradient-to-b from-transparent via-flame-500/50 to-transparent" />
                        <div className="absolute top-1/2 right-4 -translate-y-1/2 rotate-90 origin-right text-[10px] font-black uppercase tracking-[0.5em] text-ash-400/30 dark:text-ash-400/50 whitespace-nowrap">
                            Sri Ramakrishna Engineering College
                        </div>
                    </div>

                    {/* Decorative Background Elements */}
                    <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-60">
                        <div className="absolute top-0 left-[15%] w-px h-full bg-gradient-to-b from-transparent via-flame-500/10 to-transparent" />
                        <div className="absolute top-0 right-[15%] w-px h-full bg-gradient-to-b from-transparent via-flame-500/10 to-transparent" />
                        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-flame-500/10 to-transparent" />
                    </div>
                </>
            )}

            <div ref={containerRef} className="relative z-10 max-w-[90rem] mx-auto px-4 sm:px-12 lg:px-24">
                {children}
            </div>
        </section>
    )
}

export default Section
