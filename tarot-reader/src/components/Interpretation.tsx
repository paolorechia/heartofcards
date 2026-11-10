import { allCards } from '../data/cards'
import type { SpreadDefinition } from '../types'

interface InterpretationProps {
  spread: SpreadDefinition
  cards: { name: string; isReversed: boolean }[]
}

export const Interpretation: React.FC<InterpretationProps> = ({ spread, cards }) => {
  const positionKeywords: Record<string, string> = {
    'Past': 'Your past has planted these seeds —',
    'Present': 'In the present moment, this energy suggests —',
    'Future': 'Looking ahead, this card points to —',
    'Your Situation': 'In your current situation —',
    'Advice': 'The guidance here is clear —',
    'Likely Outcome': 'If this path continues —',
    'Body': 'Your physical self is experiencing —',
    'Mind': 'Your mental state reveals —',
    'Spirit': 'Your spiritual essence is calling —',
    'The Challenge': 'The challenge you face is —',
    'What You Need': 'What you need is —',
    'Your Heart': 'Your heart is in the state of —',
    'The Other': 'The other person brings —',
    'The Relationship': 'The relationship itself is —',
    'Your Role': 'Your role right now is —',
    'Environment': 'The environment around you is —',
    'Career Path': 'Your career is moving toward —',
    'Path A': 'Taking this path leads to —',
    'Path B': 'The alternative path leads to —',
  }

  const cardThemeColors: Record<string, string> = {
    'Major Arcana': 'from-purple-400 to-purple-600',
    'Wands': 'from-orange-400 to-red-500',
    'Cups': 'from-blue-400 to-indigo-500',
    'Swords': 'from-slate-400 to-slate-600',
    'Pentacles': 'from-green-400 to-emerald-600',
  }

  const getMeaningForPosition = (cardName: string, isReversed: boolean, position: string) => {
    const card = allCards[cardName]
    if (!card) return null

    const meaning = isReversed ? card.meanings.reversed : card.meanings.upright
    const themes = card.themes

    const spreadCategory = spread.category

    let relevantThemes: string[] = []
    if (spreadCategory === 'love' && themes.love) relevantThemes = themes.love
    else if (spreadCategory === 'career' && themes.career) relevantThemes = themes.career
    else if (themes[spreadCategory as keyof typeof themes]) {
      relevantThemes = themes[spreadCategory as keyof typeof themes] as string[]
    } else {
      relevantThemes = themes.general
    }

    const keyword = positionKeywords[position] || 'This card reveals that —'

    return {
      cardName,
      isReversed,
      upright: meaning[0] || '',
      positionMeaning: relevantThemes.join(' • ') || meaning[0] || '',
      keyword,
    }
  }

  const getCardTheme = (cardName: string) => {
    const card = allCards[cardName]
    if (!card) return null
    if (card.def.arcana === 'major') return 'Major Arcana'
    return card.def.suit || ''
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-purple-900">{spread.name}</h2>
        <p className="text-purple-600 mt-2 max-w-lg mx-auto">{spread.description}</p>
      </div>

      {/* Cards display */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {spread.positions.map((pos, idx) => {
          const card = cards[idx]
          const meaning = getMeaningForPosition(card.name, card.isReversed, pos.name)
          const theme = getCardTheme(card.name)

          return (
            <div key={pos.name} className="bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden">
              {/* Card display row */}
              <div className="flex flex-col sm:flex-row">
                {/* Card visual */}
                <div className={`sm:w-40 flex-shrink-0 bg-gradient-to-br ${cardThemeColors[theme || 'Major Arcana']} rounded-t-xl sm:rounded-l-xl sm:rounded-t-none p-6 flex items-center justify-center min-h-[160px]`}>
                  <div className="text-white text-center">
                    <div className="text-3xl font-bold mb-1">{idx + 1}</div>
                    <div className="text-sm font-medium opacity-90">{pos.name}</div>
                    <div className="mt-4 text-xs opacity-80">{card.name}</div>
                    {card.isReversed && (
                      <div className="mt-1 text-xs opacity-60">↩ Reversed</div>
                    )}
                  </div>
                </div>

                {/* Interpretation */}
                <div className="flex-1 p-5">
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-purple-800 flex-1">{pos.name}</h3>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                      {theme}
                    </span>
                  </div>

                  {meaning && (
                    <>
                      <p className="text-sm text-purple-600 mb-3">
                        <strong>{meaning.keyword}</strong>{' '}
                        <span className="text-purple-800">{meaning.positionMeaning}</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {meaning.upright.split(' ').map((word, i) => (
                          <span key={i} className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded">
                            {word}
                          </span>
                        ))}
                      </div>
                      {card.isReversed && (
                        <p className="text-xs text-red-500 font-medium italic">
                          ↩ Reversed: {allCards[card.name]?.meanings.reversed?.join(' • ') || 'Blocked energy'}
                        </p>
                      )}
                    </>
                  )}

                  {/* Position description */}
                  <p className="text-xs text-purple-400 italic border-t border-purple-100 pt-2">
                    {pos.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary paragraph */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
        <h3 className="font-semibold text-purple-800 mb-3">🔮 Your Reading Summary</h3>
        <div className="space-y-2 text-sm text-purple-700">
          {spread.positions.map((pos, idx) => {
            const card = cards[idx]
            const meanings = card.isReversed
              ? allCards[card.name]?.meanings.reversed
              : allCards[card.name]?.meanings.upright
            const summary = meanings?.slice(0, 3).join(' • ') || ''

            return (
              <div key={pos.name} className="flex gap-2">
                <span className="text-purple-400 font-mono text-xs mt-0.5">
                  {pos.name}.
                </span>
                <span>
                  <strong className="text-purple-800">{card.name}</strong>
                  {card.isReversed && <span className="text-red-500 text-xs"> (rev)</span>}
                  : {summary}
                </span>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-purple-500 mt-4 italic">
          ✨ This reading is based on the Rider-Waite-Smith tradition. Tarot offers guidance and reflection — trust your own intuition as the ultimate interpreter.
        </p>
      </div>
    </div>
  )
}
