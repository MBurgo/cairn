import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getFamilyContext } from '@/lib/data/family'
import { supabaseEnv } from '@/lib/supabase/env'
import { clockFor } from '@/lib/domain/clock'
import {
  alternativeCount,
  completionKey,
  groundworkProgress,
  weeklyNudge,
  type NudgeState,
} from '@/lib/domain/nudge'
import { GROUNDWORK, itemsForStage } from '@/lib/domain/content'
import { getJournal } from '@/lib/data/journal'
import { Notice } from '@/components/ui'
import { Masthead } from '@/components/masthead'
import { ArcCard, GroundworkCard } from '@/components/nudges'
import { QuickCapture, QuickPrayer } from '@/components/quick'
import { PrayerReviewCard } from '@/components/prayer-review'

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
        <h1 className="font-display text-3xl">Cairn isn&apos;t connected yet</h1>
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
  }

  const nudge = weeklyNudge(state, new Date(), skip)
  const groundwork = groundworkProgress(state)
  const alternatives = alternativeCount(state)
  const journal = await getJournal(ctx.family.id)
  const nameOf = (id: string | null) =>
    id ? (ctx.children.find((c) => c.id === id)?.name ?? 'Him') : 'All of them'
  const recent = journal.captures.slice(0, 3)

  return (
    <>
      <Masthead email={ctx.userEmail} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pt-8 pb-12">
        {/* ---- This week: exactly one thing, however many sons ---- */}
        <section className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-4">
            <p className="eyebrow">{groundwork.complete ? 'This week' : 'Before you start'}</p>
            {!groundwork.complete ? (
              <p className="font-mono text-xs text-ink-faint tabular-nums">
                {groundwork.done} of {groundwork.total} done
              </p>
            ) : null}
          </div>

          {nudge?.type === 'groundwork' ? (
            <GroundworkCard
              item={nudge.item}
              weekOf={nudge.item.order}
              total={GROUNDWORK.length}
              reminderDay={ctx.family.reminderDay}
            />
          ) : null}

          {nudge?.type === 'arc' ? (
            <ArcCard item={nudge.item} child={nudge.child} alternatives={alternatives} skip={skip} />
          ) : null}

          {!nudge ? (
            <Notice tone="info">
              {ctx.children.length === 0
                ? 'Add a son and the arc will start.'
                : 'Nothing outstanding right now. Either your sons are too young for the arc yet, or you are genuinely ahead.'}
            </Notice>
          ) : null}

          {skip > 0 && nudge?.type === 'arc' ? (
            <Link href="/" className="self-start text-sm text-ink-faint hover:text-ink">
              ← Back to this week&apos;s
            </Link>
          ) : null}

          {nudge ? (
            <p className="text-sm text-ink-faint">
              Nothing here is overdue, and Cairn doesn&apos;t keep score. If this isn&apos;t the
              week for it, leave it — it will still be here.
            </p>
          ) : null}
        </section>

        {/* ---- Always available, whatever this week's thing is ---- */}
        <section className="mt-10 flex flex-col gap-3">
          <p className="eyebrow">Any time</p>
          <QuickCapture sons={ctx.children} />
          <QuickPrayer sons={ctx.children} />
        </section>

        {/* ---- Prayers that have come back to ask what happened ---- */}
        {journal.due.length > 0 ? (
          <section className="mt-12 flex flex-col gap-4">
            <p className="eyebrow">You prayed this a while ago</p>
            <PrayerReviewCard prayer={journal.due[0]} childName={nameOf(journal.due[0].childId)} />
            {journal.due.length > 1 ? (
              <Link href="/journal" className="self-start text-sm font-medium text-accent underline">
                {journal.due.length - 1} more waiting on you
              </Link>
            ) : null}
          </section>
        ) : null}

        {/* ---- Where each boy is up to ---- */}
        {ctx.children.length > 0 ? (
          <section className="mt-12 flex flex-col gap-4">
            <p className="eyebrow">Your sons</p>
            <div className="flex flex-col divide-y divide-rule border-y border-rule">
              {ctx.children.map((child) => {
                const clock = clockFor(child)
                const items = clock.stage ? itemsForStage(clock.stage.key) : []
                const done = items.filter((i) =>
                  ctx.completed.has(completionKey(i, child.id))
                ).length
                return (
                  <div key={child.id} className="flex flex-col gap-1.5 py-5">
                    <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                      <p className="font-display text-xl">{child.name}</p>
                      <p className="font-mono text-sm text-ink-soft">{clock.age}</p>
                      {clock.stage ? (
                        <p className="font-mono text-sm text-brass tabular-nums">
                          {clock.summersLeft} summers left
                        </p>
                      ) : null}
                    </div>
                    <p className="text-sm text-ink-soft">
                      {clock.stage
                        ? `Stage ${clock.stage.number} — ${clock.stage.name} · ${done} of ${items.length} done`
                        : clock.age < 8
                          ? `The arc starts at eight — ${clock.daysToNextBirthday} days to his next birthday.`
                          : 'Past the arc.'}
                    </p>
                  </div>
                )
              })}
            </div>
          </section>
        ) : null}

        {/* ---- A bit of history, so it reads as a place rather than a task ---- */}
        {recent.length > 0 ? (
          <section className="mt-12 flex flex-col gap-4">
            <p className="eyebrow">Lately</p>
            <div className="flex flex-col divide-y divide-rule border-y border-rule">
              {recent.map((capture) => (
                <article key={capture.id} className="flex flex-col gap-1.5 py-4">
                  <p className="font-mono text-xs tracking-wider text-ink-faint uppercase">
                    {capture.occurredOn} · {nameOf(capture.childId)}
                  </p>
                  <p className="line-clamp-3 text-sm text-ink-soft">{capture.body}</p>
                </article>
              ))}
            </div>
            <Link href="/journal" className="self-start text-sm font-medium text-accent underline">
              Everything you&apos;ve written
            </Link>
          </section>
        ) : null}
      </main>
    </>
  )
}
