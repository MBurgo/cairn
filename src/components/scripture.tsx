import { passageFor, readOnlineUrl } from '@/lib/domain/content/scripture'

/**
 * Shows the verse where we carry it, and always offers a way to read the
 * passage in full. Scripture is quoted rather than boxed — it reads as
 * something said, not as a callout panel.
 */
export function Scripture({ reference }: { reference: string }) {
  const passage = passageFor(reference)

  return (
    <div className="flex flex-col gap-2 border-l border-l-accent pl-4">
      {passage ? (
        <p className="font-display text-lg leading-snug text-ink italic">{passage.text}</p>
      ) : null}
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-[0.65rem] tracking-widest text-accent uppercase">
          {reference}
        </span>
        <a
          href={readOnlineUrl(reference)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-accent underline underline-offset-4"
        >
          {passage ? 'Read the whole passage' : 'Read this passage'}
        </a>
      </p>
    </div>
  )
}
