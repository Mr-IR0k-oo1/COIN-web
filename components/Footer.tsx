import Link from 'next/link'

export default function Footer() {
  const links = [
    {
      title: 'Platform',
      items: [
        { label: 'Hackathons', href: '/hackathons' },
        { label: 'Submit Participation', href: '/submit' },
        { label: 'Blog', href: '/blog' },
      ],
    },
    {
      title: 'Learn',
      items: [
        { label: 'About CoIN', href: '/about' },
        { label: 'Terms', href: '/terms' },
        { label: 'Admin Login', href: '/admin/login' },
      ],
    },
  ]

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 py-16 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-heading font-bold text-2xl mb-4">
              CoIN @ SREC
            </h3>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
              The collaborative hub for innovation, student participation, and
              excellence at Sri Ramakrishna Engineering College.
            </p>
          </div>

          {links.map((group) => (
            <div key={group.title}>
              <h4 className="text-white font-medium mb-6 text-sm uppercase tracking-wider">
                {group.title}
              </h4>
              <ul className="space-y-4 text-sm">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} SREC CoIN. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">
              Cookie Policy
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
