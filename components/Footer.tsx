import Link from 'next/link'

export default function Footer() {
  const links = [
    {
      title: 'Platform',
      items: [
        { label: 'Hackathons', href: '/hackathons' },
        { label: 'Submit Participation', href: '/submit' },
        { label: 'Showcase', href: '/showcase' },
        { label: 'Updates', href: '/blog' },
      ],
    },
    {
      title: 'Resources',
      items: [
        { label: 'About CoIN', href: '/about' },
        { label: 'Institution', href: 'https://srec.ac.in' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Admin Access', href: '/admin/login' },
      ],
    },
  ]

  return (
    <footer className="relative bg-background border-t border-border/50 text-muted-foreground py-24 mt-32 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-20 bg-grid-black dark:bg-grid-white bg-[length:32px_32px]" />

      {/* Top Gradient */}
      <div className="absolute top-0 left-0 w-full h-px bg-primary/20" />

      <div className="relative z-10 max-w-[90rem] mx-auto px-6 sm:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-6">
            <h3 className="text-8xl md:text-[12rem] font-display font-black text-secondary leading-[0.7] tracking-tighter mb-12 select-none mix-blend-difference dark:mix-blend-normal dark:text-neutral-900">
              CoIN.
            </h3>
            <p className="text-xl text-muted-foreground max-w-md leading-relaxed font-light text-balance">
              Designing the future of institutional innovation. The collaborative hub for SREC's next-gen engineering breakthroughs.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-12 pt-4">
            {links.map((group) => (
              <div key={group.title}>
                <h4 className="text-[10px] font-black text-foreground uppercase tracking-[0.4em] mb-10">
                  {group.title}
                </h4>
                <ul className="space-y-6">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-primary transition-all duration-300 text-sm font-medium hover:pl-2"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-12 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              &copy; {new Date().getFullYear()} Sri Ramakrishna Engineering College
            </p>
            <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
              <Link href="/privacy" className="hover:text-foreground transition-colors cursor-pointer">
                Privacy
              </Link>
              <Link href="/security" className="hover:text-foreground transition-colors cursor-pointer">
                Security
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors cursor-pointer">
                Contact
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</span>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[8px] font-black text-green-600 uppercase tracking-widest">Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
