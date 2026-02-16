'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                const increment = Math.random() * 2
                return Math.min(prev + increment, 100)
            })
        }, 30)

        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 4000)

        return () => {
            clearTimeout(timer)
            clearInterval(interval)
        }
    }, [])

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    key="preloader"
                    initial={{ opacity: 1 }}
                    exit={{ 
                        opacity: 0,
                        scale: 1.05,
                        filter: "blur(20px)",
                        transition: { duration: 1, ease: [0.23, 1, 0.32, 1] } 
                    }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
                >
                    {/* High-Tech Background Elements */}
                    <div className="absolute inset-0 opacity-20 bg-grid-white bg-[length:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
                    <div className="absolute inset-0 noise opacity-[0.03] pointer-events-none" />
                    
                    {/* Glowing Orbs */}
                    <motion.div
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -z-10"
                    />

                    <div className="relative flex flex-col items-center">
                        {/* Branding Section */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex flex-col items-center mb-16"
                        >
                            <div className="flex items-center gap-6">
                                <span className="text-7xl md:text-9xl font-display font-black tracking-tighter text-white">
                                    Co<span className="text-primary italic">IN</span>
                                </span>
                                <div className="hidden md:flex flex-col border-l border-white/10 pl-6 py-2 gap-1">
                                    <span className="text-[10px] font-tech text-primary uppercase tracking-[0.4em] font-bold">Institution of</span>
                                    <span className="text-[10px] font-tech text-white/60 uppercase tracking-[0.4em] font-bold">Innovation & Research</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Centered Progress Indicator */}
                        <div className="relative w-64 md:w-96">
                            <div className="flex justify-between items-end mb-3">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-tech text-primary uppercase tracking-[0.2em] font-bold">System Status</span>
                                    <motion.span 
                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="text-[9px] font-mono text-white/40 uppercase tracking-[0.1em]"
                                    >
                                        {progress < 25 ? "Initialising Kernel..." : 
                                         progress < 50 ? "Syncing Neural Assets..." : 
                                         progress < 75 ? "fetching components..." : 
                                         "Ready for deployment"}
                                    </motion.span>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-2xl font-display font-black text-white leading-none">
                                        {Math.round(progress)}%
                                    </span>
                                </div>
                            </div>

                            {/* Progress bar container */}
                            <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden relative">
                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${progress}%` }}
                                    className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                />
                                {/* Shimmer effect on progress bar */}
                                <motion.div
                                    animate={{ left: ["-100%", "200%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-y-0 w-20 bg-white/20 skew-x-12"
                                />
                            </div>
                        </div>

                        {/* Technical Metadata Footer */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 1 }}
                            className="mt-20 flex gap-12"
                        >
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[8px] font-tech text-white/20 uppercase tracking-[0.3em]">Build</span>
                                <span className="text-[9px] font-tech text-primary/60 uppercase tracking-[0.2em]">v1.0.4-STABLE</span>
                            </div>
                            <div className="w-px h-6 bg-white/5" />
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[8px] font-tech text-white/20 uppercase tracking-[0.3em]">Locale</span>
                                <span className="text-[9px] font-tech text-primary/60 uppercase tracking-[0.2em]">SREC_TAMILNADU</span>
                            </div>
                            <div className="w-px h-6 bg-white/5" />
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[8px] font-tech text-white/20 uppercase tracking-[0.3em]">Network</span>
                                <span className="text-[9px] font-tech text-primary/60 uppercase tracking-[0.2em]">Live_Secured</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Corner accents */}
                    <div className="absolute top-12 left-12 w-12 h-12 border-t-2 border-l-2 border-white/5 rounded-tl-2xl" />
                    <div className="absolute top-12 right-12 w-12 h-12 border-t-2 border-r-2 border-white/5 rounded-tr-2xl" />
                    <div className="absolute bottom-12 left-12 w-12 h-12 border-b-2 border-l-2 border-white/5 rounded-bl-2xl" />
                    <div className="absolute bottom-12 right-12 w-12 h-12 border-b-2 border-r-2 border-white/5 rounded-br-2xl" />
                </motion.div>
            )}
        </AnimatePresence>
    )
}

