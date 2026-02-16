import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid md:auto-rows-[20rem] grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
    number,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
    number?: string | number;
}) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
                "row-span-1 rounded-[2rem] group/bento transition-all duration-500 p-8 border border-border/50 relative overflow-hidden flex flex-col justify-between",
                "bg-white dark:bg-neutral-900/40 backdrop-blur-sm",
                "hover:shadow-[0_24px_80px_rgba(0,0,0,0.06)] dark:hover:shadow-none hover:border-primary/30",
                className
            )}
        >
            {/* Number Indicator */}
            {number && (
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="absolute top-8 right-8 text-5xl font-display font-black text-foreground/5 group-hover/bento:text-primary/20 group-hover/bento:scale-110 group-hover/bento:-translate-x-2 transition-all duration-700 select-none pointer-events-none"
                >
                    {number}
                </motion.div>
            )}
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover/bento:opacity-100">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
            </div>

            {/* Solid overlay for texture */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/bento:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex flex-col h-full space-y-4">
                {header}
                
                <div className="flex flex-col flex-1">
                    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary dark:bg-white/5 border border-border/50 text-foreground group-hover/bento:scale-110 group-hover/bento:bg-primary group-hover/bento:text-white transition-all duration-500 group-hover/bento:rotate-3">
                        {icon}
                    </div>
                    
                    <div className="mt-auto">
                        <h3 className="font-display font-black text-foreground mb-3 text-2xl tracking-tight leading-tight group-hover/bento:text-primary transition-colors duration-300">
                            {title}
                        </h3>
                        <p className="font-sans font-normal text-muted-foreground text-[15px] leading-relaxed line-clamp-2 transition-colors duration-300 group-hover/bento:text-foreground">
                            {description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Decorative "Innovative" Accent */}
            <div className="absolute top-6 right-8 opacity-0 group-hover/bento:opacity-20 transition-all duration-500 group-hover/bento:translate-x-0 translate-x-4">
                <div className="flex gap-1.5">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-1 w-4 rounded-full bg-primary" />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
