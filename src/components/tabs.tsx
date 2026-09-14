'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/** Nothing to navigate between until a father is signed in and set up. */
const HIDDEN_ON = ['/login', '/signup', '/setup', '/offline']

const TABS = [
  { href: '/', label: 'Home' },
  { href: '/arc', label: 'The arc' },
  { href: '/journal', label: 'Journal' },
  { href: '/sons', label: 'Sons' },
]

/**
 * A father should always be able to leave whatever screen he's on. Without
 * this the app reads as a funnel he's trapped in rather than somewhere he can
 * look around.
 */
export function Tabs() {
  const pathname = usePathname()
  if (HIDDEN_ON.some((route) => pathname.startsWith(route))) return null

  return (
    <nav
      aria-label="Main"
      className="sticky bottom-0 z-10 border-t border-rule bg-surface/95 backdrop-blur
                 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-2xl">
        {TABS.map((tab) => {
          const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center justify-center px-3 py-4 text-sm font-medium
                            transition-colors ${
                              active
                                ? 'text-accent border-t-2 border-t-accent -mt-px'
                                : 'text-ink-faint hover:text-ink'
                            }`}
              >
                {tab.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
