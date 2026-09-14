import { stageForAge } from './stages'
import type { Child, Clock } from './types'

const LEAVING_AGE = 18

/** Midnight-anchored so the same day always gives the same answer. */
function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function parseBirthdate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) throw new Error(`Invalid birthdate: ${iso}`)
  return new Date(y, m - 1, d)
}

export function ageOn(birthdate: string, on: Date = new Date()): number {
  const b = parseBirthdate(birthdate)
  const today = startOfDay(on)
  let age = today.getFullYear() - b.getFullYear()
  const hadBirthday =
    today.getMonth() > b.getMonth() ||
    (today.getMonth() === b.getMonth() && today.getDate() >= b.getDate())
  if (!hadBirthday) age -= 1
  return age
}

export function nextBirthday(birthdate: string, on: Date = new Date()): Date {
  const b = parseBirthdate(birthdate)
  const today = startOfDay(on)
  let next = new Date(today.getFullYear(), b.getMonth(), b.getDate())
  if (next < today) next = new Date(today.getFullYear() + 1, b.getMonth(), b.getDate())
  return next
}

export function clockFor(child: Child, on: Date = new Date()): Clock {
  const age = ageOn(child.birthdate, on)
  const birthdaysLeft = Math.max(0, LEAVING_AGE - age)
  const next = nextBirthday(child.birthdate, on)
  const msPerDay = 24 * 60 * 60 * 1000
  return {
    age,
    birthdaysLeft,
    // Whole weeks remaining, which is near enough one Saturday each.
    saturdaysLeft: birthdaysLeft * 52,
    nextBirthday: next,
    daysToNextBirthday: Math.round((next.getTime() - startOfDay(on).getTime()) / msPerDay),
    stage: stageForAge(age),
  }
}

/**
 * How the clock is said. Short for a list row, long where there is room —
 * a countdown should read as a fact about his life, not a metric.
 */
export function birthdaysPhrase(clock: Clock, form: 'short' | 'long' = 'short'): string {
  if (clock.birthdaysLeft === 0) return form === 'short' ? 'his own man' : 'He is his own man now.'
  const plural = clock.birthdaysLeft === 1 ? 'birthday' : 'birthdays'
  return form === 'short'
    ? `${clock.birthdaysLeft} ${plural} left`
    : `${clock.birthdaysLeft} more ${plural} before he is his own man`
}
