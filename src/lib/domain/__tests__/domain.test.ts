import { test } from 'vitest'
import assert from 'node:assert/strict'
import { ageOn, birthdaysPhrase, clockFor, nextBirthday } from '../clock'
import { STAGES, stageForAge } from '../stages'
import {
  alternativeCount,
  completionKey,
  deferralDate,
  groundworkProgress,
  isoWeek,
  weeklyNudge,
  type NudgeState,
} from '../nudge'
import { GROUNDWORK, allItems, itemsForStage, titleFor } from '../content'
import { passageFor } from '../content/scripture'
import type { ArcItem, Child, Session, StepKey } from '../types'

const on = new Date(2026, 8, 13) // 13 Sep 2026

const SONS: Child[] = [
  { id: 'a', name: 'Elder', birthdate: '2016-03-01' },
  { id: 'b', name: 'Younger', birthdate: '2017-06-01' },
]

function state(over: Partial<NudgeState> = {}): NudgeState {
  return {
    children: SONS,
    completed: new Set(),
    deferred: new Map(),
    groundworkSkipped: false,
    mentors: [],
    lastActivityOn: null,
    ...over,
  }
}

/** Narrows a nudge to the arc branch, failing loudly if it isn't one. */
function asArc(nudge: ReturnType<typeof weeklyNudge>) {
  assert.ok(nudge, 'expected a nudge')
  assert.equal(nudge.type, 'arc', 'expected an arc nudge')
  return nudge as Extract<typeof nudge, { type: 'arc' }>
}

/** Groundwork finished, so tests can reach the arc. */
function pastGroundwork(over: Partial<NudgeState> = {}): NudgeState {
  const completed = new Set(GROUNDWORK.map((g) => g.id))
  for (const k of over.completed ?? []) completed.add(k)
  return state({ ...over, completed })
}

// ---- clock ----

test('age is not incremented until the birthday has passed', () => {
  assert.equal(ageOn('2016-09-12', on), 10)
  assert.equal(ageOn('2016-09-13', on), 10)
  assert.equal(ageOn('2016-09-14', on), 9)
})

test('leap-day birthdays do not throw or drift', () => {
  assert.equal(ageOn('2016-02-29', on), 10)
})

test('next birthday rolls into next year once this year has passed', () => {
  assert.deepEqual(nextBirthday('2016-09-12', on), new Date(2027, 8, 12))
  assert.deepEqual(nextBirthday('2016-12-25', on), new Date(2026, 11, 25))
})

test('the clock counts birthdays down to eighteen', () => {
  const c = clockFor(SONS[0], on)
  assert.equal(c.age, 10)
  assert.equal(c.birthdaysLeft, 8)
  assert.equal(c.saturdaysLeft, 416)
  assert.equal(c.stage?.key, 'wonder')
})

test('stage boundaries land where the spec says', () => {
  assert.equal(stageForAge(7), null)
  assert.equal(stageForAge(8)?.key, 'wonder')
  assert.equal(stageForAge(10)?.key, 'wonder')
  assert.equal(stageForAge(11)?.key, 'body')
  assert.equal(stageForAge(14)?.key, 'strength')
  assert.equal(stageForAge(17)?.key, 'handover')
  assert.equal(stageForAge(19), null)
})

// ---- groundwork comes first ----

test('a brand-new father is given groundwork, not a task involving his son', () => {
  const nudge = weeklyNudge(state(), on)
  assert.equal(nudge?.type, 'groundwork')
  assert.equal(nudge.item.id, 'gw-1-rhythm')
})

test('groundwork runs in order and does not depend on the sons at all', () => {
  let completed = new Set<string>()
  for (const expected of GROUNDWORK.map((g) => g.id)) {
    const nudge = weeklyNudge(state({ completed, children: [] }), on)
    assert.equal(nudge?.type, 'groundwork')
    assert.equal(nudge.item.id, expected)
    completed = new Set([...completed, expected])
  }
  // Four weeks done, no sons in the arc yet.
  assert.equal(weeklyNudge(state({ completed, children: [] }), on), null)
})

test('skipping groundwork goes straight to the arc', () => {
  const nudge = weeklyNudge(state({ groundworkSkipped: true }), on)
  assert.equal(nudge?.type, 'arc')
})

test('groundwork progress reports honestly', () => {
  assert.deepEqual(groundworkProgress(state()), { done: 0, total: 4, complete: false })
  assert.equal(groundworkProgress(pastGroundwork()).complete, true)
  assert.equal(groundworkProgress(state({ groundworkSkipped: true })).complete, true)
})

