'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 4000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    key="preloader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
                >
                    <div className="relative flex flex-col items-center">
                        {/* Glowing Orb Background */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.6 }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                            className="absolute inset-0 bg-gradient-to-tr from-flame-500/30 to-ember-500/30 blur-[100px] rounded-full w-64 h-64 -z-10"
                        />

                        {/* Logo Text Animation */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex items-center gap-2"
                        >
                            <span className="text-6xl md:text-8xl font-display font-black tracking-tighter text-white">
                                Co<span className="text-flame-500">IN</span>
                            </span>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5, duration: 0.4 }}
                                className="w-3 h-3 md:w-4 md:h-4 bg-flame-500 rounded-full mt-auto mb-4 md:mb-6"
                            />
                        </motion.div>

                        {/* Loading Bar */}
                        <div className="mt-8 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "0%" }}
                                transition={{ duration: 3.5, ease: "easeInOut" }}
                                className="h-full bg-gradient-to-r from-flame-500 to-ember-500 w-full"
                            />
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            transition={{ delay: 0.8 }}
                            className="mt-4 text-xs font-mono text-white tracking-[0.3em] uppercase"
                        >
                            Initializing
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
