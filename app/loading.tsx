import { Zap } from 'lucide-react'

export default function Loading() {
    return (
        <div className="flex h-[50vh] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-flame-500/20 blur-xl rounded-full animate-pulse" />
                    <Zap className="h-10 w-10 text-flame-500 animate-bounce" />
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400 animate-pulse">Loading...</p>
            </div>
        </div>
    )
}
