import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getFamilyContext } from '@/lib/data/family'
import { getJournal } from '@/lib/data/journal'
import { supabaseEnv } from '@/lib/supabase/env'
import { birthdaysPhrase, clockFor } from '@/lib/domain/clock'
import { alternativeCount, completionKey, weeklyNudge, type NudgeState } from '@/lib/domain/nudge'
import { GROUNDWORK, itemsForStage } from '@/lib/domain/content'
import { Notice, QuietRow } from '@/components/ui'
import { Masthead } from '@/components/masthead'
import { ArcCard, GroundworkCard } from '@/components/nudges'
import { PrayerReviewCard } from '@/components/prayer-review'
import { InlineCapture } from '@/components/inline-capture'

/**
 * Per-user content: never prerender this. A cached copy would be one
 * family's data served to another.
 */
export const dynamic = 'force-dynamic'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ skip?: string }>
}) {
  if (!supabaseEnv()) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-16">
        <h1 className="heading">Cairn isn&apos;t connected yet</h1>
        <p className="mt-4 text-ink-soft">
          Set <code className="font-mono text-sm">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
          <code className="font-mono text-sm">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>, then
          redeploy.
        </p>
      </main>
    )
  }

  const ctx = await getFamilyContext()
  if (!ctx) redirect('/login')
  if (!ctx.family) redirect('/setup')

  const skip = Number((await searchParams).skip ?? 0) || 0
  const state: NudgeState = {
    children: ctx.children,
    completed: ctx.completed,
    deferred: ctx.deferred,
    groundworkSkipped: ctx.family.groundworkSkipped,
    mentors: ctx.mentors,
    lastActivityOn: ctx.lastProgressOn,
  }

  const nudge = weeklyNudge(state, new Date(), skip)
  const alternatives = alternativeCount(state)
  const journal = await getJournal(ctx.family.id)
  const nameOf = (id: string | null) =>
    id ? (ctx.children.find((c) => c.id === id)?.name ?? 'him') : 'all of them'

  // The quiet line the whole product turns on, stated once and never as a bar.
  const subject = nudge?.type === 'arc' ? nudge.child : ctx.children[0]
  const subjectClock = subject ? clockFor(subject) : null

  return (
    <>
      <Masthead />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-12 px-5 pt-8 pb-10">
        {/* ---- Where he is, said plainly. No bar, no percentage. ---- */}
        {subject && subjectClock ? (
          <p className="flex flex-wrap items-baseline gap-x-3 text-sm text-ink-soft">
            <span className="font-display text-lg text-ink">{subject.name}</span>
            <span>
              {subjectClock.stage ? `${subjectClock.stage.name} · ` : ''}
              {birthdaysPhrase(subjectClock, 'long')}
            </span>
          </p>
        ) : null}

        {/* ---- The one thing, on the card ---- */}
        {nudge?.type === 'groundwork' ? (
          <GroundworkCard
            item={nudge.item}
            weekOf={nudge.item.order}
            total={GROUNDWORK.length}
            reminderDay={ctx.family.reminderDay}
            firstSonName={ctx.children[0]?.name}
          />
        ) : null}

        {nudge?.type === 'arc' ? (
          <ArcCard
            item={nudge.item}
            child={nudge.child}
            mentor={nudge.mentor}
            alternatives={alternatives}
            skip={skip}
          />
        ) : null}

        {!nudge ? (
          <Notice tone="info">
            {ctx.children.length === 0
              ? 'Add a son and the plan will start.'
              : 'Nothing outstanding right now. Either your sons are too young for the plan yet, or you are genuinely ahead.'}
          </Notice>
        ) : null}

        {skip > 0 && nudge?.type === 'arc' ? (
          <Link href="/" className="-mt-8 text-sm text-ink-faint hover:text-ink">
            ← Back to this week&apos;s
          </Link>
        ) : null}

        {/* ---- A prayer that has come back to ask what happened ---- */}
        {journal.due.length > 0 ? (
          <section className="flex flex-col gap-5">
            <p className="eyebrow">You prayed this a while ago</p>
            <PrayerReviewCard prayer={journal.due[0]} childName={nameOf(journal.due[0].childId)} />
            {journal.due.length > 1 ? (
              <Link href="/journal" className="text-sm text-rust underline underline-offset-4">
                {journal.due.length - 1} more waiting on you
              </Link>
            ) : null}
          </section>
        ) : null}

        {/* ---- Thirty seconds, whatever else the week holds ---- */}
        {ctx.children.length > 0 ? (
          <section className="flex flex-col gap-4">
            <p className="eyebrow">Write it down before you forget</p>
            <InlineCapture sons={ctx.children} />
          </section>
        ) : null}

        {/* ---- Everything else, receding ---- */}
        <section className="flex flex-col">
          <QuietRow
            href="/journal"
            label="Everything you&rsquo;ve kept"
            trailing={
              journal.captures.length + journal.prayers.length > 0
                ? `${journal.captures.length + journal.prayers.length}`
                : undefined
            }
          />
          {ctx.children.map((child) => {
            const clock = clockFor(child)
            const items = clock.stage ? itemsForStage(clock.stage.key) : []
            const done = items.filter((i) => ctx.completed.has(completionKey(i, child.id))).length
            return (
              <QuietRow
                key={child.id}
                href="/arc"
                label={`${child.name}, ${clock.age}`}
                trailing={
                  clock.stage
                    ? `${clock.stage.name} · ${done}/${items.length}`
                    : clock.age < 8
                      ? 'starts at 8'
                      : 'past the plan'
                }
              />
            )
          })}
        </section>
      </main>
    </>
  )
}
