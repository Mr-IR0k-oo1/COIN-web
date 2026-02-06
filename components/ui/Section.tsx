'use client'

import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    className?: string
    delay?: number
}

const Section = ({ children, className, delay = 0, ...props }: SectionProps) => {
    const sectionRef = useRef<HTMLElement>(null)

    useGSAP(
        () => {
            if (!sectionRef.current) return

            gsap.fromTo(
                sectionRef.current,
                {
                    opacity: 0,
                    y: 50,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    delay: delay,
                    scrollTrigger: {
                        trigger: sectionRef.current,
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
            className={cn('py-16 md:py-24 relative', className)}
            {...props}
        >
            {children}
        </section>
    )
}

export default Section
