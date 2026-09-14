import { redirect } from 'next/navigation'
import { getFamilyContext } from '@/lib/data/family'
import { getJournal } from '@/lib/data/journal'
import { groundworkById } from '@/lib/domain/content'
import { Masthead } from '@/components/masthead'
import { QuickCapture, QuickPrayer } from '@/components/quick'
import { PrayerReviewCard } from '@/components/prayer-review'
import { Notice } from '@/components/ui'

/**
 * Per-user content: never prerender this. A cached copy would be one
 * family's data served to another.
 */
export const dynamic = 'force-dynamic'

const OUTCOME_LABEL: Record<string, string> = {
  answered: 'Answered',
  changed: 'It changed',
  waiting: 'Still waiting',
  closed: 'Closed',
}

export default async function JournalPage() {
  const ctx = await getFamilyContext()
  if (!ctx) redirect('/login')
  if (!ctx.family) redirect('/setup')

  const journal = await getJournal(ctx.family.id)
  const nameOf = (id: string | null) =>
    id ? (ctx.children.find((c) => c.id === id)?.name ?? 'Him') : 'All of them'

  const waiting = journal.prayers.filter((p) => p.status === 'waiting')
  const closed = journal.prayers.filter((p) => p.status !== 'waiting')

  return (
    <>
      <Masthead email={ctx.userEmail} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pt-8 pb-12">
        <h1 className="font-display text-3xl">Journal</h1>
        <p className="mt-3 max-w-prose text-ink-soft">
          Everything here ends up in their books. Nothing in this section is ever asked of you —
          it&apos;s for whenever you have something worth keeping.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <QuickCapture sons={ctx.children} />
          <QuickPrayer sons={ctx.children} />
        </div>

        {journal.due.length > 0 ? (
          <section className="mt-12 flex flex-col gap-4">
            <p className="eyebrow">Waiting on an answer from you</p>
            {journal.due.map((prayer) => (
              <PrayerReviewCard
                key={prayer.id}
                prayer={prayer}
                childName={nameOf(prayer.childId)}
              />
            ))}
          </section>
        ) : null}

        <section className="mt-12 flex flex-col gap-4">
          <p className="eyebrow">What you&apos;ve written</p>
          {journal.captures.length === 0 ? (
            <Notice tone="info">
              Nothing yet. The first thing you write is usually something he said that you&apos;d
              otherwise have forgotten by Friday.
            </Notice>
          ) : (
            <div className="flex flex-col divide-y divide-rule border-y border-rule">
              {journal.captures.map((capture) => {
                const source = capture.sourceItemId ? groundworkById(capture.sourceItemId) : null
                return (
                  <article key={capture.id} className="flex flex-col gap-2 py-5">
                    <p className="font-mono text-xs tracking-wider text-ink-faint uppercase">
                      {capture.occurredOn} · {nameOf(capture.childId)}
                      {source?.captureLabel ? ` · ${source.captureLabel}` : ''}
                    </p>
                    <p className="whitespace-pre-wrap text-ink">{capture.body}</p>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        {waiting.length > 0 ? (
          <section className="mt-12 flex flex-col gap-4">
            <p className="eyebrow">Prayers still open</p>
            <div className="flex flex-col divide-y divide-rule border-y border-rule">
              {waiting.map((prayer) => (
                <article key={prayer.id} className="flex flex-col gap-1.5 py-5">
                  <p className="font-mono text-xs tracking-wider text-ink-faint uppercase">
                    {prayer.loggedOn} · {nameOf(prayer.childId)} · back on {prayer.nextReviewOn}
                  </p>
                  <p className="font-display text-lg italic">&ldquo;{prayer.body}&rdquo;</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {closed.length > 0 ? (
          <section className="mt-12 flex flex-col gap-4">
            <p className="eyebrow">Answered and closed</p>
            <div className="flex flex-col divide-y divide-rule border-y border-rule">
              {closed.map((prayer) => {
                const review = journal.reviews.find((r) => r.prayerId === prayer.id)
                return (
                  <article key={prayer.id} className="flex flex-col gap-1.5 py-5">
                    <p className="font-mono text-xs tracking-wider text-accent uppercase">
                      {prayer.loggedOn} · {nameOf(prayer.childId)} ·{' '}
                      {OUTCOME_LABEL[prayer.status] ?? prayer.status}
                    </p>
                    <p className="font-display text-lg italic">&ldquo;{prayer.body}&rdquo;</p>
                    {review?.note ? (
                      <p className="text-sm text-ink-soft">{review.note}</p>
                    ) : null}
                  </article>
                )
              })}
            </div>
          </section>
        ) : null}
      </main>
    </>
  )
}
