import Link from 'next/link'
import type { ArcItem, Child, GroundworkItem } from '@/lib/domain/types'
import { titleFor } from '@/lib/domain/content'
import { completeGroundwork, deferItem, setItemDone, skipGroundwork } from '@/app/actions'
import { ActionForm } from '@/components/action-form'
import { DayPicker, Prose, TextArea } from '@/components/ui'
import { Scripture } from '@/components/scripture'

const KIND_LABEL: Record<ArcItem['kind'], string> = {
  conversation: 'A conversation',
  competency: 'Something to teach him',
  experience: 'Something to do together',
  rite: 'The rite that closes the stage',
}

/**
 * Apple's Designing for iOS: "limit the number of onscreen controls while
 * making secondary details and actions discoverable with minimal interaction."
 *
 * So the surface carries the instruction, one line, and one button. The why,
 * the scripture and the ways out all live one tap down.
 */
function More({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <details className="group border-t border-rule-soft">
      <summary
        className="flex min-h-14 cursor-pointer list-none items-center justify-between
                   text-sm text-ink-soft [&::-webkit-details-marker]:hidden"
      >
        <span>{label}</span>
        <span className="text-ink-faint transition-transform group-open:rotate-180">▾</span>
      </summary>
      <div className="flex flex-col gap-5 pb-5">{children}</div>
    </details>
  )
}

function Heading({ kind, title }: { kind: string; title: string }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-mono text-xs tracking-wider text-accent uppercase">{kind}</p>
      <h1 className="font-display text-[1.7rem] leading-tight text-balance">{title}</h1>
    </div>
  )
}

export function GroundworkCard({
  item,
  weekOf,
  total,
  reminderDay,
}: {
  item: GroundworkItem
  weekOf: number
  total: number
  reminderDay: number
}) {
  return (
    <section className="flex flex-col gap-6">
      <Heading kind={`Before you start · ${weekOf} of ${total}`} title={item.title} />
      <p className="text-ink-soft">{item.summary}</p>

      <ActionForm
        action={completeGroundwork}
        submitLabel={stepLabel(weekOf, total)}
        pendingLabel="Saving…"
        className="flex flex-col gap-4"
      >
        <input type="hidden" name="itemId" value={item.id} />
        {item.input === 'reminder-day' ? (
          <DayPicker name="reminderDay" defaultValue={reminderDay} />
        ) : null}
        {item.input === 'writing' ? (
          <TextArea label={item.prompt ?? 'Write it here'} name="body" />
        ) : null}
      </ActionForm>

      <More label="Why this one, and how">
        <Prose text={item.detail} className="text-ink-soft" />
        {item.scripture ? <Scripture reference={item.scripture} /> : null}
        <div className="flex flex-col gap-3">
          <ActionForm action={deferItem} variant="link" submitLabel="Not this week" destructive>
            <input type="hidden" name="itemId" value={item.id} />
          </ActionForm>
          <form action={skipGroundwork}>
            <button
              type="submit"
              className="-mx-3 inline-flex min-h-11 items-center rounded-sm px-3 text-sm
                         text-ink-faint hover:text-ink focus-visible:outline-2
                         focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              I know how this works — skip ahead
            </button>
          </form>
        </div>
      </More>
    </section>
  )
}

/**
 * Apple's Writing guidance for multi-step flows: open with "Get started",
 * keep one consistent word in the middle, and signal the end with "Done".
 */
function stepLabel(step: number, total: number): string {
  if (step === 1) return 'Get started'
  if (step === total) return 'Done'
  return 'Continue'
}

export function ArcCard({
  item,
  child,
  alternatives,
  skip,
}: {
  item: ArcItem
  child: Child
  alternatives: number
  skip: number
}) {
  return (
    <section className="flex flex-col gap-6">
      <Heading
        kind={`This week · ${KIND_LABEL[item.kind].toLowerCase()}`}
        title={titleFor(item, child.name)}
      />
      <p className="text-ink-soft">{item.summary}</p>

      <ActionForm
        action={setItemDone}
        submitLabel="We've done this"
        pendingLabel="Marking…"
        footnote={item.scope === 'shared' ? 'Counts for every son' : undefined}
      >
        <input type="hidden" name="itemId" value={item.id} />
        <input type="hidden" name="childId" value={child.id} />
        <input type="hidden" name="done" value="true" />
      </ActionForm>

      <More label="Why this one, and how">
        <p className="text-ink-soft">{item.detail}</p>
        {item.opener ? (
          <p className="border-l-2 border-l-accent bg-surface px-4 py-3 font-display text-lg italic">
            {item.opener}
          </p>
        ) : null}
        {item.scripture ? <Scripture reference={item.scripture} /> : null}
        <div className="flex flex-col gap-2">
          <ActionForm action={deferItem} variant="link" submitLabel="Not yet" destructive>
            <input type="hidden" name="itemId" value={item.id} />
            <input type="hidden" name="childId" value={child.id} />
          </ActionForm>
          {alternatives > 0 ? (
            <Link
              href={`/?skip=${skip + 1}`}
              prefetch={false}
              className="-mx-3 inline-flex min-h-11 items-center rounded-sm px-3 text-sm
                         font-medium text-accent underline underline-offset-4"
            >
              Show me something else
            </Link>
          ) : null}
          <p className="pt-1 text-sm text-ink-faint">
            Nothing here is overdue, and Cairn doesn&apos;t keep score.
          </p>
        </div>
      </More>
    </section>
  )
}
