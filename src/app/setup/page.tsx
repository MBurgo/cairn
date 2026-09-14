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
      <Masthead />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pt-12 pb-10">
        <div className="flex flex-col gap-4">
          <p className="eyebrow">Welcome</p>
          <h1 className="heading">
            Raising a son on purpose, one week at a time.
          </h1>
          <div className="flex max-w-prose flex-col gap-3 text-ink-soft">
            <p>
              Cairn asks you for one thing a week — not one a day, and never one per son — from
              the time a boy is eight until he leaves home at eighteen. Conversations to have,
              things to teach him, trips to take, and the handful of occasions that deserve to be
              marked properly.
            </p>
            <p>
              At the end there is a book for each of your sons: what you did, what he said, what
              you prayed for him, and how it turned out.
            </p>
            <p className="text-ink">
              <strong className="font-semibold">Nothing starts today.</strong> The first few weeks
              are for you rather than him — the rhythm, what you&apos;re aiming at, and a bit of
              honest thinking about your own father. We&apos;ll get to your son shortly.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          <p className="eyebrow">First, who he is</p>
          <p className="max-w-prose text-sm text-ink-soft">
            Start with one son — you can add his brothers straight afterwards. His date of birth
            is the only thing Cairn really needs: it works out his age, which stage he&apos;s in,
            and how much time is left.
          </p>
        </div>

        <ActionForm
          action={createFamily}
          submitLabel="Create and continue"
          pendingLabel="Creating…"
          className="mt-6 flex flex-col gap-5"
        >
          <Field label="Family name" name="familyName" placeholder="e.g. the Burgess family" />
          
          <Field label="His name" name="sonName" placeholder="e.g. Eli" />
          <Field label="Date of birth" name="birthdate" type="date" max={today} />
        </ActionForm>
      </main>
    </>
  )
}
