'use client'

import { useActionState } from 'react'
import type { ActionResult } from '@/app/actions'
import { Notice, Submit } from './ui'

type Action = (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>

/**
 * Wraps a server action so failures are shown to the user instead of
 * disappearing. Every mutation in the app goes through this.
 */
export function ActionForm({
  action,
  submitLabel,
  pendingLabel,
  variant = 'button',
  className,
  children,
  footnote,
}: {
  action: Action
  submitLabel: string
  pendingLabel?: string
  variant?: 'button' | 'link'
  className?: string
  children?: React.ReactNode
  footnote?: string
}) {
  const [state, formAction, pending] = useActionState(action, null)

  return (
    <form action={formAction} className={className ?? 'flex flex-col gap-4'}>
      {state?.error ? <Notice>{state.error}</Notice> : null}
      {children}
      {variant === 'link' ? (
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="text-sm font-medium text-accent underline disabled:opacity-50
                       focus-visible:outline-2 focus-visible:outline-offset-2
                       focus-visible:outline-accent"
          >
            {pending ? (pendingLabel ?? 'Saving…') : submitLabel}
          </button>
          {footnote ? <span className="text-sm text-ink-faint">{footnote}</span> : null}
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-4">
          <Submit disabled={pending}>{pending ? (pendingLabel ?? 'Saving…') : submitLabel}</Submit>
          {footnote ? <span className="text-sm text-ink-faint">{footnote}</span> : null}
        </div>
      )}
    </form>
  )
}
