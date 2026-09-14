import Link from 'next/link'
import type { ArcItem, Child, GroundworkItem } from '@/lib/domain/types'
import { completeGroundwork, deferItem, setItemDone, skipGroundwork } from '@/app/actions'
import { ActionForm } from '@/components/action-form'
import { DayPicker, Prose, TextArea, WeightNote } from '@/components/ui'
import { Scripture } from '@/components/scripture'

const KIND_LABEL: Record<ArcItem['kind'], string> = {
  conversation: 'A conversation',
  competency: 'Something to teach him',
  experience: 'Something to do together',
  rite: 'The rite that closes the stage',
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-sm border border-rule bg-raised p-6">
      {children}
    </div>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs tracking-wider text-accent uppercase">{children}</p>
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
    <Card>
      <Eyebrow>
        Before you start · {weekOf} of {total}
      </Eyebrow>
      <h1 className="font-display text-2xl leading-snug">{item.title}</h1>
      <Prose text={item.detail} className="text-ink-soft" />
      {item.scripture ? <Scripture reference={item.scripture} /> : null}

      <ActionForm
        action={completeGroundwork}
        submitLabel={item.input === 'acknowledge' ? "I've said it" : 'Save and continue'}
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

      <div className="flex flex-wrap items-center gap-4 border-t border-rule-soft pt-4">
        <ActionForm
          action={deferItem}
          variant="link"
          submitLabel="Not this week"
          className="flex"
        >
          <input type="hidden" name="itemId" value={item.id} />
        </ActionForm>
        <form action={skipGroundwork}>
          <button type="submit" className="text-sm text-ink-faint hover:text-ink">
            I know how this works — skip ahead
          </button>
        </form>
      </div>
    </Card>
  )
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
    <Card>
      <Eyebrow>
        {KIND_LABEL[item.kind]} · {child.name}
      </Eyebrow>
      <h1 className="font-display text-2xl leading-snug">{item.title}</h1>
      <p className="text-ink-soft">{item.detail}</p>
      {item.opener ? (
        <p className="border-l-2 border-l-accent bg-surface px-4 py-3 font-display text-lg italic">
          {item.opener}
        </p>
      ) : null}
      {item.scripture ? <Scripture reference={item.scripture} /> : null}
      {item.weight === 'weighty' ? <WeightNote /> : null}

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

      <div className="flex flex-wrap items-center gap-5 border-t border-rule-soft pt-4">
        <ActionForm action={deferItem} variant="link" submitLabel="Not yet" className="flex">
          <input type="hidden" name="itemId" value={item.id} />
          <input type="hidden" name="childId" value={child.id} />
        </ActionForm>
        {alternatives > 0 ? (
          <Link
            href={`/?skip=${skip + 1}`}
            className="text-sm font-medium text-accent underline"
            prefetch={false}
          >
            Show me something else
          </Link>
        ) : null}
      </div>
    </Card>
  )
}
