import type { CardData } from '../types'

const makeCard = (
  name: string,
  arcana: 'major' | 'minor',
  upright: string[],
  reversed: string[],
  general: string[],
  suit?: string,
  number?: number,
  themes?: Partial<CardData['themes']>
): CardData => ({
  def: { name, arcana, suit, number },
  meanings: { upright, reversed },
  themes: {
    love: themes?.love || general,
    career: themes?.career || general,
    personal: themes?.personal || general,
    challenge: themes?.challenge || [],
    advice: themes?.advice || [],
    general,
  },
})

const major = (name: string, u: string[], r: string[], gen: string[], th?: Partial<CardData['themes']>) =>
  makeCard(name, 'major', u, r, gen, undefined, undefined, th)

const minorCard = (suit: string, num: string | number, u: string[], r: string[], gen: string[], th?: Partial<CardData['themes']>) => {
  const n = num === 'Ace' ? 1 : num === 'Page' ? 11 : num === 'Knight' ? 12 : num === 'Queen' ? 13 : num === 'King' ? 14 : parseInt(num as string)
  return makeCard(`${suit} ${num}`, 'minor', u, r, gen, suit, n, th)
}

// ============================================================
// RIDER-WAITE-SMITH TAROT CARD DATABASE
// Based on the classic Waite deck (1909) and modern interpretations
// ============================================================

