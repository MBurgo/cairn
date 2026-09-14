import { redirect } from 'next/navigation'
import { getFamilyContext } from '@/lib/data/family'
import { clockFor } from '@/lib/domain/clock'
import { addSon, addMentor, deleteMentor } from '@/app/actions'
import { Field } from '@/components/ui'
import { Masthead, SignOut } from '@/components/masthead'
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
      <Masthead />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pt-12 pb-10">
        <h1 className="instruction">{ctx.family.name}</h1>

        <section className="mt-8 flex flex-col gap-4">
          <p className="eyebrow">Your sons</p>
          {ctx.children.length === 0 ? (
            <p className="text-ink-soft">No sons added yet.</p>
          ) : (
            <div className="flex flex-col gap-5">
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

        {/* ---- The men around them. Deliberately a list, not a CRM. ---- */}
        <section className="mt-12 flex flex-col gap-4">
          <p className="eyebrow">The men you want around them</p>
          {ctx.mentors.length === 0 ? (
            <p className="max-w-prose text-ink-soft">
              These men don&apos;t need the app. You do. Write down the four to eight men
              you&apos;d want standing beside your sons — uncles, mates, men from church — and
              Cairn will start suggesting things to ask them.
            </p>
          ) : (
            <div className="flex flex-col gap-5">
              {ctx.mentors.map((mentor) => (
                <div key={mentor.id} className="flex flex-col gap-1 py-4">
                  <div className="flex flex-wrap items-baseline gap-x-4">
                    <p className="font-display text-lg">{mentor.name}</p>
                    {mentor.relationship ? (
                      <p className="text-sm text-ink-soft">{mentor.relationship}</p>
                    ) : null}
                  </div>
                  <ActionForm
                    action={deleteMentor}
                    variant="link"
                    submitLabel="Remove"
                    pendingLabel="Removing…"
                    destructive
                    className="flex"
                  >
                    <input type="hidden" name="id" value={mentor.id} />
                  </ActionForm>
                </div>
              ))}
            </div>
          )}
          <ActionForm
            action={addMentor}
            submitLabel="Add him"
            pendingLabel="Adding…"
            className="flex flex-col gap-5"
          >
            <Field label="His name" name="name" placeholder="e.g. Dave" />
            <Field
              label="How your sons know him"
              name="relationship"
              required={false}
              placeholder="e.g. uncle, youth leader, mate from church"
            />
          </ActionForm>
        </section>

        <section className="mt-14 flex flex-col gap-4">
          <p className="eyebrow">Add a son</p>
          <ActionForm
            action={addSon}
            submitLabel="Add him"
            pendingLabel="Adding…"
            className="flex flex-col gap-5"
          >
            <Field label="His name" name="name" />
            <Field label="Date of birth" name="birthdate" type="date" max={today} />
          </ActionForm>
        </section>

        <div className="mt-16 flex justify-center">
          <SignOut />
        </div>
      </main>
    </>
  )
}
