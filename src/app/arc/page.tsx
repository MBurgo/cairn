import { redirect } from 'next/navigation'
import { getFamilyContext } from '@/lib/data/family'
import { clockFor } from '@/lib/domain/clock'
import { itemsForStage } from '@/lib/domain/content'
import { completionKey } from '@/lib/domain/nudge'
import { setItemDone } from '@/app/actions'
import { Notice } from '@/components/ui'
import { Masthead } from '@/components/masthead'
import { ActionForm } from '@/components/action-form'
import type { ItemKind } from '@/lib/domain/types'

/**
 * Per-user content: never prerender this. A cached copy would be one
 * family's data served to another.
 */
export const dynamic = 'force-dynamic'

const KIND_ORDER: ItemKind[] = ['conversation', 'competency', 'experience', 'rite']
const KIND_HEADING: Record<ItemKind, string> = {
  conversation: 'Conversations',
  competency: 'Competencies',
  experience: 'Experiences',
  rite: 'The rite',
}

export default async function ArcPage() {
  const ctx = await getFamilyContext()
  if (!ctx) redirect('/login')
  if (!ctx.family) redirect('/setup')

  // Deliberately one son at a time. There is no side-by-side view and there
  // will not be one — brothers are not compared in this app.
  const inArc = ctx.children
    .map((child) => ({ child, clock: clockFor(child) }))
    .filter((c) => c.clock.stage !== null)

  return (
    <>
      <Masthead email={ctx.userEmail} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10">
        {inArc.length === 0 ? (
          <div className="mt-8">
            <Notice tone="info">
              None of your sons is eight yet, so the arc hasn&apos;t started. It will appear here on
              his eighth birthday.
            </Notice>
          </div>
        ) : null}

        {inArc.map(({ child, clock }) => {
          const stage = clock.stage!
          const items = itemsForStage(stage.key)
          const doneCount = items.filter((i) => ctx.completed.has(completionKey(i, child.id))).length

          return (
            <section key={child.id} className="mt-10 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <p className="eyebrow">
                  {child.name} · {clock.age} years old · stage {stage.number} of 4
                </p>
                <h1 className="font-display text-3xl">{stage.name}</h1>
                <p className="max-w-prose text-ink-soft">{stage.theme}</p>
                <p className="font-mono text-xs tracking-wider text-accent uppercase">
                  Reading together: {stage.spineText}
                </p>
                <p className="font-mono text-sm text-ink-faint tabular-nums">
                  {doneCount} of {items.length} done
                </p>
              </div>

              {KIND_ORDER.map((kind) => {
                const ofKind = items.filter((i) => i.kind === kind)
                if (ofKind.length === 0) return null
                return (
                  <div key={kind} className="flex flex-col gap-3">
                    <h2 className="border-b border-rule pb-2 font-display text-xl">
                      {KIND_HEADING[kind]}
                    </h2>
                    {ofKind.map((item) => {
                      const key = completionKey(item, child.id)
                      const done = ctx.completed.has(key)
                      return (
                        <div
                          key={item.id}
                          className={`flex flex-col gap-3 rounded-sm border p-5 ${
                            done ? 'border-rule-soft bg-surface' : 'border-rule bg-raised'
                          }`}
                        >
                          <div className="flex flex-wrap items-baseline justify-between gap-3">
                            <h3
                              className={`font-display text-lg ${done ? 'text-ink-faint' : 'text-ink'}`}
                            >
                              {item.title}
                            </h3>
                            {item.scope === 'shared' ? (
                              <span className="rounded-sm bg-accent-soft px-2 py-0.5 font-mono text-[0.6rem] tracking-wider text-accent uppercase">
                                Both boys
                              </span>
                            ) : null}
                          </div>
                          {!done ? (
                            <>
                              <p className="text-sm text-ink-soft">{item.detail}</p>
                              {item.opener ? (
                                <p className="border-l-2 border-l-accent bg-surface px-4 py-3 font-display italic">
                                  {item.opener}
                                </p>
                              ) : null}
                              {item.scripture ? (
                                <p className="font-mono text-xs tracking-wider text-accent uppercase">
                                  {item.scripture}
                                </p>
                              ) : null}
                            </>
                          ) : null}
                          <ActionForm
                            action={setItemDone}
                            variant="link"
                            submitLabel={done ? 'Not done after all' : 'Mark as done'}
                            className="flex flex-col gap-3"
                          >
                            <input type="hidden" name="itemId" value={item.id} />
                            <input type="hidden" name="childId" value={child.id} />
                            <input type="hidden" name="done" value={done ? 'false' : 'true'} />
                          </ActionForm>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </section>
          )
        })}
      </main>
    </>
  )
}
