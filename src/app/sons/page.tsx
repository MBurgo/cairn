import { redirect } from 'next/navigation'
import { getFamilyContext } from '@/lib/data/family'
import { clockFor } from '@/lib/domain/clock'
import { addSon } from '@/app/actions'
import { Field } from '@/components/ui'
import { Masthead } from '@/components/masthead'
import { ActionForm } from '@/components/action-form'

/**
 * Per-user content: never prerender this. A cached copy would be one
 * family's data served to another.
 */
export const dynamic = 'force-dynamic'

export default async function SonsPage() {
  const ctx = await getFamilyContext()
  if (!ctx) redirect('/login')
  if (!ctx.family) redirect('/setup')

  const today = new Date().toISOString().slice(0, 10)

  return (
    <>
      <Masthead email={ctx.userEmail} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pt-8 pb-12">
        <h1 className="font-display text-3xl">{ctx.family.name}</h1>

        <section className="mt-8 flex flex-col gap-4">
          <p className="eyebrow">Your sons</p>
          {ctx.children.length === 0 ? (
            <p className="text-ink-soft">No sons added yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-rule border-y border-rule">
              {ctx.children.map((child) => {
                const clock = clockFor(child)
                return (
                  <div key={child.id} className="flex flex-col gap-1 py-5">
                    <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                      <p className="font-display text-xl">{child.name}</p>
                      <p className="font-mono text-sm text-ink-soft tabular-nums">
                        born {child.birthdate}
                      </p>
                    </div>
                    <p className="text-sm text-ink-soft">
                      {clock.age} years old
                      {clock.stage ? ` · stage ${clock.stage.number}, ${clock.stage.name}` : ''}
                      {` · turns ${clock.age + 1} in ${clock.daysToNextBirthday} days`}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section className="mt-10 flex flex-col gap-4">
          <p className="eyebrow">Add a son</p>
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
