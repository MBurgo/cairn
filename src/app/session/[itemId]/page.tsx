import { redirect } from 'next/navigation'
import { getFamilyContext } from '@/lib/data/family'
import { itemById, withName } from '@/lib/domain/content'
import { CloseSession, SessionPreview, SessionStep, stepsOf } from '@/components/session'

/**
 * Per-user content: never prerender this. A cached copy would be one family's
 * son named on another family's screen.
 */
export const dynamic = 'force-dynamic'

/**
 * A session, run with his son in the room.
 *
 * Deliberately server-rendered with no client state, for two reasons. A father
 * halfway through a conversation about death will be interrupted, and a page
 * that survives being backgrounded is worth more than one that animates; and
 * making each step its own URL means the browser's back button walks the steps
 * without any work from us.
 *
 * Nothing is saved until the last step. Closing at step two is not a dropped
 * funnel — it almost always means the conversation went somewhere better than
 * the script, which is the outcome we want. So there is no resume, no partial
 * state, and nothing anywhere that says he left something unfinished.
 */
export default async function SessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ itemId: string }>
  searchParams: Promise<{ child?: string; step?: string }>
}) {
  const ctx = await getFamilyContext()
  if (!ctx) redirect('/login')
  if (!ctx.family) redirect('/setup')

  const { itemId } = await params
  const { child: childId, step: rawStep } = await searchParams

  const item = itemById(itemId)
  if (!item?.session) redirect('/')

  // Never trust the id in the URL: it decides whose name is printed on the page.
  const child = ctx.children.find((c) => c.id === childId)
  if (!child) redirect('/')

  const total = stepsOf(item.session).length
  const step = Number(rawStep)
  const onStep = Number.isInteger(step) && step >= 1 && step <= total

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-5 pt-6 pb-12">
      <CloseSession />

      {onStep ? (
        <>
          {/* Enough context that a step screen isn't a sentence floating in the dark. */}
          <p className="text-sm text-ink-faint">{withName(item.title, child.name)}</p>
          <SessionStep item={item} child={child} step={step} />
        </>
      ) : (
        <SessionPreview item={item} child={child} />
      )}
    </main>
  )
}
