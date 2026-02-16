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
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.1] bg-grid-black dark:bg-grid-white bg-[length:40px_40px] mask-radial-fade transition-opacity duration-1000" />
            )}

            {variant === 'animated-grid' && (
                <AnimatedGridPattern
                    numSquares={40}
                    maxOpacity={0.15}
                    duration={4}
                    repeatDelay={0.5}
                    className={cn(
                        "opacity-30 dark:opacity-40",
                        "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 fill-flame-500/10 stroke-flame-500/10 dark:fill-flame-500/5 dark:stroke-flame-500/5",
                    )}
                />
            )}

            {variant === 'dots' && (
                <div className="absolute inset-0 pointer-events-none opacity-[0.1] dark:opacity-[0.15] bg-dot-pattern text-ash-300 dark:text-ash-700 transition-opacity duration-1000" />
            )}

            {variant === 'gradient' && (
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-flame-500/5 to-transparent dark:via-flame-500/10" />
            )}

            {variant === 'aurora' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="aurora top-[-20%] left-[-10%] w-[70%] h-[70%] bg-flame-500/30 blur-[160px] opacity-40 animate-pulse" />
                    <div className="aurora bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-ember-500/20 blur-[160px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
                </div>
            )}

            {/* Premium Side Decorations (only for default variant) */}
            {variant === 'default' && (
                <>
                    <div className="absolute inset-y-0 left-0 w-12 md:w-32 border-r border-border/10 pointer-events-none hidden xl:block">
                        <div className="absolute top-1/4 left-1/2 -track-x-1/2 h-48 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
                        <div className="absolute bottom-1/4 left-1/2 -track-x-1/2 h-48 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 -rotate-90 origin-left text-[9px] font-tech uppercase tracking-[0.8em] text-muted-foreground/30 dark:text-muted-foreground/50 whitespace-nowrap">
                            SIGNAL // INSTITUTIONAL // INNOVATION
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 w-12 md:w-32 border-l border-border/10 pointer-events-none hidden xl:block">
                        <div className="absolute top-1/3 left-1/2 -track-x-1/2 h-48 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
                        <div className="absolute bottom-1/3 left-1/2 -track-x-1/2 h-48 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
                        <div className="absolute top-1/2 right-6 -translate-y-1/2 rotate-90 origin-right text-[9px] font-tech uppercase tracking-[0.8em] text-muted-foreground/30 dark:text-muted-foreground/50 whitespace-nowrap">
                            IDENT // SRI RAMAKRISHNA // ENGG // COLLEGE
                        </div>
                    </div>

                    {/* Decorative Background Elements */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-0 left-[10%] w-px h-full bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
                        <div className="absolute top-0 right-[10%] w-px h-full bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
                        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
                        <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
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
