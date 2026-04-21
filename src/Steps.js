export const STEPS = [
  { id: 'breathe', type: 'breathe' },
  {
    id: 'whats-up', type: 'choice',
    prompt: 'What\'s keeping you awake?',
    sub: 'Pick the one that feels most true right now.',
    key: 'category',
    options: [
      { label: 'Something happened today', value: 'event' },
      { label: 'I\'m worried about something coming', value: 'worry' },
      { label: 'My thoughts won\'t stop looping', value: 'loop' },
      { label: 'I feel bad and I don\'t know why', value: 'unknown' },
    ],
  },
  {
    id: 'name-it', type: 'write',
    prompt: 'Put it into words.',
    sub: 'Don\'t edit yourself. Just write what\'s actually in your head. Nobody will see this.',
    placeholder: 'It\'s about...',
    key: 'rawThought', minLength: 10,
  },
  {
    id: 'body-check', type: 'choice',
    prompt: 'Where do you feel it in your body?',
    sub: 'Emotions live somewhere physical. Where is this one?',
    key: 'bodyLocation',
    options: [
      { label: 'Chest — tight or heavy', value: 'chest' },
      { label: 'Stomach — knotted or uneasy', value: 'stomach' },
      { label: 'Head — buzzing or aching', value: 'head' },
      { label: 'Jaw or shoulders — clenched', value: 'jaw' },
      { label: 'Nowhere specific, just... everywhere', value: 'everywhere' },
    ],
  },
  {
    id: 'true-fear', type: 'write',
    prompt: 'If you\'re honest — what are you actually afraid of?',
    sub: 'Not what you told yourself. The real thing underneath.',
    placeholder: 'If I\'m really honest with myself...',
    key: 'trueFear', minLength: 8,
  },
  {
    id: 'is-now', type: 'choice',
    prompt: 'Is any of this happening right now?',
    sub: 'Not tomorrow. Not last week. This exact moment.',
    key: 'isNow',
    options: [
      { label: 'Yes — something is wrong right now', value: 'yes' },
      { label: 'No — it\'s the past or the future', value: 'no' },
      { label: 'I\'m not sure', value: 'unsure' },
    ],
  },
  {
    id: 'one-thing', type: 'write',
    prompt: 'One thing you could do tomorrow — just one.',
    sub: 'Not to solve it. Just to make it 1% better.',
    placeholder: 'Tomorrow I could...',
    key: 'oneThing', minLength: 5,
  },
  { id: 'reflection', type: 'reflection' },
]

export const NOW_RESPONSES = {
  yes: 'Something real is happening — your feelings are valid right now.',
  no: 'Right now, in this exact moment, you are safe. Your mind is visiting another time.',
  unsure: 'The uncertainty is exhausting in itself. But right now, you are still here.',
}

export const BODY_MAP = {
  chest: 'your chest',
  stomach: 'your stomach',
  head: 'your head',
  jaw: 'your jaw and shoulders',
  everywhere: 'everywhere at once',
}
