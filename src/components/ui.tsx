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
        className="min-h-12 w-full rounded-lg bg-raised px-4 py-3 text-ink
                   placeholder:text-ink-faint focus:outline-2 focus:outline-offset-2
                   focus:outline-accent"
      />
    </label>
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
  rows = 8,
  keptFor,
}: {
  prompt: string
  name: string
  placeholder?: string
  rows?: number
  keptFor?: string
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
        className="written w-full resize-none bg-transparent placeholder:text-paper-soft/70
                   focus:outline-none"
      />
      <div className="h-px bg-paper-edge" />
      <p className="stamp flex justify-between gap-3">
        <span>{keptFor ? `Kept for ${keptFor}'s book` : 'Kept'}</span>
        <span>{today}</span>
      </p>
    </div>
  )
}

/** The only filled shape on a screen. */
export function Submit({
  children,
  disabled = false,
}: {
  children: React.ReactNode
  disabled?: boolean
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="inline-flex min-h-12 w-full items-center justify-center rounded-full
                 bg-accent px-7 py-3.5 font-semibold text-accent-ink
                 hover:opacity-90 disabled:opacity-50 focus-visible:outline-2
                 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
  const accent = tone === 'error' ? 'text-brass' : 'text-accent'
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={`text-sm ${tone === 'info' ? 'text-ink-soft' : accent}`}
    >
      {children}
    </p>
  )
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function DayPicker({ name, defaultValue = 0 }: { name: string; defaultValue?: number }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-ink-soft">Ask me on</span>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="min-h-12 w-full rounded-lg bg-raised px-4 py-3 text-ink
                   focus:outline-2 focus:outline-offset-2 focus:outline-accent"
      >
        {DAYS.map((day, i) => (
          <option key={day} value={i}>
            {day}
          </option>
        ))}
      </select>
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
        className="min-h-12 w-full rounded-lg bg-raised px-4 py-3 text-ink
                   focus:outline-2 focus:outline-offset-2 focus:outline-accent"
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

/** Quiet warning before something heavy, so a father isn't ambushed. */
export function WeightNote() {
  return (
    <p className="text-sm text-brass">
      This is one of the bigger ones. If this isn&apos;t the week for it, put it off — it&apos;ll
      come back.
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
    'flex min-h-14 items-baseline justify-between gap-4 py-2 text-ink transition-colors hover:text-accent'
  if (!href) return <div className={className}>{inner}</div>
  return (
    <a href={href} className={className}>
      {inner}
    </a>
  )
}
