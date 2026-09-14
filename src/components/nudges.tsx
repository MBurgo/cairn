import Link from 'next/link'
import type { ArcItem, Child, GroundworkItem, Mentor } from '@/lib/domain/types'
import { titleFor } from '@/lib/domain/content'
import { completeGroundwork, deferItem, setItemDone, skipGroundwork } from '@/app/actions'
import { ActionForm } from '@/components/action-form'
import { DayPicker, Prose, Sheet, WeightNote } from '@/components/ui'
import { Scripture } from '@/components/scripture'

const KIND_LABEL: Record<ArcItem['kind'], string> = {
  conversation: 'a conversation',
  competency: 'something to teach him',
  experience: 'something to do together',
  rite: 'the occasion that closes this stage',
}

/**
 * The label names what is actually behind it. "Why this one, and how" was the
 * app being clever; a father wants to know whether opening it will tell him
 * what to say or how to do it.
 */
function disclosureLabel(item: ArcItem): string {
  switch (item.kind) {
    case 'conversation':
      return 'How to start it, and what to say'
    case 'competency':
      return 'How to teach it, and why it matters'
    case 'rite':
      return 'How to run it, and why it matters'
    default:
      return 'How to do it, and why it matters'
  }
}

function More({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <details className="group">
      <summary
        className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4
                   text-sm text-ink-soft [&::-webkit-details-marker]:hidden"
      >
        <span>{label}</span>
        <span
          aria-hidden="true"
          className="text-ink-faint transition-transform group-open:rotate-180"
        >
          ▾
        </span>
      </summary>
      <div className="flex flex-col gap-5 pt-2 pb-4">{children}</div>
    </details>
  )
}

function Heading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-[0.65rem] tracking-[0.15em] text-accent uppercase">{kicker}</p>
      <h1 className="instruction">{title}</h1>
    </div>
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

export function GroundworkCard({
  item,
  weekOf,
  total,
  reminderDay,
  firstSonName,
}: {
  item: GroundworkItem
  weekOf: number
  total: number
  reminderDay: number
  firstSonName?: string
}) {
  return (
    <section className="flex flex-col gap-7">
      <Heading kicker={`Getting ready · week ${weekOf} of ${total}`} title={item.title} />
      <p className="text-ink-soft">{item.summary}</p>

      <ActionForm
        action={completeGroundwork}
        submitLabel={stepLabel(weekOf, total)}
        pendingLabel="Saving…"
        className="flex flex-col gap-5"
      >
        <input type="hidden" name="itemId" value={item.id} />
        {item.input === 'reminder-day' ? (
          <DayPicker name="reminderDay" defaultValue={reminderDay} />
        ) : null}
        {item.input === 'writing' ? (
          <Sheet
            prompt={item.prompt ?? 'Write it here'}
            name="body"
            keptFor={firstSonName}
            placeholder="Nobody else reads this."
          />
        ) : null}
      </ActionForm>

      <More label="Why this matters before you start">
        <Prose text={item.detail} className="text-ink-soft" />
        {item.scripture ? <Scripture reference={item.scripture} /> : null}
        <div className="flex flex-col gap-1">
          <ActionForm action={deferItem} variant="link" submitLabel="Put this off for now">
            <input type="hidden" name="itemId" value={item.id} />
          </ActionForm>
          <form action={skipGroundwork}>
            <button
              type="submit"
              className="-mx-2 inline-flex min-h-11 items-center rounded-lg px-2 text-sm
                         text-ink-faint hover:text-ink focus-visible:outline-2
                         focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              I&apos;ve done this before — skip the four weeks
            </button>
          </form>
        </div>
      </More>
    </section>
  )
}

export function ArcCard({
  item,
  child,
  mentor,
  alternatives,
  skip,
}: {
  item: ArcItem
  child: Child
  mentor?: Mentor
  alternatives: number
  skip: number
}) {
  return (
    <section className="flex flex-col gap-7">
      <Heading
        kicker={`This week · ${KIND_LABEL[item.kind]}`}
        title={titleFor(item, child.name, mentor?.name)}
      />
      <p className="text-ink-soft">{item.summary}</p>
      {item.weight === 'weighty' ? <WeightNote /> : null}

      <ActionForm
        action={setItemDone}
        submitLabel="We&rsquo;ve done this"
        pendingLabel="Marking…"
        footnote={item.scope === 'shared' ? 'Counts for every son' : undefined}
      >
        <input type="hidden" name="itemId" value={item.id} />
        <input type="hidden" name="childId" value={child.id} />
        <input type="hidden" name="done" value="true" />
      </ActionForm>

      <More label={disclosureLabel(item)}>
        {item.fatherFirst ? (
          <div className="flex flex-col gap-1.5">
            <p className="eyebrow text-brass">Go first</p>
            <p className="text-ink">{item.fatherFirst}</p>
          </div>
        ) : null}
        <p className="text-ink-soft">{item.detail}</p>
        {item.opener ? (
          <p className="font-display text-lg text-ink italic">{item.opener}</p>
        ) : null}
        {item.scripture ? <Scripture reference={item.scripture} /> : null}
        <div className="flex flex-col gap-1">
          <ActionForm action={deferItem} variant="link" submitLabel="Put this off for now">
            <input type="hidden" name="itemId" value={item.id} />
            <input type="hidden" name="childId" value={child.id} />
          </ActionForm>
          {alternatives > 0 ? (
            <Link
              href={`/?skip=${skip + 1}`}
              prefetch={false}
              className="-mx-2 inline-flex min-h-11 items-center rounded-lg px-2 text-sm text-accent"
            >
              Give me a different one this week
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
