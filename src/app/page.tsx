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
import { Notice } from '@/components/ui'
import { Masthead } from '@/components/masthead'
import { ArcCard, GroundworkCard } from '@/components/nudges'

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
        </section>

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
      </main>
    </>
  )
}
