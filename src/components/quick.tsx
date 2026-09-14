import type { Child } from '@/lib/domain/types'
import { addCapture, addPrayer } from '@/app/actions'
import { ActionForm } from '@/components/action-form'
import { TextArea } from '@/components/ui'

function Disclosure({
  summary,
  hint,
  children,
}: {
  summary: string
  hint: string
  children: React.ReactNode
}) {
  return (
    <details className="group rounded-sm border border-rule bg-raised">
      <summary
        className="flex cursor-pointer list-none items-baseline justify-between gap-4 px-5 py-4
                   [&::-webkit-details-marker]:hidden"
      >
        <span className="font-display text-lg">{summary}</span>
        <span className="text-sm text-ink-faint group-open:hidden">{hint}</span>
        <span className="hidden text-sm text-ink-faint group-open:inline">Close</span>
      </summary>
      <div className="border-t border-rule-soft px-5 py-5">{children}</div>
    </details>
  )
}

function ChildSelect({
  sons,
  name,
  includeBoth,
}: {
  sons: Child[]
  name: string
  includeBoth: boolean
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-soft">Who&apos;s it about</span>
      <select
        id={name}
        name={name}
        className="w-full rounded-sm border border-rule bg-raised px-3 py-2.5 text-ink
                   focus:outline-2 focus:outline-offset-1 focus:outline-accent"
      >
        {includeBoth ? <option value="">All of them</option> : null}
        {sons.map((son) => (
          <option key={son.id} value={son.id}>
            {son.name}
          </option>
        ))}
      </select>
    </label>
  )
}

/** Thirty seconds, needs nothing from his son, goes into the book. */
export function QuickCapture({ sons }: { sons: Child[] }) {
  return (
    <Disclosure summary="Write something down" hint="30 seconds">
      <ActionForm action={addCapture} submitLabel="Save it" pendingLabel="Saving…">
        <TextArea
          label="What happened, or what he said"
          name="body"
          rows={4}
          placeholder="Something he said at dinner. Something you noticed. Anything you'd want him to read at eighteen."
        />
        {sons.length > 0 ? <ChildSelect sons={sons} name="childId" includeBoth /> : null}
      </ActionForm>
    </Disclosure>
  )
}

/** The moat: it comes back years later and asks what happened. */
export function QuickPrayer({ sons }: { sons: Child[] }) {
  if (sons.length === 0) return null
  return (
    <Disclosure summary="Pray something over him" hint="Comes back later">
      <ActionForm action={addPrayer} submitLabel="Log it" pendingLabel="Saving…">
        <TextArea
          label="What are you asking for him?"
          name="body"
          rows={4}
          placeholder="Be specific. Vague prayers are impossible to answer later."
        />
        <ChildSelect sons={sons} name="childId" includeBoth={false} />
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-soft">Ask me about it in</span>
          <select
            id="reviewMonths"
            name="reviewMonths"
            defaultValue={6}
            className="w-full rounded-sm border border-rule bg-raised px-3 py-2.5 text-ink
                       focus:outline-2 focus:outline-offset-1 focus:outline-accent"
          >
            <option value={3}>3 months</option>
            <option value={6}>6 months</option>
            <option value={12}>A year</option>
          </select>
        </label>
      </ActionForm>
    </Disclosure>
  )
}
