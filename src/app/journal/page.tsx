import { redirect } from 'next/navigation'
import { getFamilyContext } from '@/lib/data/family'
import { getJournal, type Capture, type Prayer } from '@/lib/data/journal'
import { groundworkById } from '@/lib/domain/content'
import { Masthead } from '@/components/masthead'
import { QuickCapture, QuickPrayer } from '@/components/quick'
import { PrayerReviewCard } from '@/components/prayer-review'
import { ActionForm } from '@/components/action-form'
import { deleteCapture, deletePrayer } from '@/app/actions'

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

function longDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function JournalPage() {
  const ctx = await getFamilyContext()
  if (!ctx) redirect('/login')
  if (!ctx.family) redirect('/setup')

  const journal = await getJournal(ctx.family.id)
  const nameOf = (id: string | null) =>
    id ? (ctx.children.find((c) => c.id === id)?.name ?? 'him') : 'All of them'

  const waiting = journal.prayers.filter((p) => p.status === 'waiting')
  const closed = journal.prayers.filter((p) => p.status !== 'waiting')

  return (
    <>
      <Masthead trailing={`${journal.captures.length + journal.prayers.length} kept`} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pt-12 pb-10">
        <h1 className="instruction">Everything going into their books</h1>
        <p className="mt-4 max-w-prose text-ink-soft">
          Nothing in here is ever asked of you. It&apos;s for whenever you have something worth
          keeping.
        </p>

        <div className="mt-12 flex flex-col gap-12">
          <QuickCapture sons={ctx.children} />
          <QuickPrayer sons={ctx.children} />
        </div>

        {journal.due.length > 0 ? (
          <section className="mt-16 flex flex-col gap-6">
            <p className="eyebrow">Waiting on an answer from you</p>
            {journal.due.map((prayer: Prayer) => (
              <PrayerReviewCard
                key={prayer.id}
                prayer={prayer}
                childName={nameOf(prayer.childId)}
              />
            ))}
          </section>
        ) : null}

        <section className="mt-16 flex flex-col gap-5">
          <p className="eyebrow">What you&apos;ve written</p>
          {journal.captures.length === 0 ? (
            <p className="max-w-prose text-ink-soft">
              Nothing here yet. Most fathers start with something their son said that they&apos;d
              otherwise have forgotten by Friday.
            </p>
          ) : (
            journal.captures.map((capture: Capture) => {
              const source = capture.sourceItemId ? groundworkById(capture.sourceItemId) : null
              return (
                <article key={capture.id} className="flex flex-col gap-2">
                  <div className="sheet flex flex-col gap-3 px-5 py-5">
                    <p className="stamp">
                      {nameOf(capture.childId)} · {longDate(capture.occurredOn)}
                      {source?.captureLabel ? ` · ${source.captureLabel}` : ''}
                    </p>
                    <p className="written whitespace-pre-wrap">{capture.body}</p>
                  </div>
                  <ActionForm
                    action={deleteCapture}
                    variant="link"
                    submitLabel="Delete this"
                    pendingLabel="Deleting…"
                    destructive
                    className="flex"
                  >
                    <input type="hidden" name="id" value={capture.id} />
                  </ActionForm>
                </article>
              )
            })
          )}
        </section>

        {waiting.length > 0 ? (
          <section className="mt-16 flex flex-col gap-5">
            <p className="eyebrow">Prayers still open</p>
            {waiting.map((prayer: Prayer) => (
              <article key={prayer.id} className="flex flex-col gap-2">
                <div className="sheet flex flex-col gap-3 px-5 py-5">
                  <p className="stamp">
                    {nameOf(prayer.childId)} · {longDate(prayer.loggedOn)}
                  </p>
                  <p className="written italic">{prayer.body}</p>
                  <p className="stamp">Comes back to you on {longDate(prayer.nextReviewOn)}</p>
                </div>
                <ActionForm
                  action={deletePrayer}
                  variant="link"
                  submitLabel="Delete this"
                  pendingLabel="Deleting…"
                  destructive
                  className="flex"
                >
                  <input type="hidden" name="id" value={prayer.id} />
                </ActionForm>
              </article>
            ))}
          </section>
        ) : null}

        {closed.length > 0 ? (
          <section className="mt-16 flex flex-col gap-5">
            <p className="eyebrow">Answered, and what came of them</p>
            {closed.map((prayer: Prayer) => {
              const review = journal.reviews.find((r) => r.prayerId === prayer.id)
              return (
                <div key={prayer.id} className="sheet flex flex-col gap-3 px-5 py-5">
                  <p className="stamp">
                    {nameOf(prayer.childId)} · {longDate(prayer.loggedOn)} ·{' '}
                    {OUTCOME_LABEL[prayer.status] ?? prayer.status}
                  </p>
                  <p className="written italic">{prayer.body}</p>
                  {review?.note ? (
                    <>
                      <div className="h-px bg-paper-edge" />
                      <p className="written">{review.note}</p>
                    </>
                  ) : null}
                </div>
              )
            })}
          </section>
        ) : null}
      </main>
    </>
  )
}
