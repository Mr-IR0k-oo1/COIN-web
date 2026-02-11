import { cn } from "@/lib/utils";

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
                "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto",
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
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "row-span-1 rounded-3xl group/bento hover:shadow-2xl transition duration-300 shadow-input p-6 bg-white dark:bg-black border border-slate-200 dark:border-white/20 justify-between flex flex-col space-y-4 overflow-hidden relative",
                className
            )}
        >
            <div className="group-hover/bento:translate-x-2 transition duration-300 relative z-20 h-full flex flex-col">
                <div className="mb-4 text-flame-500 bg-flame-50 dark:bg-flame-900/10 w-fit p-3 rounded-2xl border border-flame-100 dark:border-flame-500/20">
                    {icon}
                </div>
                <div className="font-display font-bold text-slate-900 dark:text-neutral-100 mb-2 mt-auto text-xl">
                    {title}
                </div>
                <div className="font-sans font-normal text-slate-600 dark:text-neutral-400 text-sm leading-relaxed">
                    {description}
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-slate-50 dark:bg-white/10 blur-2xl group-hover/bento:bg-flame-500/20 transition-colors duration-500"></div>
        </div>
    );
};
