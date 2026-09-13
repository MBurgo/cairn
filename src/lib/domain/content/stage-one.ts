import type { ArcItem } from '../types'

/**
 * Ages 8–10. Nothing heavy. The job of this stage is trust and wonder —
 * it is the deposit that stage two spends.
 */
export const STAGE_ONE: ArcItem[] = [
  // ---- Conversations ----
  {
    id: 'w-conv-babies',
    stage: 'wonder',
    kind: 'conversation',
    scope: 'individual',
    title: 'Where babies come from — the first pass',
    detail:
      'Plain, accurate, unembarrassed, and years before he needs it. The goal is not to explain everything; it is to establish that you are the person who answers this kind of question without going strange. Do it on a drive or a walk, where neither of you has to make eye contact.',
    opener:
      '"Do you know how babies actually get made? Ask me anything you like about it — I won\'t be weird about it."',
  },
  {
    id: 'w-conv-death',
    stage: 'wonder',
    kind: 'conversation',
    scope: 'individual',
    title: 'Death, when it comes up',
    detail:
      'Usually triggered by a pet, a grandparent, or a question out of nowhere at bedtime. Do not rush to the comfort. Let him be sad first, say you find it sad too, and only then say what you believe about it. A boy who learns his father can sit in a sad thing without fixing it will bring him the hard things later.',
    scripture: 'Psalm 23',
  },
  {
    id: 'w-conv-why-church',
    stage: 'wonder',
    kind: 'conversation',
    scope: 'shared',
    title: 'Why we actually go to church',
    detail:
      'At this age he assumes it is simply what your family does, like the football team you support. Give him the real reason, in one or two sentences, in your own words. If the honest answer includes something you find difficult about it, say that too — it costs you nothing now and buys a great deal at fifteen.',
  },
  {
    id: 'w-conv-fear',
    stage: 'wonder',
    kind: 'conversation',
    scope: 'individual',
    title: 'What to do when you are frightened',
    detail:
      'Give him something concrete to do rather than a reassurance that it will be fine — a sentence to pray, a place to come, a light he is allowed to turn on. Tell him what frightens you, briefly and truthfully. Being told that his father is also sometimes afraid is one of the most stabilising things a boy can hear.',
    scripture: 'Psalm 56:3',
  },
  {
    id: 'w-conv-made-on-purpose',
    stage: 'wonder',
    kind: 'conversation',
    scope: 'individual',
    title: 'That he was made on purpose',
    detail:
      'Not a single talk — a thing you say more than once, in specifics. Name a trait that is actually his and tell him it was given to him rather than acquired. This is the seed of the blessing you will speak over him at thirteen, and it should not be the first time he hears the idea.',
    scripture: 'Psalm 139:13–14',
  },

  // ---- Competencies ----
  {
    id: 'w-comp-swim',
    stage: 'wonder',
    kind: 'competency',
    scope: 'individual',
    title: 'Swim properly',
    detail:
      'Not survive in water — swim. In Australia this is a safety issue before it is a competency, and it opens the door to half the experiences in the next three stages.',
  },
  {
    id: 'w-comp-ride',
    stage: 'wonder',
    kind: 'competency',
    scope: 'individual',
    title: 'Ride confidently, and fall off',
    detail:
      'Both halves matter. A boy who has come off and got back on has learned something about himself that no amount of encouragement transmits.',
  },
  {
    id: 'w-comp-tool',
    stage: 'wonder',
    kind: 'competency',
    scope: 'individual',
    title: 'Use a real tool without losing a finger',
    detail:
      'A proper hammer, a handsaw, a sharp knife in the kitchen. Real tools, real risk, supervised. The message underneath is the one that matters: you are trusted with something that could hurt you.',
  },
  {
    id: 'w-comp-cook',
    stage: 'wonder',
    kind: 'competency',
    scope: 'individual',
    title: 'Cook one meal start to finish',
    detail:
      'One dish he owns completely and can make for the family without help. Let it be bad the first few times and eat it anyway.',
  },
  {
    id: 'w-comp-adults',
    stage: 'wonder',
    kind: 'competency',
    scope: 'individual',
    title: 'Look an adult in the eye and answer the question',
    detail:
      'Practise it deliberately: order his own food, ask the shopkeeper, thank the host by name. Small, repeated, and it compounds into something people will describe as confidence for the rest of his life.',
  },
  {
    id: 'w-comp-money',
    stage: 'wonder',
    kind: 'competency',
    scope: 'individual',
    title: 'Hold his own money, and lose some of it',
    detail:
      'A small amount that is genuinely his, including the freedom to waste it on something disappointing. The disappointment is the lesson and it is much cheaper now than at nineteen.',
  },

  // ---- Experiences ----
  {
    id: 'w-exp-tent',
    stage: 'wonder',
    kind: 'experience',
    scope: 'shared',
    title: 'First night in a tent',
    detail:
      'Somewhere with no lights, so he sees the sky properly once. This is the natural home of the Psalm 8 conversation — you will not have to engineer it, just be awake for it.',
    scripture: 'Psalm 8',
  },
  {
    id: 'w-exp-build',
    stage: 'wonder',
    kind: 'experience',
    scope: 'shared',
    title: 'Build one thing together that lasts',
    detail:
      'A box, a shelf, a go-kart, a garden bed. Something that will still exist in ten years and that he can point at. Let his part be visibly his, mistakes included — do not tidy up his work after he goes to bed.',
  },
  {
    id: 'w-exp-alone-day',
    stage: 'wonder',
    kind: 'experience',
    scope: 'individual',
    title: 'A whole day out, just him',
    detail:
      'No siblings, no phone, no errand attached to it. With more than one son this needs to be deliberately scheduled or it never happens — and for a boy with brothers, undivided attention for a whole day is the rarest thing you own.',
  },
  {
    id: 'w-exp-serve',
    stage: 'wonder',
    kind: 'experience',
    scope: 'shared',
    title: 'Do something for someone who cannot repay it',
    detail:
      'Alongside you, not instead of you: a meal delivered, a garden cleared, a visit made. At this age he learns generosity by watching his father do it and being handed a job.',
  },

  // ---- The rite ----
  {
    id: 'w-rite-first-trip',
    stage: 'wonder',
    kind: 'rite',
    scope: 'individual',
    title: 'The first trip away, and one named privilege',
    detail:
      'Two nights away, just the two of you, and something he is given that says he has grown: a pocketknife, a later bedtime, his own Bible with his name written in the front. Name it out loud as a marker rather than a present — "you are ten now, so you get this" — and mark the stone with the date.',
    scripture: 'Joshua 4:6–7',
  },
]
