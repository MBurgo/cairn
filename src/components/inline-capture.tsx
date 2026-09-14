import { addCapture } from '@/app/actions'
import { ActionForm } from '@/components/action-form'
import { Sheet } from '@/components/ui'
import type { Child } from '@/lib/domain/types'

/**
 * Always on home, under the week's thing. A father with thirty seconds and no
 * appetite for the week's item should still have somewhere to put what his son
 * said at dinner — and it goes straight into the book.
 */
export function InlineCapture({ sons }: { sons: Child[] }) {
  const only = sons.length === 1 ? sons[0] : undefined
  return (
    <ActionForm action={addCapture} submitLabel="Keep it" pendingLabel="Saving…">
      <Sheet
        prompt={only ? `What did ${only.name} say today?` : 'What did one of them say today?'}
        name="body"
        rows={3}
        compact
        keptFor={only?.name}
        placeholder="Anything you'd want him to read at eighteen."
      />
      {only ? <input type="hidden" name="childId" value={only.id} /> : null}
    </ActionForm>
  )
}