export const majorArcana: Record<string, CardData> = {
  'The Fool': major('The Fool',
    ['New beginnings', 'Innocence', 'Spontaneity', 'Fresh start'],
    ['Recklessness', 'Naivety', 'Poor judgment', 'Caution needed'],
    ['A new journey is beginning. Trust the process even when you can\'t see the full path.', 'Step forward with openness and curiosity.', 'Take the leap of faith — the universe supports your journey.'],
    { love: ['New romance', 'Foolish love', 'Be open to new connections'], career: ['New job', 'Career change', 'Take calculated risks'], personal: ['Self-discovery', 'Embrace the unknown', 'Personal growth'], challenge: ['Don\'t overthink'], advice: ['Be bold', 'Take a chance'] }
  ),

  'The Magician': major('The Magician',
    ['Manifestation', 'Resourcefulness', 'Power', 'Action'],
    ['Manipulation', 'Poor planning', 'Lost talent', 'Unfocused energy'],
    ['You have all the tools you need. Channel your skills into focused action.', 'This is a time of creation — use your will to shape reality.', 'Tap into your full potential. The universe is supporting your efforts.'],
    { love: ['Charm and confidence', 'Making your move', 'Attraction'], career: ['Take initiative', 'Leadership opportunity'], personal: ['Harness your will', 'Self-confidence', 'Creative power'], challenge: ['Don\'t waste your gifts'], advice: ['Take action now', 'Use what you have'] }
  ),

  'The High Priestess': major('The High Priestess',
    ['Intuition', 'Inner knowing', 'Mystery', 'Subconscious'],
    ['Secrets', 'Disconnection from intuition', 'Secrets coming out'],
    ['Listen to your inner voice. Not everything needs to be understood right now.', 'Trust your gut feelings and pay attention to dreams.', 'There is depth beneath the surface. Let intuition guide you.'],
    { love: ['Deep emotional connection', 'Secret feelings'], career: ['Trust your instincts', 'Research before deciding'], personal: ['Inner wisdom', 'Self-reflection'], challenge: ['Don\'t ignore your feelings'], advice: ['Be patient', 'Look within'] }
  ),

  'The Empress': major('The Empress',
    ['Abundance', 'Feminine energy', 'Nurturing', 'Nature', 'Creativity'],
    ['Emotional emptiness', 'Overbearing', 'Dependence', 'Creative block'],
    ['Abundance flows to you. Nurture yourself and the projects in your life.', 'A time of fertility — creative, relational, or literal.', 'Connect with nature and your senses. Allow yourself to be pampered.'],
    { love: ['Romantic abundance', 'Nurturing partner'], career: ['Creative projects', 'Growth and expansion'], personal: ['Self-care', 'Sensuality', 'Home life'], challenge: ['Nurture yourself first'], advice: ['Be generous', 'Connect with nature'] }
  ),

  'The Emperor': major('The Emperor',
    ['Authority', 'Structure', 'Stability', 'Leadership', 'Father figure'],
    ['Rigidity', 'Controlling behavior', 'Obsession with rules'],
    ['Take charge and establish order. Structure and discipline will serve you well.', 'Be firm in your decisions and build solid foundations.', 'Leadership requires both authority and fairness.'],
    { love: ['Stable relationship', 'Commitment'], career: ['Take the lead', 'Build systems'], personal: ['Self-discipline', 'Establish boundaries'], challenge: ['Don\'t be too rigid'], advice: ['Take responsibility', 'Create structure'] }
  ),

  'The Hierophant': major('The Hierophant',
    ['Tradition', 'Spiritual guidance', 'Conformity', 'Education', 'Institutions'],
    ['Personal beliefs', 'Rebellion', 'Unconventional paths'],
    ['Consider established wisdom and traditions. A mentor or teacher may be in your life.', 'Respect time-honored ways.', 'Seek guidance from a trusted authority figure.'],
    { love: ['Traditional commitment', 'Shared values'], career: ['Formal education', 'Institutional knowledge'], personal: ['Spiritual tradition', 'Learning'], challenge: ['Don\'t be dogmatic'], advice: ['Seek guidance', 'Respect tradition'] }
  ),

  'The Lovers': major('The Lovers',
    ['Love', 'Union', 'Partnership', 'Choices', 'Alignment of values'],
    ['Disharmony', 'Imbalance', 'Poor choices', 'Avoiding commitment'],
    ['A meaningful connection or important choice. Align with your true values.', 'Partnership requires both attraction and shared purpose.', 'This card represents union — romantic, business, or with your deeper self.'],
    { love: ['Soul connection', 'Romance', 'Important relationship choice'], career: ['Partnership', 'Contract'], personal: ['Inner harmony', 'Value alignment'], challenge: ['Choose from the heart'], advice: ['Act with integrity', 'Know yourself'] }
  ),

  'The Chariot': major('The Chariot',
    ['Determination', 'Willpower', 'Victory', 'Control', 'Direction'],
    ['Lack of control', 'Aggression', 'No direction'],
    ['Move forward with determination and focus. Victory is within reach.', 'Harness opposing forces and direct them toward your goal.', 'Self-discipline and willpower will carry you through any obstacle.'],
    { love: ['Assertive love', 'Chase what you want'], career: ['Push forward', 'Competitive edge'], personal: ['Goal achievement', 'Willpower'], challenge: ['Don\'t lose focus'], advice: ['Be decisive', 'Move forward boldly'] }
  ),

  'Strength': major('Strength',
    ['Inner strength', 'Courage', 'Patience', 'Compassion', 'Gentle power'],
    ['Self-doubt', 'Weakness', 'Lack of self-control'],
    ['True strength comes from compassion and patience, not force.', 'Face challenges with a calm heart. Tame the beast within.', 'Your inner courage and empathy are your greatest assets right now.'],
    { love: ['Compassionate love', 'Patience in relationships'], career: ['Lead with heart', 'Patient persistence'], personal: ['Inner courage', 'Emotional strength'], challenge: ['Face fears with grace'], advice: ['Be gentle but firm', 'Trust your power'] }
  ),

  'The Hermit': major('The Hermit',
    ['Soul searching', 'Introspection', 'Solitude', 'Inner guidance', 'Stillness'],
    ['Isolation', 'Loneliness', 'Withdrawal'],
    ['A time for solitude and deep reflection. Step back from the noise.', 'Light your own lantern. The answers are found within.', 'Seek wisdom through stillness and honest self-examination.'],
    { love: ['Need for space', 'Self-love'], career: ['Independent work', 'Research'], personal: ['Spiritual journey', 'Self-discovery'], challenge: ['Don\'t isolate completely'], advice: ['Reflect deeply', 'Go within'] }
  ),

  'Wheel of Fortune': major('Wheel of Fortune',
    ['Luck', 'Cycles', 'Destiny', 'Change', 'Turning point'],
    ['Bad luck', 'Resistance to change', 'Breaking cycles'],
    ['The wheel turns — expect change. What goes down must come up.', 'Accept the cycles of life. Destiny is at play.', 'A pivotal moment. Embrace the changes coming, they are fated.'],
    { love: ['Destined connection', 'Relationship changes'], career: ['Fortune favors you', 'Turning point'], personal: ['Fateful events', 'Accept the flow'], challenge: ['Adapt to change'], advice: ['Go with the flow', 'Embrace change'] }
  ),

  'Justice': major('Justice',
    ['Fairness', 'Truth', 'Cause and effect', 'Law', 'Accountability'],
    ['Injustice', 'Unfairness', 'Dishonesty'],
    ['Truth and fairness will prevail. What is done will be measured.', 'Consider cause and effect in all things. Be honest with yourself.', 'A matter of truth comes to light. Accountability and integrity are key.'],
    { love: ['Fair partnership', 'Truth in relationships'], career: ['Legal matters', 'Fair decisions'], personal: ['Self-accountability', 'Truth seeking'], challenge: ['Be honest', 'Face the truth'], advice: ['Act with integrity', 'Seek fairness'] }
  ),

  'The Hanged Man': major('The Hanged Man',
    ['Surrender', 'New perspective', 'Letting go', 'Pause', 'Spiritual enlightenment'],
    ['Stalling', 'Resistance', 'Victim mentality'],
    ['Pause and look at things from a different angle. Surrender to see clearly.', 'Let go of what no longer serves you. Sometimes stopping is the way forward.', 'A time for sacrifice and new understanding.'],
    { love: ['Sacrifice for love', 'Different perspective'], career: ['Step back', 'Reconsider approach'], personal: ['Surrender', 'New awareness'], challenge: ['Let go of control', 'See it differently'], advice: ['Pause and reflect', 'Surrender'] }
  ),

  'Death': major('Death',
    ['Endings', 'Transformation', 'Transition', 'Letting go', 'Rebirth'],
    ['Resistance to change', 'Stagnation', 'Unwillingness to let go'],
    ['Something must end for something new to begin. Embrace transformation.', 'This is not literal death but profound change. Let the old fade away.', 'A major transition. What no longer fits will fall away.'],
    { love: ['End of a phase', 'Transformation in love'], career: ['Career end/transition', 'Major change'], personal: ['Personal transformation', 'Letting go'], challenge: ['Don\'t resist change'], advice: ['Let go', 'Embrace transformation'] }
  ),

  'Temperance': major('Temperance',
    ['Balance', 'Moderation', 'Harmony', 'Patience', 'Blending'],
    ['Imbalance', 'Excess', 'Harmony broken'],
    ['Seek balance and moderation. Blend opposing forces into harmony.', 'Patience and steady effort will bring the best results.', 'Find the middle path. Moderation and blending are your tools.'],
    { love: ['Balanced partnership', 'Harmony', 'Compromise'], career: ['Work-life balance', 'Collaboration'], personal: ['Inner peace', 'Moderation'], challenge: ['Find balance', 'Avoid extremes'], advice: ['Be patient', 'Seek the middle path'] }
  ),

  'The Devil': major('The Devil',
    ['Bondage', 'Attachment', 'Materialism', 'Shadow self', 'Temptation'],
    ['Breaking free', 'Detachment', 'Reclaiming power'],
    ['Examine chains you keep on yourself. Are you trapped by fear or desire?', 'A time to confront your shadow and break unhealthy patterns.', 'Watch for addiction, codependency, and materialism.'],
    { love: ['Codependency', 'Temptation', 'Unhealthy attachment'], career: ['Work addiction', 'Toxic environment'], personal: ['Shadow work', 'Breaking free'], challenge: ['Break free from what binds you'], advice: ['Face your shadows', 'Reclaim your power'] }
  ),

  'The Tower': major('The Tower',
    ['Sudden change', 'Upheaval', 'Chaos', 'Revelation', 'Breaking down'],
    ['Avoiding disaster', 'Fear of change', 'Resistance'],
    ['Sudden upheaval — structures crumble. From ruins, something truer emerges.', 'Expect the unexpected. This destruction makes way for authenticity.', 'A lightning-strike moment. Let the false structures fall.'],
    { love: ['Sudden breakup', 'Shattering illusions'], career: ['Job loss', 'Career crash'], personal: ['Personal crisis', 'Awakening'], challenge: ['Don\'t cling to what\'s broken'], advice: ['Accept the change', 'Rebuild stronger'] }
  ),

  'The Star': major('The Star',
    ['Hope', 'Faith', 'Inspiration', 'Renewal', 'Healing'],
    ['Hopelessness', 'Disconnection', 'Lack of faith'],
    ['Hope and healing after turmoil. The universe is sending you light.', 'A time of restoration and renewed faith in the journey ahead.', 'Trust that things are healing. Stay open to inspiration.'],
    { love: ['Healing in love', 'Renewed hope'], career: ['Hope for the future', 'Inspiration'], personal: ['Spiritual renewal', 'Healing', 'Peace'], challenge: ['Keep the faith', 'Stay hopeful'], advice: ['Trust the process', 'Stay open'] }
  ),

  'The Moon': major('The Moon',
    ['Illusion', 'Fear', 'Anxiety', 'Subconscious', 'Intuition'],
    ['Clarity', 'Release of fear', 'Truth emerging'],
    ['Not everything is as it seems. Trust your intuition through the uncertainty.', 'Be wary of illusions and self-deception. Navigate carefully.', 'Deep emotional undercurrents. The subconscious is calling.'],
    { love: ['Misunderstanding', 'Unclear feelings', 'Deception warning'], career: ['Uncertainty', 'Don\'t be fooled'], personal: ['Face fears', 'Dream analysis'], challenge: ['Trust but verify', 'Navigate carefully'], advice: ['Trust your intuition', 'Look deeper'] }
  ),

  'The Sun': major('The Sun',
    ['Joy', 'Success', 'Vitality', 'Clarity', 'Warmth'],
    ['Overly optimistic', 'Blinded by success', 'Too much energy'],
    ['Pure joy and success. Everything is illuminated. Celebrate!', 'A time of clarity, warmth, and radiant energy. Things are going well.', 'Optimism is well-founded. Your authenticity shines brightly.'],
    { love: ['Happy romance', 'Joyful connection'], career: ['Success', 'Recognition', 'Achievement'], personal: ['Vitality', 'Joy', 'Self-confidence'], challenge: ['Stay grounded', 'Share your light'], advice: ['Celebrate', 'Be joyful'] }
  ),

  'Judgement': major('Judgement',
    ['Rebirth', 'Calling', 'Absolution', 'Reflection', 'Higher purpose'],
    ['Self-doubt', 'Ignoring the call', 'Harsh self-judgment'],
    ['A time of reckoning and rebirth. Answer the higher call.', 'Reflect on past actions and allow yourself absolution.', 'A spiritual awakening. Rise to your purpose.'],
    { love: ['Relationship rebirth', 'Forgiveness in love'], career: ['Calling to higher purpose', 'Career reckoning'], personal: ['Self-forgiveness', 'Life purpose'], challenge: ['Answer the call', 'Forgive yourself'], advice: ['Rise up', 'Heed the call'] }
  ),

  'The World': major('The World',
    ['Completion', 'Accomplishment', 'Fulfilment', 'Travel', 'Wholeness'],
    ['Incomplete', 'Shortcuts', 'Stalled progress'],
    ['A cycle completes. Celebration is in order — you\'ve achieved something significant.', 'Full circle. Integration and wholeness.', 'Achievement and fulfillment. Prepare for a new beginning.'],
    { love: ['Relationship completion', 'Soulmate connection'], career: ['Project completion', 'Achievement'], personal: ['Self-actualization', 'Fulfilment'], challenge: ['Complete the cycle', 'Find closure'], advice: ['Celebrate', 'Close the chapter'] }
  ),
}

