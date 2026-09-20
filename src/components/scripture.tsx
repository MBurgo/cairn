import { passageFor, readOnlineUrl } from '@/lib/domain/content/scripture'

/**
 * Shows the verse where we carry it, and always offers a way to read the
 * passage in full. Scripture is quoted rather than boxed — it reads as
 * something said, not as a callout panel.
 */
export function Scripture({
  reference,
  onCard = false,
  aloud = false,
}: {
  reference: string
  onCard?: boolean
  /**
   * Being read out to a boy standing next to you. Sets the text large enough
   * to read at arm's length and removes the link away to a website, which is
   * the last thing a father needs halfway through a conversation.
   */
  aloud?: boolean
}) {
  const passage = passageFor(reference)
  // A whole psalm at arm's-length size is a wall. Long passages step down so
  // that most of what he reads aloud still fits on one screen.
  const long = (passage?.text.length ?? 0) > 320
  const size = !aloud
    ? 'text-lg leading-snug'
    : long
      ? 'text-xl leading-[1.55]'
      : 'text-[1.4rem] leading-[1.45]'
  const body = onCard ? 'text-card-ink' : 'text-ink'
  const label = onCard ? 'text-card-accent' : 'text-rust'
  const edge = onCard ? 'border-l-card-soft/40' : 'border-l-rule'

  return (
    <div className={`flex flex-col gap-2 border-l pl-4 ${edge}`}>
      {passage ? (
        <p className={`font-display italic ${size} ${body}`}>
          {/* Verse breaks are kept so a long passage reads as lines, not a slab. */}
          {passage.text.split('\n').map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </p>
      ) : null}
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className={`font-mono text-[0.65rem] tracking-widest uppercase ${label}`}>
          {reference}
        </span>
        {aloud ? null : (
          <a
            href={readOnlineUrl(reference)}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm underline underline-offset-4 ${label}`}
          >
            {passage ? 'Read the whole passage' : 'Read this passage'}
          </a>
        )}
      </p>
    </div>
  )
}
