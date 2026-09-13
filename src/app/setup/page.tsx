import { redirect } from 'next/navigation'
import { getFamilyContext } from '@/lib/data/family'
import { createFamily } from '@/app/actions'
import { Field } from '@/components/ui'
import { Masthead } from '@/components/masthead'
import { ActionForm } from '@/components/action-form'

/**
 * Per-user content: never prerender this. A cached copy would be one
 * family's data served to another.
 */
export const dynamic = 'force-dynamic'

export default async function SetupPage() {
  const ctx = await getFamilyContext()
  if (!ctx) redirect('/login')
  if (ctx.family) redirect('/')

  const today = new Date().toISOString().slice(0, 10)

  return (
    <>
      <Masthead email={ctx.userEmail} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10">
        <div className="flex flex-col gap-3">
          <p className="eyebrow">First run</p>
          <h1 className="font-display text-3xl">Let&apos;s start with one son.</h1>
          <p className="max-w-prose text-ink-soft">
            You can add his brothers in a moment. Cairn works out his age, which stage he&apos;s in,
            and how many years are left — so his date of birth is the only thing it really needs.
          </p>
        </div>

        <ActionForm
          action={createFamily}
          submitLabel="Create and continue"
          pendingLabel="Creating…"
          className="mt-8 flex flex-col gap-5 rounded-sm border border-rule bg-raised p-6"
        >
          <Field label="Family name" name="familyName" placeholder="e.g. the Burgess family" />
          <div className="h-px bg-rule-soft" />
          <Field label="His name" name="sonName" placeholder="e.g. Sam" />
          <Field label="Date of birth" name="birthdate" type="date" max={today} />
        </ActionForm>
      </main>
    </>
  )
}
