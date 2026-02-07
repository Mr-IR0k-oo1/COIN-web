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
    <footer className="bg-white dark:bg-ash-950 border-t border-ash-200 dark:border-ash-800 text-ash-500 py-24 mt-32 overflow-hidden">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-6">
            <h3 className="text-8xl md:text-[12rem] font-display font-black text-ash-900 dark:text-white leading-[0.7] tracking-tighter opacity-10 mb-12 select-none">
              COIN.
            </h3>
            <p className="text-xl text-ash-600 dark:text-ash-400 max-w-md leading-relaxed font-light">
              Designing the future of institutional innovation. The collaborative hub for SREC's next-gen engineering breakthroughs.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-12 pt-4">
            {links.map((group) => (
              <div key={group.title}>
                <h4 className="text-[10px] font-black text-ash-900 dark:text-white uppercase tracking-[0.4em] mb-10">
                  {group.title}
                </h4>
                <ul className="space-y-6">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-ash-500 dark:text-ash-400 hover:text-flame-500 dark:hover:text-white transition-all duration-300 text-sm font-medium"
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

        <div className="pt-12 border-t border-ash-100 dark:border-ash-900 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ash-400">
              &copy; {new Date().getFullYear()} Sri Ramakrishna Engineering College
            </p>
            <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
              <span className="hover:text-ash-900 dark:hover:text-white transition-colors cursor-pointer">Privacy</span>
              <span className="hover:text-ash-900 dark:hover:text-white transition-colors cursor-pointer">Security</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ash-400">Status</span>
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
