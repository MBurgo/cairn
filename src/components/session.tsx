import Link from 'next/link'
import { withName } from '@/lib/domain/content'
import { completeSession } from '@/app/actions'
import { ActionForm } from '@/components/action-form'
import { Card, Check, Kicker, LinkButton, Sheet } from '@/components/ui'
import { Scripture } from '@/components/scripture'
import type { ArcItem, Child, Session, StepKey } from '@/lib/domain/types'

const DEFAULT_ORDER: StepKey[] = ['read', 'talk', 'do', 'pray']

const STEP_NAME: Record<StepKey, string> = {
  read: 'Read',
  talk: 'Talk',
  do: 'Do',
  pray: 'Pray',
}

/** The order this session runs in. Only the death conversation departs from it. */
export function stepsOf(session: Session): StepKey[] {
  return [...(session.order ?? DEFAULT_ORDER)]
}

/** Omit the step to land on the page he reads through before calling his son over. */
export function sessionPath(itemId: string, childId: string, step?: number): string {
  const base = `/session/${encodeURIComponent(itemId)}?child=${encodeURIComponent(childId)}`
  return step ? `${base}&step=${step}` : base
}

/**
 * On the card a session reads as the opposite of the ground; on the page he
 * reads beforehand it is ordinary ink on stone. Same words either way.
 */
function tones(onCard: boolean) {
  return {
    body: onCard ? 'text-card-ink' : 'text-ink',
    soft: onCard ? 'text-card-soft' : 'text-ink-soft',
    accent: onCard ? 'text-card-accent' : 'text-rust',
  }
}

/**
 * One step, with nothing else on it.
 *
 * Everything here is sized to be taken in at a glance and the phone lowered.
 * The long prose — why this one matters, how it tends to go — is deliberately
 * not in a session: it lives on the card, where he reads it beforehand.
 */
function StepBody({
  item,
  child,
  step,
  onCard,
}: {
  item: ArcItem
  child: Child
  step: StepKey
  onCard: boolean
}) {
  const session = item.session!
  const t = tones(onCard)
  const name = child.name

  if (step === 'read') {
    return (
      <div className="flex flex-col gap-5">
        {/* Loud on the step screen, ordinary on the page he reads beforehand. */}
        <Scripture reference={item.scripture!} onCard={onCard} aloud={onCard} />
        <p className={t.soft}>{withName(session.read, name)}</p>
      </div>
    )
  }

  if (step === 'talk') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className={`font-mono text-[0.65rem] tracking-widest uppercase ${t.accent}`}>
            Go first
          </p>
          <p className={t.body}>{withName(item.fatherFirst!, name)}</p>
        </div>
        <div className="flex flex-col gap-3">
          <p className={`font-mono text-[0.65rem] tracking-widest uppercase ${t.accent}`}>
            Then ask
          </p>
          <p className={`font-display text-xl leading-snug italic ${t.body}`}>
            {withName(item.opener!, name)}
          </p>
          <ul className={`flex flex-col gap-2 ${t.soft}`}>
            {session.ask.map((question) => (
              <li key={question}>{withName(question, name)}</li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  if (step === 'do') {
    return (
      <p className={`font-display text-xl leading-relaxed ${t.body}`}>
        {withName(session.do, name)}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {session.prayAlone ? (
        <p className={`text-sm ${t.accent}`}>
          Not in the room. Pray this on your own, once he has gone to bed.
        </p>
      ) : null}
      <p className={`font-display text-xl leading-snug italic ${t.body}`}>
        {withName(session.pray, name)}
      </p>
      <p className={`text-sm ${t.soft}`}>
        {session.prayAlone
          ? 'Use these words or your own.'
          : 'Use these words or your own — either way, out loud and over him.'}
      </p>
    </div>
  )
}

/**
 * The step screens.
 *
 * Apple's guidance for a multi-step flow is one word in the middle and a clear
 * end: the card's button is the "get started", so the steps say Continue and
 * the last one says Done. Nothing here counts anything — a father is told
 * which step he is on, and never how long he has taken or how many he has run.
 */
export function SessionStep({
  item,
  child,
  step,
}: {
  item: ArcItem
  child: Child
  /** One-based, already clamped by the route. */
  step: number
}) {
  const session = item.session!
  const steps = stepsOf(session)
  const key = steps[step - 1]
  const isLast = step === steps.length

  return (
    <Card>
      <Kicker>
        {STEP_NAME[key]} · step {step} of {steps.length}
      </Kicker>

      <StepBody item={item} child={child} step={key} onCard />

      {isLast ? (
        <ActionForm
          action={completeSession}
          submitLabel="Done"
          pendingLabel="Marking…"
          onCard
          className="flex flex-col gap-5"
          footnote={item.scope === 'shared' ? 'Counts for every son' : undefined}
        >
          {/*
           * Two things he can keep, both skipped by leaving them alone. They
           * sit here rather than on a fifth screen, because a fifth screen is
           * a fifth chance to bail — and because this is the one moment he has
           * something to say and it is still fresh.
           */}
          <Sheet
            prompt={
              item.scope === 'shared'
                ? 'What did you notice in them just then?'
                : `What did you notice in ${child.name} just then?`
            }
            name="notice"
            rows={3}
            placeholder="One line is plenty. Nobody else reads this."
            keptFor={item.scope === 'shared' ? undefined : child.name}
          />
          {/* A prayer is filed under one son, so a shared session cannot keep one. */}
          {item.scope === 'shared' ? null : (
            <Check
              name="keepPrayer"
              onCard
              label="Keep this prayer, and ask me in a few months what happened."
            />
          )}
          <input type="hidden" name="itemId" value={item.id} />
          <input type="hidden" name="childId" value={child.id} />
        </ActionForm>
      ) : (
        <LinkButton href={sessionPath(item.id, child.id, step + 1)} onCard>
          Continue
        </LinkButton>
      )}
    </Card>
  )
}

/**
 * All four steps on one page, to read before calling his son over.
 *
 * This is offered as a real path rather than a fallback. The best run of a
 * session is the one where the phone stays in his pocket, and a father who
 * reads this and then does the thing from memory has not leaked out of a
 * funnel — he has used it exactly as intended.
 */
export function SessionPreview({ item, child }: { item: ArcItem; child: Child }) {
  const session = item.session!
  const steps = stepsOf(session)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="eyebrow">Before you start</p>
        <h1 className="heading">{withName(item.title, child.name)}</h1>
        {session.cue ? <p className="text-sm text-rust">{session.cue}</p> : null}
      </div>

      {steps.map((key, i) => (
        <section key={key} className="flex flex-col gap-3">
          <p className="eyebrow">
            {STEP_NAME[key]} · {i + 1} of {steps.length}
          </p>
          <StepBody item={item} child={child} step={key} onCard={false} />
        </section>
      ))}

      <div className="flex flex-col gap-3">
        <LinkButton href={sessionPath(item.id, child.id, 1)}>Walk me through it</LinkButton>
        <p className="text-center text-sm text-ink-faint">
          One step at a time, with him there. Leave whenever you like — nothing is recorded until
          the end.
        </p>
      </div>
    </div>
  )
}

/** Quiet way out, on every screen of a session. Leaving saves nothing. */
export function CloseSession() {
  return (
    <Link href="/" prefetch={false} className="text-sm text-ink-faint hover:text-ink">
      ← Close
    </Link>
  )
}
