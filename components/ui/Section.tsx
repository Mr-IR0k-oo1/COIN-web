'use client'

import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'

import { AnimatedGridPattern } from './animated-grid-pattern'

gsap.registerPlugin(ScrollTrigger)

type SectionVariant = 'default' | 'grid' | 'minimal' | 'gradient' | 'dots' | 'animated-grid' | 'aurora'

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    className?: string
    delay?: number
    variant?: SectionVariant
    fullHeight?: boolean
}

const Section = ({ children, className, delay = 0, variant = 'default', fullHeight = false, ...props }: SectionProps) => {
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
            className={cn(
                'py-20 md:py-32 relative overflow-hidden',
                fullHeight && 'min-h-screen flex items-center',
                className
            )}
            {...props}
        >
            {/* Background Variants */}
            {variant === 'grid' && (
                <div className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-20 bg-grid-black dark:bg-grid-white bg-[length:32px_32px] mask-radial-fade transition-opacity duration-1000" />
            )}

            {variant === 'animated-grid' && (
                <AnimatedGridPattern
                    numSquares={30}
                    maxOpacity={0.1}
                    duration={3}
                    repeatDelay={1}
                    className={cn(
                        "opacity-40 dark:opacity-20",
                        "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 fill-slate-400/20 stroke-slate-400/20 dark:fill-white/5 dark:stroke-white/5",
                    )}
                />
            )}

            {variant === 'dots' && (
                <div className="absolute inset-0 pointer-events-none opacity-[0.1] dark:opacity-[0.2] transition-opacity duration-1000" />
            )}

            {variant === 'gradient' && (
                <div className="absolute inset-0 pointer-events-none bg-flame-500/5 dark:bg-flame-900/10" />
            )}

            {variant === 'aurora' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="aurora top-[-10%] left-[-10%] w-[50%] h-[50%] opacity-30 animate-pulse" />
                    <div className="aurora bottom-[-10%] right-[-10%] w-[50%] h-[50%] opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
            )}

            {/* Premium Side Decorations (only for default variant) */}
            {variant === 'default' && (
                <>
                    <div className="absolute inset-y-0 left-0 w-12 md:w-24 border-r border-border/20 pointer-events-none hidden lg:block">
                        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-32 w-px bg-primary/20" />
                        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 h-32 w-px bg-primary/20" />
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 -rotate-90 origin-left text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 dark:text-muted-foreground/40 whitespace-nowrap">
                            Institutional Innovation Signal
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 w-12 md:w-24 border-l border-border/20 pointer-events-none hidden lg:block">
                        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-32 w-px bg-primary/20" />
                        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 h-32 w-px bg-primary/20" />
                        <div className="absolute top-1/2 right-4 -translate-y-1/2 rotate-90 origin-right text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 dark:text-muted-foreground/40 whitespace-nowrap">
                            Sri Ramakrishna Engineering College
                        </div>
                    </div>

                    {/* Decorative Background Elements */}
                    <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-40">
                        <div className="absolute top-0 left-[15%] w-px h-full bg-primary/10" />
                        <div className="absolute top-0 right-[15%] w-px h-full bg-primary/10" />
                        <div className="absolute top-1/2 left-0 w-full h-px bg-primary/10" />
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
