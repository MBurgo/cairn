import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getFamilyContext } from '@/lib/data/family'
import { getJournal } from '@/lib/data/journal'
import { supabaseEnv } from '@/lib/supabase/env'
import { clockFor } from '@/lib/domain/clock'
import {
  alternativeCount,
  completionKey,
  weeklyNudge,
  type NudgeState,
} from '@/lib/domain/nudge'
import { GROUNDWORK, itemsForStage } from '@/lib/domain/content'
import { Notice } from '@/components/ui'
import { Masthead } from '@/components/masthead'
import { ArcCard, GroundworkCard } from '@/components/nudges'
import { PrayerReviewCard } from '@/components/prayer-review'

/**
 * Per-user content: never prerender this. A cached copy would be one
 * family's data served to another.
 */
export const dynamic = 'force-dynamic'

/** A tappable row. Deliberately not a card — only the week's thing gets one. */
function Row({
  href,
  label,
  trailing,
}: {
  href: string
  label: string
  trailing?: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="flex min-h-14 items-center justify-between gap-4 py-1 text-ink hover:text-accent"
    >
      <span className="font-display text-lg">{label}</span>
      <span className="text-ink-faint">{trailing ?? '›'}</span>
    </Link>
  )
}

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
    mentors: ctx.mentors,
    lastActivityOn: ctx.lastProgressOn,
  }

  const nudge = weeklyNudge(state, new Date(), skip)
  const alternatives = alternativeCount(state)
  const journal = await getJournal(ctx.family.id)
  const nameOf = (id: string | null) =>
    id ? (ctx.children.find((c) => c.id === id)?.name ?? 'Him') : 'All of them'
  const latest = journal.captures[0]

  return (
    <>
      <Masthead email={ctx.userEmail} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pt-10 pb-16">
        {/* ---- One thing. Everything else on this screen is quieter than it. ---- */}
        {nudge?.type === 'groundwork' ? (
          <GroundworkCard
            item={nudge.item}
            weekOf={nudge.item.order}
            total={GROUNDWORK.length}
            reminderDay={ctx.family.reminderDay}
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
              ? 'Add a son and the arc will start.'
              : 'Nothing outstanding right now. Either your sons are too young for the arc yet, or you are genuinely ahead.'}
          </Notice>
        ) : null}

        {skip > 0 && nudge?.type === 'arc' ? (
          <Link href="/" className="mt-5 inline-block text-sm text-ink-faint hover:text-ink">
            ← Back to this week&apos;s
          </Link>
        ) : null}

        {/* ---- Available whatever this week's thing is ---- */}
        <section className="mt-12 flex flex-col divide-y divide-rule border-y border-rule">
          <Row href="/journal" label="Write something down" />
          {ctx.children.length > 0 ? (
            <Row href="/journal" label="Pray something over him" />
          ) : null}
        </section>

        {/* ---- A prayer that has come back to ask what happened ---- */}
        {journal.due.length > 0 ? (
          <section className="mt-12 flex flex-col gap-4">
            <p className="eyebrow">You prayed this a while ago</p>
            <PrayerReviewCard prayer={journal.due[0]} childName={nameOf(journal.due[0].childId)} />
            {journal.due.length > 1 ? (
              <Link href="/journal" className="text-sm font-medium text-accent underline">
                {journal.due.length - 1} more waiting on you
              </Link>
            ) : null}
          </section>
        ) : null}

        {/* ---- Where each boy is up to ---- */}
        {ctx.children.length > 0 ? (
          <section className="mt-12 flex flex-col divide-y divide-rule border-y border-rule">
            {ctx.children.map((child) => {
              const clock = clockFor(child)
              const items = clock.stage ? itemsForStage(clock.stage.key) : []
              const done = items.filter((i) => ctx.completed.has(completionKey(i, child.id))).length
              return (
                <div key={child.id} className="flex items-baseline justify-between gap-4 py-4">
                  <p className="font-display text-lg">
                    {child.name}, {clock.age}
                  </p>
                  <p className="font-mono text-sm text-ink-faint tabular-nums">
                    {clock.stage
                      ? `${clock.summersLeft} summers · ${done}/${items.length}`
                      : clock.age < 8
                        ? 'starts at 8'
                        : 'past the arc'}
                  </p>
                </div>
              )
            })}
          </section>
        ) : null}

        {/* ---- A bit of history, so it reads as a place rather than a task ---- */}
        {latest ? (
          <section className="mt-12 flex flex-col gap-3">
            <p className="eyebrow">Lately</p>
            <p className="kept line-clamp-3">{latest.body}</p>
            <Link href="/journal" className="text-sm font-medium text-accent underline">
              Everything you&apos;ve written
            </Link>
          </section>
        ) : null}
      </main>
    </>
  )
}
