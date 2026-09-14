import type { ArcItem } from '../types'

/**
 * Ages 8–10. Nothing heavy. The job of this stage is trust and wonder —
 * it is the deposit that stage two spends.
 *
 * Grouped below by kind for readability, but the order a father is ASKED is
 * the `order` field, which ramps deliberately: things you do together first,
 * conversations only once a few months of goodwill are banked, and the rite
 * last.
 *
 * Titles are instructions, in the imperative, with `{name}` standing in for
 * his son. They are not headlines: a father reading one on a Tuesday needs to
 * know what to do, not to be impressed.
 */
export const STAGE_ONE: ArcItem[] = [
  // ---- Conversations ----
  {
    id: 'w-conv-babies',
    order: 15,
    weight: 'weighty',
    stage: 'wonder',
    kind: 'conversation',
    scope: 'individual',
    title: 'Tell {name} where babies come from',
    summary: 'Plain, accurate, and years before he needs it.',
    detail:
      'The goal is not to explain everything; it is to establish that you are the person who answers this kind of question without going strange. Do it on a drive or a walk, where neither of you has to make eye contact.',
    opener:
      '"Do you know how babies actually get made? Ask me anything you like about it — I won\'t be weird about it."',
  },
  {
    id: 'w-conv-death',
    order: 14,
    weight: 'weighty',
    stage: 'wonder',
    kind: 'conversation',
    scope: 'individual',
    title: 'Talk to {name} about death, when it comes up',
    summary: "Let him be sad first. Don't rush to the comfort.",
    detail:
      'Usually triggered by a pet, a grandparent, or a question out of nowhere at bedtime. Say you find it sad too, and only then say what you believe about it. A boy who learns his father can sit in a sad thing without fixing it will bring him the hard things later.',
    scripture: 'Psalm 23',
  },
  {
    id: 'w-conv-why-church',
    order: 11,
    weight: 'moderate',
    stage: 'wonder',
    kind: 'conversation',
    scope: 'shared',
    title: 'Tell them why you actually go to church',
    summary: 'In your own words, in about two sentences.',
    detail:
      'At this age he assumes it is simply what your family does, like the football team you support. Give him the real reason. If the honest answer includes something you find difficult about it, say that too — it costs you nothing now and buys a great deal at fifteen.',
  },
  {
    id: 'w-conv-fear',
    order: 13,
    weight: 'moderate',
    stage: 'wonder',
    kind: 'conversation',
    scope: 'individual',
    title: "Give {name} something to do when he's frightened",
    summary: 'A sentence to pray, a place to come, a light he can turn on.',
    detail:
      'Something concrete to do, rather than a reassurance that it will be fine. Tell him what frightens you, briefly and truthfully. Being told that his father is also sometimes afraid is one of the most stabilising things a boy can hear.',
    scripture: 'Psalm 56:3',
  },
  {
    id: 'w-conv-made-on-purpose',
    order: 12,
    weight: 'moderate',
    stage: 'wonder',
    kind: 'conversation',
    scope: 'individual',
    title: 'Tell {name} he was made on purpose',
    summary: 'Name a trait that is genuinely his, and say it was given to him.',
    detail:
      'Not a single talk — a thing you say more than once, in specifics. This is the seed of the blessing you will speak over him at thirteen, and it should not be the first time he hears the idea.',
    scripture: 'Psalm 139:13–14',
  },

  // ---- Competencies ----
  {
    id: 'w-comp-swim',
    order: 7,
    weight: 'gentle',
    stage: 'wonder',
    kind: 'competency',
    scope: 'individual',
    title: 'Make sure {name} can properly swim',
    summary: 'Not survive in water — swim.',
    detail:
      'In Australia this is a safety issue before it is a competency, and it opens the door to half the experiences in the next three stages.',
  },
  {
    id: 'w-comp-ride',
    order: 5,
    weight: 'gentle',
    stage: 'wonder',
    kind: 'competency',
    scope: 'individual',
    title: 'Get {name} riding confidently — and let him fall off',
    summary: 'Both halves matter.',
    detail:
      'A boy who has come off and got back on has learned something about himself that no amount of encouragement transmits.',
  },
  {
    id: 'w-comp-tool',
    order: 8,
    weight: 'moderate',
    stage: 'wonder',
    kind: 'competency',
    scope: 'individual',
    title: 'Let {name} use a real tool',
    summary: 'A proper hammer, a handsaw, a sharp knife. Supervised.',
    detail:
      'Real tools, real risk. The message underneath is the one that matters: you are trusted with something that could hurt you.',
  },
  {
    id: 'w-comp-cook',
    order: 6,
    weight: 'gentle',
    stage: 'wonder',
    kind: 'competency',
    scope: 'individual',
    title: 'Teach {name} to cook one meal start to finish',
    summary: 'One dish he owns completely and can make for the family.',
    detail: 'Let it be bad the first few times and eat it anyway.',
  },
  {
    id: 'w-comp-adults',
    order: 3,
    weight: 'gentle',
    stage: 'wonder',
    kind: 'competency',
    scope: 'individual',
    title: 'Teach {name} to look an adult in the eye and answer',
    summary: 'Let him order his own food and thank the host by name.',
    detail:
      'Practise it deliberately, and often. Small, repeated, and it compounds into something people will describe as confidence for the rest of his life.',
  },
  {
    id: 'w-comp-money',
    order: 9,
    weight: 'moderate',
    stage: 'wonder',
    kind: 'competency',
    scope: 'individual',
    title: 'Give {name} his own money — including the freedom to waste it',
    summary: 'The disappointment is the lesson, and it is cheap at ten.',
    detail:
      'A small amount that is genuinely his, including the freedom to spend it on something that turns out to be rubbish. Much cheaper now than at nineteen.',
  },

  // ---- Experiences ----
  {
    id: 'w-exp-tent',
    order: 4,
    weight: 'gentle',
    stage: 'wonder',
    kind: 'experience',
    scope: 'shared',
    title: 'Sleep a night in a tent',
    summary: 'Somewhere dark enough that he sees the sky properly once.',
    detail:
      'This is the natural home of the Psalm 8 conversation — you will not have to engineer it, just be awake for it.',
    scripture: 'Psalm 8:3–4',
  },
  {
    id: 'w-exp-build',
    order: 2,
    weight: 'gentle',
    stage: 'wonder',
    kind: 'experience',
    scope: 'shared',
    title: 'Build something together that will still be here in ten years',
    summary: 'A box, a shelf, a go-kart, a garden bed.',
    detail:
      'Let his part be visibly his, mistakes included — do not tidy up his work after he goes to bed. The point is that he can point at it later.',
  },
  {
    id: 'w-exp-alone-day',
    order: 1,
    weight: 'gentle',
    stage: 'wonder',
    kind: 'experience',
    scope: 'individual',
    title: 'Spend a whole day with {name}, just the two of you',
    summary: 'No brothers, no phone, no errand attached to it.',
    detail:
      'With more than one son this needs to be deliberately scheduled or it never happens. For a boy with brothers, undivided attention for a whole day is the rarest thing you own.',
  },
  {
    id: 'w-exp-serve',
    order: 10,
    weight: 'moderate',
    stage: 'wonder',
    kind: 'experience',
    scope: 'shared',
    title: "Do something together for someone who can't repay it",
    summary: 'A meal delivered, a garden cleared, a visit made.',
    detail:
      'Alongside you, not instead of you. At this age he learns generosity by watching his father do it and being handed a job.',
  },

  // ---- The rite ----
  {
    id: 'w-rite-first-trip',
    order: 16,
    weight: 'weighty',
    stage: 'wonder',
    kind: 'rite',
    scope: 'individual',
    title: 'Take {name} away for two nights, and give him one named privilege',
    summary: 'A pocketknife, a later bedtime, his own Bible with his name in it.',
    detail:
      'Just the two of you. Name the privilege out loud as a marker rather than a present — "you are ten now, so you get this" — and mark a stone with the date.',
    scripture: 'Joshua 4:6–7',
  },
]