// ---- the ramp ----

test('the first arc item is never a conversation', () => {
  assert.notEqual(asArc(weeklyNudge(pastGroundwork(), on)).item.kind, 'conversation')
})

test('stage one ramps gentle before weighty, and no conversation is gentle-first', () => {
  const items = itemsForStage('wonder')
  const firstConversation = items.findIndex((i) => i.kind === 'conversation')
  const lastGentle = items.map((i) => i.weight).lastIndexOf('gentle')
  assert.ok(
    firstConversation > lastGentle,
    'conversations must come after the gentle run has been banked'
  )
})

test('weights never go backwards through a stage', () => {
  const rank = { gentle: 0, moderate: 1, weighty: 2 }
  const weights = itemsForStage('wonder').map((i) => rank[i.weight])
  for (let i = 1; i < weights.length; i++) {
    assert.ok(weights[i] >= weights[i - 1], `item ${i} is lighter than the one before it`)
  }
})

test('the rite is held back until the rest of the stage is done', () => {
  const items = itemsForStage('wonder')
  const nonRite = items.filter((i) => i.kind !== 'rite')
  const done = new Set(nonRite.map((i) => completionKey(i, 'a')))
  const sons = [SONS[0]]
  assert.notEqual(asArc(weeklyNudge(pastGroundwork({ children: sons }), on)).item.kind, 'rite')
  const nudge = asArc(weeklyNudge(pastGroundwork({ children: sons, completed: done }), on))
  assert.equal(nudge.item.kind, 'rite')
})

// ---- one nudge, rotation, deferral, alternatives ----

test('only one nudge is produced per week, however many sons there are', () => {
  const nudge = weeklyNudge(pastGroundwork(), on)
  assert.ok(nudge)
  assert.equal(nudge.type, 'arc')
})

test('the rotation alternates sons across consecutive weeks', () => {
  const thisWeek = asArc(weeklyNudge(pastGroundwork(), new Date(2026, 8, 13)))
  const nextWeek = asArc(weeklyNudge(pastGroundwork(), new Date(2026, 8, 20)))
  assert.notEqual(thisWeek.child.id, nextWeek.child.id)
})

test('a deferred item is not offered until its date passes', () => {
  const first = weeklyNudge(pastGroundwork(), on)!
  const deferred = new Map([[first.key, deferralDate(on)]])
  const next = weeklyNudge(pastGroundwork({ deferred }), on)
  assert.notEqual(next!.key, first.key)

  // Three months on, it is back.
  const later = new Date(2026, 11, 14)
  const returned = weeklyNudge(pastGroundwork({ deferred }), later)
  assert.ok(returned)
})

test('deferral is three months out', () => {
  assert.equal(deferralDate(new Date(2026, 8, 13)), '2026-12-13')
})

test('show me something else advances, and wraps rather than dead-ending', () => {
  const s = pastGroundwork()
  const a = weeklyNudge(s, on, 0)!
  const b = weeklyNudge(s, on, 1)!
  assert.notEqual(a.key, b.key)
  const total = alternativeCount(s, on) + 1
  assert.equal(weeklyNudge(s, on, total)!.key, a.key, 'wraps back to the first')
})

test('no alternatives are offered during groundwork', () => {
  assert.equal(alternativeCount(state(), on), 0)
})

test('a son too young for the arc produces no arc nudge', () => {
  const s = pastGroundwork({ children: [{ id: 'c', name: 'Tiny', birthdate: '2023-01-01' }] })
  assert.equal(weeklyNudge(s, on), null)
})

// ---- keys and content hygiene ----

test('shared items complete once for the family, individual ones per boy', () => {
  const shared = itemsForStage('wonder').find((i) => i.scope === 'shared')!
  const individual = itemsForStage('wonder').find((i) => i.scope === 'individual')!
  assert.equal(completionKey(shared, 'child-1'), shared.id)
  assert.equal(completionKey(shared, 'child-2'), shared.id)
  assert.notEqual(completionKey(individual, 'child-1'), completionKey(individual, 'child-2'))
})

test('isoWeek is stable within a week and moves between them', () => {
  assert.equal(isoWeek(new Date(2026, 8, 14)), isoWeek(new Date(2026, 8, 18)))
  assert.notEqual(isoWeek(new Date(2026, 8, 14)), isoWeek(new Date(2026, 8, 21)))
})

test('every item id is unique across groundwork and the arc', () => {
  const ids = [...GROUNDWORK.map((g) => g.id), ...itemsForStage('wonder').map((i) => i.id)]
  assert.equal(new Set(ids).size, ids.length)
})

