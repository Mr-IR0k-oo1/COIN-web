'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Rocket, Users, BarChart3 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

import Section from '@/components/ui/Section'

export default function Mission() {
    return (
        <Section
            className="bg-ash-950 text-white"
            id="mission-section"
        >
            {/* Minimal Background */}
            <div className="absolute inset-0 z-0 bg-ash-950" />

            <div className="flex flex-col items-center text-center relative z-10 w-full">
                <div className="inline-flex items-center gap-2 text-flame-500 font-bold uppercase tracking-[0.3em] text-xs mb-8">
                    <span className="h-1.5 w-1.5 rounded-full bg-flame-500" />
                    Our Mission
                </div>

                <h2 className="text-4xl md:text-7xl font-display font-extrabold tracking-tighter uppercase leading-none mb-8">
                    Forwarding the <span className="text-gradient">Future</span>
                </h2>

                <p className="text-lg md:text-xl text-ash-400 leading-relaxed max-w-3xl mx-auto mb-20 font-light">
                    Building SREC's innovation backbone where every breakthrough is documented,
                    shared, and celebrated as institutional progress.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
                    {[
                        { label: 'Hackathons', value: '120+', Icon: Rocket },
                        { label: 'Students', value: '2,400+', Icon: Users },
                        { label: 'Analytics', value: '360+', Icon: BarChart3 },
                    ].map((stat) => (
                        <div key={stat.label} className="group border border-white/5 bg-white/[0.02] rounded-2xl p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
                            <stat.Icon className="h-8 w-8 text-flame-500 mb-4 mx-auto" />
                            <p className="text-4xl font-display font-bold text-white mb-2">{stat.value}</p>
                            <p className="text-xs uppercase tracking-widest text-ash-500 font-bold">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    )
}
