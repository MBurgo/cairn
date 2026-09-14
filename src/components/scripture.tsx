import { passageFor, readOnlineUrl } from '@/lib/domain/content/scripture'

/**
 * Shows the verse where we carry it, and always offers a way to read the
 * passage in full. Scripture is quoted rather than boxed — it reads as
 * something said, not as a callout panel.
 */
export function Scripture({ reference, onCard = false }: { reference: string; onCard?: boolean }) {
  const passage = passageFor(reference)
  const body = onCard ? 'text-card-ink' : 'text-ink'
  const label = onCard ? 'text-card-accent' : 'text-rust'
  const edge = onCard ? 'border-l-card-soft/40' : 'border-l-rule'

  return (
    <div className={`flex flex-col gap-2 border-l pl-4 ${edge}`}>
      {passage ? (
        <p className={`font-display text-lg leading-snug italic ${body}`}>{passage.text}</p>
      ) : null}
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className={`font-mono text-[0.65rem] tracking-widest uppercase ${label}`}>
          {reference}
        </span>
        <a
          href={readOnlineUrl(reference)}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-sm underline underline-offset-4 ${label}`}
        >
          {passage ? 'Read the whole passage' : 'Read this passage'}
        </a>
      </p>
    </div>
  )
}