test('curriculum order is a contiguous run with no duplicates', () => {
  const orders = itemsForStage('wonder').map((i) => i.order)
  assert.deepEqual(orders, [...Array(orders.length)].map((_, i) => i + 1))
})

// ---- content shape ----

test('arc titles are instructions and shared ones carry no name placeholder', () => {
  for (const item of itemsForStage('wonder')) {
    assert.ok(item.summary.length > 0, `${item.id} needs a summary`)
    assert.ok(item.summary.length <= 90, `${item.id} summary is too long to skim`)
    if (item.scope === 'shared') {
      assert.ok(
        !item.title.includes('{name}'),
        `${item.id} is shared, so its title cannot name one son`
      )
    }
  }
})

test('a name placeholder is replaced, and leaves nothing behind', () => {
  const individual = itemsForStage('wonder').find(
    (i) => i.scope === 'individual' && i.title.includes('{name}')
  )!
  const rendered = titleFor(individual, 'Eli')
  assert.ok(rendered.includes('Eli'))
  assert.ok(!rendered.includes('{name}'))
})

test('every groundwork item has a summary', () => {
  for (const item of GROUNDWORK) {
    assert.ok(item.summary.length > 0, `${item.id} needs a summary`)
    assert.ok(!item.title.includes('{name}'), 'groundwork is about the father, not a son')
  }
})


// ---- mentors ----

const DAVE = { id: 'm1', name: 'Dave', relationship: 'uncle', notes: null }

test('a mentor item is never served before a mentor has been named', () => {
  const mentorItems = itemsForStage('wonder').filter((i) => i.involves === 'mentor')
  assert.ok(mentorItems.length > 0, 'there should be at least one mentor item')

  // Everything else done, so a mentor item is the only thing left.
  const others = itemsForStage('wonder').filter((i) => i.involves !== 'mentor')
  const done = new Set(others.flatMap((i) => SONS.map((s) => completionKey(i, s.id))))

  assert.equal(
    weeklyNudge(pastGroundwork({ completed: done, mentors: [] }), on),
    null,
    'with no mentors named, a mentor item must not be offered'
  )
  const withMentor = weeklyNudge(pastGroundwork({ completed: done, mentors: [DAVE] }), on)
  assert.equal(withMentor?.type, 'arc')
})

test("a mentor's name is interpolated alongside the son's", () => {
  const item = itemsForStage('wonder').find((i) => i.involves === 'mentor')!
  const rendered = titleFor(item, 'Eli', 'Dave')
  assert.ok(rendered.includes('Eli') && rendered.includes('Dave'))
  assert.ok(!rendered.includes('{name}') && !rendered.includes('{mentor}'))
})

test('mentor items carry a mentor on the nudge so the title can render', () => {
  const others = itemsForStage('wonder').filter((i) => i.involves !== 'mentor')
  const done = new Set(others.flatMap((i) => SONS.map((s) => completionKey(i, s.id))))
  const nudge = asArc(weeklyNudge(pastGroundwork({ completed: done, mentors: [DAVE] }), on))
  assert.equal(nudge.item.involves, 'mentor')
  assert.equal(nudge.mentor?.name, 'Dave')
})

// ---- re-ramp ----

test('a father returning after a long silence gets something gentle, not a conversation', () => {
  // Everything gentle and moderate done, so the curriculum points at a
  // weighty conversation.
  const upToConversations = itemsForStage('wonder').filter((i) => i.weight !== 'weighty')
  const done = new Set(upToConversations.flatMap((i) => SONS.map((s) => completionKey(i, s.id))))

  const active = asArc(weeklyNudge(pastGroundwork({ completed: done, lastActivityOn: '2026-09-06' }), on))
  assert.equal(active.item.kind, 'conversation', 'an active father continues the curriculum')

  const away = asArc(
    weeklyNudge(pastGroundwork({ completed: done, lastActivityOn: '2026-01-05' }), on)
  )
  assert.notEqual(away.item.kind, 'conversation', 'a returning father should not land on one')
})

test('the re-ramp does not fire for a father who has never been away', () => {
  const recent = asArc(weeklyNudge(pastGroundwork({ lastActivityOn: '2026-09-10' }), on))
  const never = asArc(weeklyNudge(pastGroundwork({ lastActivityOn: null }), on))
  assert.equal(recent.key, never.key)
})

