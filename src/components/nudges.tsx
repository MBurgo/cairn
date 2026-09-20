import Link from 'next/link'
import type { ArcItem, Child, GroundworkItem, Mentor } from '@/lib/domain/types'
import { titleFor } from '@/lib/domain/content'
import { completeGroundwork, deferItem, setItemDone, skipGroundwork } from '@/app/actions'
import { ActionForm } from '@/components/action-form'
import { Card, DayPicker, Kicker, LinkButton, Prose, Sheet, WeightNote } from '@/components/ui'
import { Scripture } from '@/components/scripture'
import { sessionPath } from '@/components/session'

const KIND_LABEL: Record<ArcItem['kind'], string> = {
  conversation: 'a conversation',
  competency: 'something to teach him',
  experience: 'something to do together',
  rite: 'the occasion that closes this stage',
}

/**
 * The label names what is behind it. "Why this one, and how" was the app being
 * clever; a father wants to know whether opening it tells him what to say or
 * how to do it.
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
    <details className="group border-t border-t-card-soft/25">
      <summary
        className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4
                   text-sm text-card-soft [&::-webkit-details-marker]:hidden"
      >
        <span>{label}</span>
        <span aria-hidden="true" className="transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>
      <div className="flex flex-col gap-5 pt-2 pb-3">{children}</div>
    </details>
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
    <Card>
      <div className="flex flex-col gap-4">
        <Kicker>
          Getting ready · week {weekOf} of {total}
        </Kicker>
        <h1 className="instruction">{item.title}</h1>
        <p className="text-card-soft">{item.summary}</p>
      </div>

      <ActionForm
        action={completeGroundwork}
        submitLabel={stepLabel(weekOf, total)}
        pendingLabel="Saving…"
        onCard
        className="flex flex-col gap-5"
      >
        <input type="hidden" name="itemId" value={item.id} />
        {item.input === 'reminder-day' ? (
          <div className="rounded-md bg-card-ink/10 p-4">
            <DayPicker name="reminderDay" defaultValue={reminderDay} />
          </div>
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
        <Prose text={item.detail} className="text-card-soft" />
        {item.scripture ? <Scripture reference={item.scripture} onCard /> : null}
        <div className="flex flex-col gap-1">
          <ActionForm
            action={deferItem}
            variant="link"
            submitLabel="Put this off for now"
            onCard
          >
            <input type="hidden" name="itemId" value={item.id} />
          </ActionForm>
          <form action={skipGroundwork}>
            <button
              type="submit"
              className="-mx-2 inline-flex min-h-11 items-center rounded-lg px-2 text-sm
                         text-card-soft hover:text-card-ink"
            >
              I&apos;ve done this before — skip the four weeks
            </button>
          </form>
        </div>
      </More>
    </Card>
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
    <Card>
      <div className="flex flex-col gap-4">
        <Kicker>This week · {KIND_LABEL[item.kind]}</Kicker>
        <h1 className="instruction">{titleFor(item, child.name, mentor?.name)}</h1>
        <p className="text-card-soft">{item.summary}</p>
        {item.weight === 'weighty' ? <WeightNote /> : null}
      </div>

      {item.session ? (
        /*
         * For the five conversations the primary action is to run the thing,
         * not to record it. Knowing he should have the conversation was never
         * what stopped him. Recording it afterwards stays available, quietly,
         * for the father who had it in the car on Tuesday — making him click
         * through four screens to log that would be its own small insult.
         */
        <div className="flex flex-col gap-3">
          {item.session.cue ? (
            <p className="text-sm text-card-accent">{item.session.cue}</p>
          ) : null}
          <LinkButton
            href={sessionPath(item.id, child.id, item.session.cue ? undefined : 1)}
            onCard
          >
            {item.session.cue ? 'Read it through first' : 'Walk me through it'}
          </LinkButton>
          <ActionForm
            action={setItemDone}
            variant="link"
            submitLabel="We&rsquo;ve already done this"
            pendingLabel="Marking…"
            onCard
            footnote={item.scope === 'shared' ? 'Counts for every son' : undefined}
          >
            <input type="hidden" name="itemId" value={item.id} />
            <input type="hidden" name="childId" value={child.id} />
            <input type="hidden" name="done" value="true" />
          </ActionForm>
        </div>
      ) : (
        <ActionForm
          action={setItemDone}
          submitLabel="We&rsquo;ve done this"
          pendingLabel="Marking…"
          onCard
          footnote={item.scope === 'shared' ? 'Counts for every son' : undefined}
        >
          <input type="hidden" name="itemId" value={item.id} />
          <input type="hidden" name="childId" value={child.id} />
          <input type="hidden" name="done" value="true" />
        </ActionForm>
      )}

      <More label={disclosureLabel(item)}>
        {item.fatherFirst ? (
          <div className="flex flex-col gap-1.5">
            <p className="font-mono text-[0.65rem] tracking-widest text-card-accent uppercase">
              Go first
            </p>
            <p className="text-card-ink">{item.fatherFirst}</p>
          </div>
        ) : null}
        <p className="text-card-soft">{item.detail}</p>
        {item.opener ? (
          <p className="font-display text-lg text-card-ink italic">{item.opener}</p>
        ) : null}
        {item.scripture ? <Scripture reference={item.scripture} onCard /> : null}
        <div className="flex flex-col gap-1">
          <ActionForm action={deferItem} variant="link" submitLabel="Put this off for now" onCard>
            <input type="hidden" name="itemId" value={item.id} />
            <input type="hidden" name="childId" value={child.id} />
          </ActionForm>
          {alternatives > 0 ? (
            <Link
              href={`/?skip=${skip + 1}`}
              prefetch={false}
              className="-mx-2 inline-flex min-h-11 items-center rounded-lg px-2 text-sm
                         text-card-soft hover:text-card-ink"
            >
              Give me a different one this week
            </Link>
          ) : null}
          <p className="pt-1 text-sm text-card-soft">
            Nothing here is overdue, and Cairn doesn&apos;t keep score.
          </p>
        </div>
      </More>
    </Card>
  )
}
