import Link from 'next/link'
import { signOut } from '@/app/actions'

/** Quiet. The date rather than an email address — it belongs to the week. */
export function Masthead({ trailing }: { trailing?: string }) {
  const today = new Date().toLocaleDateString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
  return (
    <header className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-5 pt-4">
      <Link href="/" className="font-display text-lg text-rust">
        Cairn
      </Link>
      <span className="font-mono text-[0.65rem] tracking-widest text-ink-faint uppercase">
        {trailing ?? today}
      </span>
    </header>
  )
}

/** Sign out lives on the Sons tab now, not on every screen. */
export function SignOut() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="-mx-2 inline-flex min-h-11 items-center rounded-lg px-2 text-sm
                   text-ink-faint hover:text-ink focus-visible:outline-2
                   focus-visible:outline-offset-2 focus-visible:outline-rust"
      >
        Sign out
      </button>
    </form>
  )
}
