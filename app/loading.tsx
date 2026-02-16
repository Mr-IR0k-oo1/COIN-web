'use client'

import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="relative flex flex-col items-center gap-12 max-w-xs w-full">
                {/* Background Glow Context */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[120px] rounded-full animate-pulse" />
                
                {/* Main Logo Spinner */}
                <div className="relative group">
                    {/* Rotating Rings */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-15px] border-t-2 border-primary/40 rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-30px] border-b-2 border-primary/10 rounded-full"
                    />
                    
                    {/* Logo Box */}
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative z-10 h-20 w-20 flex items-center justify-center rounded-[2rem] bg-black dark:bg-white text-white dark:text-black font-black text-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(255,255,255,0.05)] border border-white/10"
                    >
                        C.
                        
                        {/* Scanning Line Effect */}
                        <motion.div 
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-[2px] bg-primary/40 blur-[1px] z-20"
                        />
                    </motion.div>
                </div>

                {/* Status Text and Progress */}
                <div className="flex flex-col items-center gap-6 w-full">
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-3">
                            <span className="text-[11px] font-tech uppercase tracking-[0.5em] text-primary font-bold animate-pulse">Initializing</span>
                            <div className="flex gap-1">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                        className="w-1 h-1 bg-primary rounded-full"
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-widest text-center max-w-[200px] leading-relaxed">
                            Connecting to Collaborative Innovation Network
                        </p>
                    </div>

                    {/* Minimal Progress Bar */}
                    <div className="w-48 h-[2px] bg-white/5 rounded-full relative overflow-hidden">
                        <motion.div 
                            animate={{ 
                                x: ["-100%", "100%"],
                            }}
                            transition={{ 
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 w-1/2 bg-primary/80"
                        />
                    </div>

                    <div className="flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md">
                         <Zap className="h-3 w-3 text-primary" />
                         <span className="text-[8px] font-tech text-white/40 uppercase tracking-[0.2em]">Secure Node 01</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

