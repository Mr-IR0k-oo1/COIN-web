import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AnimatedGridPatternDemoPage() {
    return (
        <>
            <Header />
            <main className="flex-1 flex items-center justify-center p-20 min-h-screen">
                <div className="relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black p-20 md:shadow-2xl">
                    <p className="z-10 whitespace-pre-wrap text-center text-5xl font-display font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
                        Animated Grid<br /><span className="text-gradient">Pattern</span>
                    </p>
                    <AnimatedGridPattern
                        numSquares={30}
                        maxOpacity={0.15}
                        duration={3}
                        repeatDelay={1}
                        className={cn(
                            "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
                            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 fill-flame-500/30 stroke-flame-500/30",
                        )}
                    />
                </div>
            </main>
            <Footer />
        </>
    );
}