export const minorArcana: Record<string, CardData> = {
  // WANDS (Fire: passion, creativity, ambition)
  'Wands Ace': minorCard('Wands', 'Ace', ['New passion', 'Inspiration', 'Vision', 'Potential'], ['Delays', 'Not yet', 'Lack of direction'], ['A new passion or venture is beginning. Embrace the spark.']),
  'Wands Two': minorCard('Wands', 'Two', ['Planning', 'Future decisions', 'Calculated risk'], ['Fear of change', 'Uncertainty', 'Hesitation'], ['You\'re at a crossroads. Evaluate options before committing.']),
  'Wands Three': minorCard('Wands', 'Three', ['Expansion', 'Forecasting', 'Growth'], ['Delays', 'Lack of foresight', 'Setbacks'], ['Your efforts are expanding. Look to the horizon.']),
  'Wands Four': minorCard('Wands', 'Four', ['Celebration', 'Community', 'Stability', 'Homecoming'], ['Instability', 'Transition', 'Home tension'], ['A time of celebration and stability. Enjoy the fruits of your labour.']),
  'Wands Five': minorCard('Wands', 'Five', ['Competition', 'Conflict', 'Struggle'], ['Internal conflict', 'Avoidance', 'Disagreement'], ['Conflict and competition await. Choose your battles wisely.']),
  'Wands Six': minorCard('Wands', 'Six', ['Victory', 'Public recognition', 'Success'], ['Defeat', 'Ego', 'Falling back'], ['Victory and recognition are yours. Celebrate your success.']),
  'Wands Seven': minorCard('Wands', 'Seven', ['Defence', 'Perseverance', 'Standing your ground'], ['Overwhelmed', 'Giving up', 'Retreat'], ['Stand your ground. You\'re being tested — persevere.']),
  'Wands Eight': minorCard('Wands', 'Eight', ['Movement', 'Fast paced', 'Action', 'Swift progress'], ['Delays', 'Slow down', 'Resistance'], ['Things are moving fast. Ride the energy but keep your aim steady.']),
  'Wands Nine': minorCard('Wands', 'Nine', ['Resilience', 'Toughness', 'Persistence'], ['Paranoia', 'Stubbornness', 'Burnout'], ['You\'re resilient but worn. Rest before pushing forward.']),
  'Wands Ten': minorCard('Wands', 'Ten', ['Burden', 'Hard work', 'Responsibility', 'Pressure'], ['Burnout', 'Overextension', 'Micro-managing'], ['You\'re carrying too much. Delegate or release some burden.']),
  'Wands Page': minorCard('Wands', 'Page', ['Enthusiasm', 'New ideas', 'Possibilities', 'Creativity'], ['Stagnation', 'Procrastination', 'Delays'], ['A creative spark ignites. New ideas and enthusiasm abound.']),
  'Wands Knight': minorCard('Wands', 'Knight', ['Action', 'Adventure', 'Passion', 'Go-getter'], ['Rashness', 'Aggression', 'No direction'], ['Bold action is called for. Charge ahead with confidence.']),
  'Wands Queen': minorCard('Wands', 'Queen', ['Confidence', 'Charm', 'Determination', 'Boldness'], ['Selfishness', 'Domineering', 'Temper'], ['Lead with warmth and determination. You inspire others.']),
  'Wands King': minorCard('Wands', 'King', ['Leadership', 'Vision', 'Entrepreneurship', 'Boldness'], ['Tyranny', 'Rigid thinking', 'Corruption'], ['You are a natural leader. Vision and boldness guide your path.']),

  // CUPS (Water: emotions, relationships, feelings)
  'Cups Ace': minorCard('Cups', 'Ace', ['New feelings', 'Romance', 'Compassion', 'Spirituality'], ['Emotional emptiness', 'Blocked feelings', 'Coldness'], ['A new emotion stirs within. Open your heart to what\'s coming.']),
  'Cups Two': minorCard('Cups', 'Two', ['Partnership', 'Connection', 'Attraction', 'Unity'], ['Imbalance', 'Breakup', 'Broken trust'], ['A significant connection or partnership is forming.']),
  'Cups Three': minorCard('Cups', 'Three', ['Celebration', 'Friendship', 'Creativity', 'Socialising'], ['Overindulgence', 'Over-celebrating', 'Gossip'], ['A time for celebration and community. Share your joy.']),
  'Cups Four': minorCard('Cups', 'Four', ['Contemplation', 'Restlessness', 'Re-evaluation'], ['Depression', 'Isolation', 'Withdrawal', 'Stagnation'], ['You feel emotionally drained. Reconnect with what matters.']),
  'Cups Five': minorCard('Cups', 'Five', ['Loss', 'Disappointment', 'Regret', 'Grief'], ['Recovery', 'Acceptance', 'Moving on', 'Hope'], ['Grief and loss are present. But look — there\'s still hope.']),
  'Cups Six': minorCard('Cups', 'Six', ['Nostalgia', 'Past memories', 'Innocence', 'Security'], ['Stuck in the past', 'Nostalgia trap', 'Guilt'], ['Revisiting the past with warmth. What\'s familiar holds comfort.']),
  'Cups Seven': minorCard('Cups', 'Seven', ['Fantasy', 'Dreams', 'Imagination', 'Choices'], ['Too many choices', 'Clarity', 'Reality check'], ['Don\'t lose yourself in fantasies. Ground your dreams in reality.']),
  'Cups Eight': minorCard('Cups', 'Eight', ['Withdrawal', 'Searching', 'Disillusionment', 'Leaving'], ['Avoiding things', 'Fear of change', 'Staying put'], ['It\'s time to walk away from what no longer serves you emotionally.']),
  'Cups Nine': minorCard('Cups', 'Nine', ['Contentment', 'Satisfaction', 'Wealth', 'Self-awareness'], ['Greed', 'Smugness', 'Materialism', 'Inner emptiness'], ['Satisfaction and contentment. You\'ve reached for what you wanted.']),
  'Cups Ten': minorCard('Cups', 'Ten', ['Emotional fulfilment', 'Harmony', 'Family', 'Home'], ['Family discord', 'Broken home', 'Emotional instability'], ['Emotional fulfilment and family harmony. Cherish this moment.']),
  'Cups Page': minorCard('Cups', 'Page', ['Creativity', 'Idealism', 'Dreaming', 'Romance'], ['Emotional immaturity', 'Dramatics', 'Indecisiveness'], ['A creative or romantic idea stirs. Stay open to inspiration.']),
  'Cups Knight': minorCard('Cups', 'Knight', ['Charm', 'Romance', 'Diplomacy', 'Imagination'], ['Moodiness', 'Jealousy', 'Unrealistic', 'Seduction'], ['An emotional offer comes. Follow where your heart leads.']),
  'Cups Queen': minorCard('Cups', 'Queen', ['Emotional balance', 'Compassion', 'Nurturing', 'Intuition'], ['Codependency', 'Neediness', 'Emotional manipulation'], ['Deep emotional intelligence guides you. Trust your nurturing instinct.']),
  'Cups King': minorCard('Cups', 'King', ['Emotional mastery', 'Generosity', 'Good judgement', 'Tact'], ['Emotional manipulation', 'Rigidity', 'Coldness', 'Bitterness'], ['Emotional maturity and generosity. Share your warmth with others.']),

  // SWORDS (Air: intellect, communication, conflict)
  'Swords Ace': minorCard('Swords', 'Ace', ['Clarity', 'Intellectual breakthrough', 'Truth', 'Cutting through'], ['Confusion', 'Clouded judgment', 'Misunderstanding'], ['A moment of clarity. Cut through confusion with truth.']),
  'Swords Two': minorCard('Swords', 'Two', ['Difficult decision', 'Indecision', 'Weighing options'], ['Indecision resolved', 'New direction', 'Choice made'], ['A difficult decision lies ahead. Pause and weigh all options.']),
  'Swords Three': minorCard('Swords', 'Three', ['Heartbreak', 'Grief', 'Pain', 'Sorrow'], ['Recovery', 'Healing', 'Release of grief'], ['Pain is present. Allow yourself to feel it — healing follows.']),
  'Swords Four': minorCard('Swords', 'Four', ['Rest', 'Retreat', 'Recovery', 'Contemplation'], ['Restlessness', 'Burnout', 'Lack of rest'], ['Rest is needed. Step back, recuperate before moving forward.']),
  'Swords Five': minorCard('Swords', 'Five', ['Conflict', 'Defeat', 'Betrayal', 'Loss'], ['Moving past conflict', 'Reconciliation', 'Letting go of grudges'], ['Conflict or loss. Choose your battles — know when to walk away.']),
  'Swords Six': minorCard('Swords', 'Six', ['Transition', 'Recovery', 'Moving on', 'Change'], ['Stuck in transition', 'Reluctance to move on'], ['Transition is underway. Moving toward calmer waters.']),
  'Swords Seven': minorCard('Swords', 'Seven', ['Deception', 'Strategy', 'Caution', 'Stealth'], ['Coming clean', 'Confession', 'Self-awareness'], ['Caution — deception may be afoot. Use strategy but stay honest.']),
  'Swords Eight': minorCard('Swords', 'Eight', ['Self-imposed restriction', 'Feeling trapped', 'Victim mentality'], ['New perspective', 'Release of self-limitation', 'Freedom'], ['You feel trapped, but the chains are loose. A shift frees you.']),
  'Swords Nine': minorCard('Swords', 'Nine', ['Anxiety', 'Nightmares', 'Isolation', 'Worry'], ['Release of anxiety', 'Turning things around', 'Support from others'], ['Anxiety and worry. You\'re harder on yourself than you need to be.']),
  'Swords Ten': minorCard('Swords', 'Ten', ['Painful ending', 'Deep despair', 'Rock bottom', 'Release'], ['Recovery', 'Survival', 'Refusal to give up'], ['A painful ending. But at rock bottom, the only way is up.']),
  'Swords Page': minorCard('Swords', 'Page', ['Alertness', 'Awareness', 'New ideas', 'Observant mind'], ['Gossip', 'All talk', 'Superficiality'], ['Sharp observation. Stay alert — new ideas and communications come.']),
  'Swords Knight': minorCard('Swords', 'Knight', ['Ambition', 'Assertiveness', 'Directness', 'Quick thinking'], ['Impulsiveness', 'Ruthlessness', 'Aggression'], ['Ambitious and direct. Act with decisiveness but watch for ruthlessness.']),
  'Swords Queen': minorCard('Swords', 'Queen', ['Independence', 'Self-reliance', 'Clear communication', 'Perception'], ['Brutal honesty', 'Harsh words', 'Emotional coldness'], ['Independent and clear-headed. Communicate with precision and kindness.']),
  'Swords King': minorCard('Swords', 'King', ['Authority', 'Structure', 'Logic', 'Fair judgement'], ['Tyranny', 'Rigid thinking', 'Aggressive', 'Manipulation'], ['Fair judgement and authority. Lead with logic and integrity.']),

  // PENTACLES (Earth: material, career, health, home)
  'Pentacles Ace': minorCard('Pentacles', 'Ace', ['New opportunity', 'Manifestation', 'Prosperity', 'Potential'], ['Missed opportunity', 'Lack of planning', 'Poor financial management'], ['A new practical opportunity arises. Plant the seed and nurture it.']),
  'Pentacles Two': minorCard('Pentacles', 'Two', ['Balance', 'Adaptability', 'Prioritising', 'Juggling'], ['Overextension', 'Imbalance', 'Overwork', 'Neglect of self'], ['Balance competing demands. Juggle wisely — don\'t drop the ball.']),
  'Pentacles Three': minorCard('Pentacles', 'Three', ['Skill development', 'Teamwork', 'Mastery', 'Apprenticeship'], ['Lack of teamwork', 'Disharmony', 'Quality issues'], ['Skill development through dedication. Teamwork and quality work pay off.']),
  'Pentacles Four': minorCard('Pentacles', 'Four', ['Stability', 'Security', 'Conservation', 'Accumulation'], ['Greed', 'Stinginess', 'Possessiveness', 'Financial insecurity'], ['Security and stability. Guard what you\'ve built but avoid greed.']),
  'Pentacles Five': minorCard('Pentacles', 'Five', ['Hardship', 'Poverty', 'Isolation', 'Adversity'], ['Isolation', 'Ignoring help', 'Spiritual poverty'], ['Hard times but not hopeless. Seek support — you\'re not alone.']),
  'Pentacles Six': minorCard('Pentacles', 'Six', ['Generosity', 'Charity', 'Reciprocity', 'Fairness'], ['Selfishness', 'Poor money management', 'Debt', 'Greed'], ['Give and receive freely. Generosity creates abundance.']),
  'Pentacles Seven': minorCard('Pentacles', 'Seven', ['Patience', 'Investment', 'Long-term view', 'Perseverance'], ['Impatience', 'Short-term thinking', 'Poor investment'], ['Patience with your efforts. Long-term investments will pay off.']),
  'Pentacles Eight': minorCard('Pentacles', 'Eight', ['Apprenticeship', 'Skill', 'Craftsmanship', 'Mastery through practice'], ['Mistakes', 'Lack of focus', 'Mediocrity', 'Perfectionism'], ['Mastery through practice. Dedicate yourself to your craft.']),
  'Pentacles Nine': minorCard('Pentacles', 'Nine', ['Wealth', 'Abundance', 'Self-sufficiency', 'Independence'], ['Greed', 'Overindulgence', 'Financial overextension', 'Stagnation'], ['Self-sufficient abundance. Enjoy the fruits of your labour.']),
  'Pentacles Ten': minorCard('Pentacles', 'Ten', ['Wealth', 'Legacy', 'Family', 'Long-term success', 'Fulfilment'], ['Financial loss', 'Debt', 'Family conflict over money', 'Wealth imbalance'], ['Legacy and wealth. Build something lasting for your family.']),
  'Pentacles Page': minorCard('Pentacles', 'Page', ['Study', 'Apprenticeship', 'Dreams', 'New skills'], ['Stalled progress', 'Lack of focus', 'Lack of discipline'], ['New learning opportunity. Stay curious and diligent.']),
  'Pentacles Knight': minorCard('Pentacles', 'Knight', ['Grace', 'Balance', 'Artistry', 'Fluency', 'Skill in motion'], ['Stagnation', 'Overwork', 'Lack of direction', 'Rushing'], ['Graceful action in practical matters. Move efficiently.']),
  'Pentacles Queen': minorCard('Pentacles', 'Queen', ['Abundance', 'Security', 'Comfort', 'Nurturing', 'Material success'], ['Over-dependence', 'Neglect of self-care', 'Financial manipulation'], ['Nurturing abundance. Create comfort and security for those you love.']),
  'Pentacles King': minorCard('Pentacles', 'King', ['Wealth', 'Business acumen', 'Leadership', 'Authority', 'Mastery'], ['Tyranny', 'Corruption', 'Materialism', 'Inflexibility', 'Greed'], ['Material mastery and wise management. Lead with integrity.']),
}

// Export the full deck
export const allCards: Record<string, CardData> = { ...majorArcana, ...minorArcana }

export const majorArcanaNames = Object.keys(majorArcana)
export const suits = ['Wands', 'Cups', 'Swords', 'Pentacles'] as const
