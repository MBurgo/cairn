import { passageFor, readOnlineUrl } from '@/lib/domain/content/scripture'

/**
 * Shows the verse where we carry it, and always offers a way to read the
 * passage in full. A father shouldn't have to go hunting for a reference the
 * app just quoted at him.
 */
export function Scripture({ reference }: { reference: string }) {
  const passage = passageFor(reference)

  return (
    <div className="flex flex-col gap-2 rounded-sm bg-accent-soft px-4 py-3">
      {passage ? (
        <p className="font-display text-lg leading-snug italic text-ink">
          &ldquo;{passage.text}&rdquo;
        </p>
      ) : null}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-xs tracking-wider text-accent uppercase">{reference}</span>
        {passage ? (
          <span className="font-mono text-[0.65rem] tracking-wider text-ink-faint uppercase">
            {passage.translation}
          </span>
        ) : null}
        <a
          href={readOnlineUrl(reference)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-accent underline"
        >
          {passage ? 'Read it in context' : 'Read the passage'}
        </a>
      </div>
    </div>
  )
}
