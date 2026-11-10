import type { SpreadDefinition } from '../types'

export const spreads: Record<string, SpreadDefinition> = {
  'three-card-past-present-future': {
    id: 'three-card-past-present-future',
    name: 'Past → Present → Future',
    category: 'general',
    numCards: 3,
    description: 'A classic 3-card spread revealing the flow of time. Explore how past experiences shape your present, and what the future may hold.',
    positions: [
      { name: 'Past', description: 'The roots of the situation — what has led to this moment' },
      { name: 'Present', description: 'Where you are now — current energies and circumstances' },
      { name: 'Future', description: 'The likely outcome — what lies ahead if you continue on this path' },
    ],
  },
  'three-card-situation-advice-outcome': {
    id: 'three-card-situation-advice-outcome',
    name: 'Situation → Advice → Outcome',
    category: 'general',
    numCards: 3,
    description: 'A powerful spread that reveals your current situation, the advice you should follow, and the likely outcome of your actions.',
    positions: [
      { name: 'Your Situation', description: 'The current reality — the raw truth of your circumstances' },
      { name: 'Advice', description: 'Guidance for your path — what the cards suggest you do' },
      { name: 'Likely Outcome', description: 'Where this leads — the natural result of current trajectory' },
    ],
  },
  'three-card-body-mind-spirit': {
    id: 'three-card-body-mind-spirit',
    name: 'Body → Mind → Spirit',
    category: 'wellbeing',
    numCards: 3,
    description: 'A holistic spread examining your wellbeing across body, mind, and spirit. Understand where you need attention.',
    positions: [
      { name: 'Body', description: 'Physical health and wellbeing — your bodily state' },
      { name: 'Mind', description: 'Mental clarity and emotional state — your thinking and feelings' },
      { name: 'Spirit', description: 'Spiritual connection and purpose — your deeper self' },
    ],
  },
  'three-card-what-and-how': {
    id: 'three-card-what-and-how',
    name: 'Challenge → What You Need → Outcome',
    category: 'general',
    numCards: 3,
    description: 'Reveal the core challenge you face, what you need to address it, and where your energy leads.',
    positions: [
      { name: 'The Challenge', description: 'The obstacle or lesson you are facing' },
      { name: 'What You Need', description: 'Inner resources or actions required to overcome it' },
      { name: 'Likely Outcome', description: 'The natural result if you follow the advice' },
    ],
  },
  'celtic-cross': {
    id: 'celtic-cross',
    name: 'Celtic Cross',
    category: 'general',
    numCards: 10,
    description: 'The classic tarot spread — a comprehensive 10-card layout offering deep insight into any situation. The most detailed and revealing spread available.',
    positions: [
      { name: '1. The Heart', description: 'The core of the matter — the central theme of your question' },
      { name: '2. The Crossing', description: 'What crosses you — obstacles and challenges you face' },
      { name: '3. The Crown', description: 'The conscious mind — your current attitude and approach' },
      { name: '4. The Foundation', description: 'The unconscious — deep roots, past experiences shaping the situation' },
      { name: '5. The Past', description: 'Recent past — what has recently influenced this situation' },
      { name: '6. The Future', description: 'Near future — what is approaching on the horizon' },
      { name: '7. Your Self', description: 'Your attitude — how you see yourself in this situation' },
      { name: '8. Environment', description: 'Other people — those around you and their influence' },
      { name: '9. Hopes & Fears', description: 'Inner hopes and fears — subconscious motivations' },
      { name: '10. Outcome', description: 'The resolution — the final outcome if things continue on this path' },
    ],
  },
  'love-three-card': {
    id: 'love-three-card',
    name: 'Love & Relationships',
    category: 'love',
    numCards: 3,
    description: 'A love-focused spread examining the dynamics of your relationship or romantic life.',
    positions: [
      { name: 'Your Heart', description: 'Your feelings and approach to love right now' },
      { name: 'The Other', description: 'Your partner\'s feelings and energy toward you' },
      { name: 'The Relationship', description: 'The relationship itself — its current state and potential' },
    ],
  },
  'career-readings': {
    id: 'career-readings',
    name: 'Career & Work',
    category: 'career',
    numCards: 3,
    description: 'A career-focused spread for professional guidance and clarity.',
    positions: [
      { name: 'Your Role', description: 'Your current position and how you see your place at work' },
      { name: 'Environment', description: 'Workplace dynamics, colleagues, and external influences' },
      { name: 'Career Path', description: 'The direction your career is heading — guidance for your next move' },
    ],
  },
  'decision-two-card': {
    id: 'decision-two-card',
    name: 'Two-Card Decision',
    category: 'decision',
    numCards: 2,
    description: 'A simple two-card spread for clear guidance on a specific decision. Compare Option A with Option B, or receive Current Path vs. Alternative Path.',
    positions: [
      { name: 'Path A', description: 'The first choice — what happens if you take this path' },
      { name: 'Path B', description: 'The alternative — what happens if you choose differently' },
    ],
  },
}

export const spreadCategories = {
  general: 'General Readings',
  love: 'Love & Relationships',
  career: 'Career & Work',
  wellbeing: 'Wellbeing',
  decision: 'Decisions',
} as const
