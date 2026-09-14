'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/** Nothing to navigate between until a father is signed in and set up. */
const HIDDEN_ON = ['/login', '/signup', '/setup', '/offline']

/**
 * "The arc" was internal vocabulary — a father has no idea what an arc is.
 * "The plan" is what he'd call it.
 */
const TABS = [
  { href: '/', label: 'Home' },
  { href: '/arc', label: 'The plan' },
  { href: '/journal', label: 'Journal' },
  { href: '/sons', label: 'Sons' },
]

export function Tabs() {
  const pathname = usePathname()
  if (HIDDEN_ON.some((route) => pathname.startsWith(route))) return null

  return (
    <nav
      aria-label="Main"
      className="sticky bottom-0 z-10 bg-stone/95 backdrop-blur pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-2xl px-3 pt-1 pb-2">
        {TABS.map((tab) => {
          const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg
                            px-2 py-2 text-xs transition-colors ${
                              active ? 'text-rust' : 'text-ink-faint hover:text-ink'
                            }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-1 w-1 rounded-full ${active ? 'bg-card' : 'bg-transparent'}`}
                />
                {tab.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
