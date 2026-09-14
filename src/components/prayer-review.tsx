import type { Prayer } from '@/lib/data/journal'
import { reviewPrayer } from '@/app/actions'
import { ActionForm } from '@/components/action-form'
import { Sheet } from '@/components/ui'

function longDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * "You prayed this in March. What happened?"
 *
 * His own dated words come first, in full, before he is asked anything — he
 * wrote them up to a year ago and will not remember them. Reading them back
 * before knowing the outcome is the entire point.
 */
export function PrayerReviewCard({ prayer, childName }: { prayer: Prayer; childName: string }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="sheet flex flex-col gap-3 px-5 py-5">
        <p className="stamp">
          For {childName} · {longDate(prayer.loggedOn)}
        </p>
        <p className="written italic">{prayer.body}</p>
      </div>

      <p className="font-display text-xl">What happened?</p>

      <ActionForm action={reviewPrayer} submitLabel="Keep this" pendingLabel="Saving…">
        <input type="hidden" name="prayerId" value={prayer.id} />
        <fieldset className="flex flex-wrap gap-x-6 gap-y-3">
          <legend className="sr-only">Outcome</legend>
          {[
            { value: 'answered', label: 'Answered' },
            { value: 'changed', label: 'It changed' },
            { value: 'waiting', label: 'Still waiting' },
          ].map((option, i) => (
            <label key={option.value} className="flex min-h-11 items-center gap-2.5 text-ink">
              <input
                type="radio"
                name="outcome"
                value={option.value}
                defaultChecked={i === 0}
                className="h-4 w-4 accent-accent"
              />
              {option.label}
            </label>
          ))}
        </fieldset>
        <Sheet prompt="In a line or two" name="note" rows={3} keptFor={childName} />
      </ActionForm>
    </div>
  )
}
