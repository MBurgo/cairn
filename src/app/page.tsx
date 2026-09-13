import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getFamilyContext } from '@/lib/data/family'
import { supabaseEnv } from '@/lib/supabase/env'
import { clockFor } from '@/lib/domain/clock'
import { weeklyNudge } from '@/lib/domain/nudge'
import { addSon, setItemDone } from '@/app/actions'
import { Field, Notice } from '@/components/ui'
import { Masthead } from '@/components/masthead'
import { ActionForm } from '@/components/action-form'

/**
 * Per-user content: never prerender this. A cached copy would be one
 * family's data served to another.
 */
export const dynamic = 'force-dynamic'

const KIND_LABEL: Record<string, string> = {
  conversation: 'A conversation',
  competency: 'Something to teach him',
  experience: 'Something to do together',
  rite: 'The rite that closes the stage',
}

export default async function HomePage() {
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

  const nudge = weeklyNudge(ctx.children, ctx.completed)
  const today = new Date().toISOString().slice(0, 10)

  return (
    <>
      <Masthead email={ctx.userEmail} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10">
        {/* ---- This week: exactly one thing, however many sons ---- */}
        <section className="flex flex-col gap-4">
          <p className="eyebrow">This week</p>
          {nudge ? (
            <div className="flex flex-col gap-4 rounded-sm border border-rule bg-raised p-6">
              <p className="font-mono text-xs tracking-wider text-accent uppercase">
                {KIND_LABEL[nudge.item.kind]} · {nudge.child.name}
              </p>
              <h1 className="font-display text-2xl leading-snug">{nudge.item.title}</h1>
              <p className="text-ink-soft">{nudge.item.detail}</p>
              {nudge.item.opener ? (
                <p className="border-l-2 border-l-accent bg-surface px-4 py-3 font-display text-lg italic">
                  {nudge.item.opener}
                </p>
              ) : null}
              {nudge.item.scripture ? (
                <p className="font-mono text-xs tracking-wider text-accent uppercase">
                  {nudge.item.scripture}
                </p>
              ) : null}
              <ActionForm
                action={setItemDone}
                submitLabel="We've done this"
                pendingLabel="Marking…"
                footnote={nudge.item.scope === 'shared' ? 'Counts for every son' : undefined}
              >
                <input type="hidden" name="itemId" value={nudge.item.id} />
                <input type="hidden" name="childId" value={nudge.child.id} />
                <input type="hidden" name="done" value="true" />
              </ActionForm>
            </div>
          ) : (
            <Notice tone="info">
              {ctx.children.length === 0
                ? 'Add a son below and the arc will start.'
                : 'Nothing outstanding for this stage. Either add his brother, or enjoy being ahead.'}
            </Notice>
          )}
        </section>

        {/* ---- The clock, per son ---- */}
        <section className="mt-12 flex flex-col gap-4">
          <p className="eyebrow">Time left</p>
          <div className="flex flex-col divide-y divide-rule border-y border-rule">
            {ctx.children.map((child) => {
              const clock = clockFor(child)
              return (
                <div key={child.id} className="flex flex-wrap items-baseline gap-x-6 gap-y-2 py-5">
                  <p className="font-display text-xl">{child.name}</p>
                  <p className="font-mono text-sm text-ink-soft">{clock.age} years old</p>
                  <p className="font-mono text-sm text-brass tabular-nums">
                    {clock.summersLeft} summers left
                  </p>
                  <p className="w-full text-sm text-ink-soft">
                    {clock.stage
                      ? `Stage ${clock.stage.number} — ${clock.stage.name}. Reading ${clock.stage.spineText}.`
                      : clock.age < 8
                        ? `The arc starts at eight. ${clock.daysToNextBirthday} days to his next birthday.`
                        : 'Past the arc.'}
                  </p>
                </div>
              )
            })}
          </div>
          <Link href="/arc" className="self-start text-sm font-medium text-accent underline">
            See the whole stage
          </Link>
        </section>

        {/* ---- Add a brother ---- */}
        <section className="mt-12 flex flex-col gap-4">
          <p className="eyebrow">Add another son</p>
          <ActionForm
            action={addSon}
            submitLabel="Add him"
            pendingLabel="Adding…"
            className="flex flex-col gap-4 rounded-sm border border-rule bg-raised p-6"
          >
            <Field label="His name" name="name" />
            <Field label="Date of birth" name="birthdate" type="date" max={today} />
          </ActionForm>
        </section>
      </main>
    </>
  )
}
