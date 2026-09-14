import type { Child } from '@/lib/domain/types'
import { addCapture, addPrayer } from '@/app/actions'
import { ActionForm } from '@/components/action-form'
import { Select, Sheet } from '@/components/ui'

function sonOptions(sons: Child[], includeAll: boolean) {
  return [
    ...(includeAll ? [{ value: '', label: 'All of them' }] : []),
    ...sons.map((s) => ({ value: s.id, label: s.name })),
  ]
}

/** Thirty seconds, needs nothing from his son, goes into the book. */
export function QuickCapture({ sons }: { sons: Child[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-display text-xl">Write down something he said or did</h2>
      <ActionForm action={addCapture} submitLabel="Keep it" pendingLabel="Saving…">
        <Sheet
          prompt="What happened?"
          name="body"
          rows={5}
          keptFor={sons.length === 1 ? sons[0].name : undefined}
          placeholder="Anything you'd want him to read at eighteen."
        />
        {sons.length > 1 ? (
          <Select label="Who it's about" name="childId" options={sonOptions(sons, true)} />
        ) : null}
      </ActionForm>
    </section>
  )
}

/** The moat: it comes back years later and asks what happened. */
export function QuickPrayer({ sons }: { sons: Child[] }) {
  if (sons.length === 0) return null
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-display text-xl">
        Write down a prayer for {sons.length === 1 ? sons[0].name : 'one of them'}
      </h2>
      <ActionForm action={addPrayer} submitLabel="Keep it" pendingLabel="Saving…">
        <Sheet
          prompt="What are you asking for him?"
          name="body"
          rows={5}
          keptFor={sons.length === 1 ? sons[0].name : undefined}
          placeholder="Be specific. Vague prayers are impossible to answer later."
        />
        {sons.length > 1 ? (
          <Select label="Who it's for" name="childId" options={sonOptions(sons, false)} />
        ) : (
          <input type="hidden" name="childId" value={sons[0].id} />
        )}
        <Select
          label="Bring it back and ask me in"
          name="reviewMonths"
          defaultValue={6}
          options={[
            { value: 3, label: '3 months' },
            { value: 6, label: '6 months' },
            { value: 12, label: 'A year' },
          ]}
        />
      </ActionForm>
    </section>
  )
}
