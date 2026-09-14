import type { Prayer } from '@/lib/data/journal'
import { reviewPrayer } from '@/app/actions'
import { ActionForm } from '@/components/action-form'
import { TextArea } from '@/components/ui'

/**
 * "You prayed this in March. What happened?"
 *
 * The answer is kept either way — a prayer that was never answered is as much
 * a part of the record as one that was.
 */
export function PrayerReviewCard({ prayer, childName }: { prayer: Prayer; childName: string }) {
  return (
    <div className="flex flex-col gap-4 rounded-sm border border-brass/40 bg-raised p-5">
      <p className="font-mono text-xs tracking-wider text-brass uppercase">
        You prayed this for {childName} on {prayer.loggedOn}
      </p>
      <p className="font-display text-xl leading-snug italic">&ldquo;{prayer.body}&rdquo;</p>
      <p className="text-sm text-ink-soft">What happened?</p>
      <ActionForm action={reviewPrayer} submitLabel="Save" pendingLabel="Saving…">
        <input type="hidden" name="prayerId" value={prayer.id} />
        <fieldset className="flex flex-wrap gap-4">
          <legend className="sr-only">Outcome</legend>
          {[
            { value: 'answered', label: 'Answered' },
            { value: 'changed', label: 'It changed' },
            { value: 'waiting', label: 'Still waiting' },
          ].map((option, i) => (
            <label key={option.value} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="outcome"
                value={option.value}
                defaultChecked={i === 0}
                className="accent-accent"
              />
              {option.label}
            </label>
          ))}
        </fieldset>
        <TextArea label="In a line or two" name="note" rows={3} />
      </ActionForm>
    </div>
  )
}
