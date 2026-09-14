import Link from 'next/link'
import { signOut } from '@/app/actions'

export function Masthead({ email }: { email?: string }) {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="font-display text-xl text-accent">
          Cairn
        </Link>
        {email ? (
          <div className="flex items-center gap-4">
            <span className="eyebrow hidden sm:inline">{email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="-mx-3 inline-flex min-h-11 items-center rounded-sm px-3 text-sm
                           text-ink-faint hover:text-ink focus-visible:outline-2
                           focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Sign out
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </header>
  )
}
