export function Field({
  label,
  name,
  type = 'text',
  required = true,
  placeholder,
  autoComplete,
  max,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
  autoComplete?: string
  max?: string
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        max={max}
        className="min-h-12 w-full rounded-md bg-bone px-4 py-3 text-ink
                   placeholder:text-ink-faint focus:outline-2 focus:outline-offset-2
                   focus:outline-rust"
      />
    </label>
  )
}

export function Select({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string
  name: string
  options: { value: string | number; label: string }[]
  defaultValue?: string | number
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="min-h-12 w-full rounded-md bg-bone px-4 py-3 text-ink
                   focus:outline-2 focus:outline-offset-2 focus:outline-rust"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function DayPicker({ name, defaultValue = 0 }: { name: string; defaultValue?: number }) {
  return (
    <Select
      label="Ask me on"
      name={name}
      defaultValue={defaultValue}
      options={DAYS.map((d, i) => ({ value: i, label: d }))}
    />
  )
}

/**
 * A writing surface. Paper, not a form field — what a father writes here is
 * going into a printed book, and it should look like it from the first word.
 */
export function Sheet({
  prompt,
  name,
  placeholder,
  rows = 7,
  keptFor,
  compact = false,
}: {
  prompt: string
  name: string
  placeholder?: string
  rows?: number
  keptFor?: string
  compact?: boolean
}) {
  const today = new Date().toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  return (
    <div className="sheet flex flex-col gap-3 px-5 pt-5 pb-4">
      <label htmlFor={name} className="stamp">
        {prompt}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        className="written w-full resize-none bg-transparent placeholder:text-paper-soft/60
                   focus:outline-none"
      />
      {compact ? null : (
        <>
          <div className="h-px bg-paper-edge" />
          <p className="stamp flex justify-between gap-3">
            <span>{keptFor ? `Kept for ${keptFor}'s book` : 'Kept'}</span>
            <span>{today}</span>
          </p>
        </>
      )}
    </div>
  )
}

/** The only filled shape in its region. Inverts when it sits on the card. */
export function Submit({
  children,
  disabled = false,
  onCard = false,
}: {
  children: React.ReactNode
  disabled?: boolean
  onCard?: boolean
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`inline-flex min-h-12 w-full items-center justify-center rounded-full px-7 py-3.5
                  font-semibold disabled:opacity-50 focus-visible:outline-2
                  focus-visible:outline-offset-2 ${
                    onCard
                      ? 'bg-card-ink text-card focus-visible:outline-card-ink'
                      : 'bg-card text-card-ink focus-visible:outline-rust'
                  } hover:opacity-90`}
    >
      {children}
    </button>
  )
}

export function Notice({
  children,
  tone = 'error',
}: {
  children: React.ReactNode
  tone?: 'error' | 'info' | 'ok'
}) {
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={`text-sm ${tone === 'info' ? 'text-ink-soft' : 'text-rust'}`}
    >
      {children}
    </p>
  )
}

/** Quiet warning before something heavy, so a father isn't ambushed. */
export function WeightNote() {
  return (
    <p className="text-sm text-card-accent">
      One of the bigger ones. If this isn&apos;t the week for it, put it off — it&apos;ll come
      back.
    </p>
  )
}

/** Paragraph breaks in content prose, without dangerouslySetInnerHTML. */
export function Prose({ text, className = '' }: { text: string; className?: string }) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {text.split('\n\n').map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </div>
  )
}

/** A row in a quiet list. No borders — spacing and tone do the separating. */
export function QuietRow({
  label,
  trailing,
  href,
}: {
  label: string
  trailing?: string
  href?: string
}) {
  const inner = (
    <>
      <span className="font-display text-lg">{label}</span>
      <span className="font-mono text-xs tracking-wider text-ink-faint">{trailing ?? '›'}</span>
    </>
  )
  const className =
    'flex min-h-14 items-baseline justify-between gap-4 py-2 text-ink transition-colors hover:text-rust'
  if (!href) return <div className={className}>{inner}</div>
  return (
    <a href={href} className={className}>
      {inner}
    </a>
  )
}