test('father_first exists on the hardest conversations', () => {
  const weighty = itemsForStage('wonder').filter(
    (i) => i.kind === 'conversation' && i.weight === 'weighty'
  )
  assert.ok(weighty.length > 0)
  for (const item of weighty) {
    assert.ok(item.fatherFirst, `${item.id} is a hard conversation and needs father_first`)
  }
})


test('the clock is phrased as a fact, not a metric', () => {
  const eli = clockFor({ id: 'a', name: 'Eli', birthdate: '2016-03-01' }, on)
  assert.equal(birthdaysPhrase(eli), '8 birthdays left')
  assert.equal(birthdaysPhrase(eli, 'long'), '8 more birthdays before he is his own man')

  const one = clockFor({ id: 'b', name: 'B', birthdate: '2009-01-01' }, on)
  assert.equal(one.birthdaysLeft, 1)
  assert.equal(birthdaysPhrase(one), '1 birthday left', 'singular')

  const grown = clockFor({ id: 'c', name: 'C', birthdate: '2008-01-01' }, on)
  assert.equal(birthdaysPhrase(grown, 'long'), 'He is his own man now.')
})

test('stages are named, not described', () => {
  assert.deepEqual(
    STAGES.map((s) => s.name),
    ['The Watching', 'The Forge', 'The Proving', 'The Send']
  )
})


// ---- sessions ----
//
// A session is run with his son in the room, a step at a time. Each of these
// catches a way a future content edit could quietly make one worse.

const STEPS: StepKey[] = ['read', 'talk', 'do', 'pray']

/** Every item carrying a session, and the session with it. */
function sessions(): [ArcItem, Session][] {
  return allItems()
    .filter((i) => i.session)
    .map((i) => [i, i.session as Session])
}

/** Everything a session shows a father, item fields included. */
function sessionText(item: ArcItem, session: Session): string {
  return [item.opener, item.fatherFirst, session.read, session.do, session.pray, ...session.ask]
    .filter(Boolean)
    .join(' ')
}

test('in stage one, a session means a conversation and nothing else', () => {
  const withSession = itemsForStage('wonder').filter((i) => i.session)
  const conversations = itemsForStage('wonder').filter((i) => i.kind === 'conversation')
  assert.deepEqual(
    withSession.map((i) => i.id).sort(),
    conversations.map((i) => i.id).sort(),
    'a session is for one sitting with him present — not a competency, an experience or the rite'
  )
})

test('a session has the passage, the opener and the go-first line it reads off the item', () => {
  for (const [item] of sessions()) {
    assert.ok(item.scripture, `${item.id} has a session, so it needs a passage for the Read step`)
    assert.ok(item.opener, `${item.id} has a session, so it needs an opener for the Talk step`)
    assert.ok(item.fatherFirst, `${item.id} has a session, so it needs a go-first line`)
  }
})

test('a session never sends a father to a website mid-conversation', () => {
  for (const [item] of sessions()) {
    assert.ok(
      passageFor(item.scripture as string),
      `${item.id} reads ${item.scripture} aloud, so it must be carried inline, not linked`
    )
  }
})

test('gentle things do not get a session', () => {
  for (const [item] of sessions()) {
    assert.notEqual(item.weight, 'gentle', `${item.id}: if it needs a script it was never gentle`)
  }
})

test('a session is never handed to an item the father is not part of', () => {
  for (const [item] of sessions()) {
    assert.notEqual(item.involves, 'mentor', `${item.id}: the father is not in the room`)
  }
})

test('shared sessions name no son, and individual prayers name him', () => {
  for (const [item, session] of sessions()) {
    if (item.scope === 'shared') {
      assert.ok(
        !sessionText(item, session).includes('{name}'),
        `${item.id} covers every boy at once, so nothing in it can name one`
      )
    } else {
      assert.ok(
        session.pray.includes('{name}'),
        `${item.id}: pray over him by name, or you are praying about a category`
      )
    }
  }
})

test('a reordered session drops no step', () => {
  for (const [item, session] of sessions()) {
    if (!session.order) continue
    assert.deepEqual(
      [...session.order].sort(),
      [...STEPS].sort(),
      `${item.id} reorders the steps, which is allowed; dropping one is not`
    )
  }
})

test('every step of a session has something to say, and asking is not interviewing', () => {
  for (const [item, session] of sessions()) {
    for (const field of ['read', 'do', 'pray'] as const) {
      assert.ok(session[field].trim(), `${item.id} has an empty ${field} step`)
    }
    assert.ok(
      session.ask.length >= 1 && session.ask.length <= 2,
      `${item.id} asks ${session.ask.length} questions — three is an interview`
    )
  }
})
