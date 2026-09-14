'use client'

import { useActionState } from 'react'
import type { ActionResult } from '@/app/actions'
import { Notice, Submit } from './ui'

type Action = (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>

/**
 * Wraps a server action so failures are shown and successes are confirmed.
 * Before this, saving something looked identical to nothing happening.
 */
export function ActionForm({
  action,
  submitLabel,
  pendingLabel,
  variant = 'button',
  className,
  children,
  footnote,
  destructive = false,
}: {
  action: Action
  submitLabel: string
  pendingLabel?: string
  variant?: 'button' | 'link'
  className?: string
  children?: React.ReactNode
  footnote?: string
  destructive?: boolean
}) {
  const [state, formAction, pending] = useActionState(action, null)

  return (
    <form action={formAction} className={className ?? 'flex flex-col gap-4'}>
      {state?.error ? <Notice>{state.error}</Notice> : null}
      {state?.ok ? <Notice tone="ok">{state.ok}</Notice> : null}
      {children}
      {variant === 'link' ? (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className={`-mx-2 inline-flex min-h-11 items-center rounded-lg px-2 text-sm
                        disabled:opacity-50 focus-visible:outline-2
                        focus-visible:outline-offset-2 focus-visible:outline-accent ${
                          destructive ? 'text-ink-faint hover:text-brass' : 'text-accent'
                        }`}
          >
            {pending ? (pendingLabel ?? 'Saving…') : submitLabel}
          </button>
          {footnote ? <span className="text-sm text-ink-faint">{footnote}</span> : null}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Submit disabled={pending}>{pending ? (pendingLabel ?? 'Saving…') : submitLabel}</Submit>
          {footnote ? (
            <span className="text-center text-sm text-ink-faint">{footnote}</span>
          ) : null}
        </div>
      )}
    </form>
  )
}
