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
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        max={max}
        className="min-h-11 w-full rounded-sm border border-rule bg-raised px-3 py-2.5 text-ink
                   focus:outline-2 focus:outline-offset-1 focus:outline-accent"
      />
    </label>
  )
}

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
      className="inline-flex min-h-11 items-center self-start rounded-sm bg-accent px-6 py-3
                 font-semibold text-accent-ink hover:opacity-90 disabled:opacity-50
                 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
  const border = tone === 'error' ? 'border-l-brass' : 'border-l-accent'
  const bg = tone === 'ok' ? 'bg-accent-soft' : 'bg-surface'
  const text = tone === 'ok' ? 'text-ink' : 'text-ink-soft'
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={`border-l-2 ${border} ${bg} px-4 py-3 text-sm ${text}`}
    >
      {children}
    </p>
  )
}

export function TextArea({
  label,
  name,
  placeholder,
  rows = 7,
}: {
  label: string
  name: string
  placeholder?: string
  rows?: number
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        className="min-h-11 w-full rounded-sm border border-rule bg-raised px-3 py-2.5 text-ink
                   focus:outline-2 focus:outline-offset-1 focus:outline-accent"
      />
    </label>
  )
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function DayPicker({ name, defaultValue = 0 }: { name: string; defaultValue?: number }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-soft">Ask me on</span>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="min-h-11 w-full rounded-sm border border-rule bg-raised px-3 py-2.5 text-ink
                   focus:outline-2 focus:outline-offset-1 focus:outline-accent"
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

/** Quiet warning before something heavy, so a father isn't ambushed. */
export function WeightNote() {
  return (
    <p className="border-l-2 border-l-brass bg-surface px-4 py-3 text-sm text-ink-soft">
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
