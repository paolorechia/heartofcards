import React from 'react'
import { allCards } from '../data/cards'
import '../styles/components.css'

interface ReadingSummaryProps {
  positions: { name: string }[]
  cards: { name: string; isReversed: boolean }[]
}

export const ReadingSummary: React.FC<ReadingSummaryProps> = ({ positions, cards }) => {
  return (
    <div className="reading-summary">
      <h3 className="reading-summary__title">🔮 Your Reading Summary</h3>
      <div className="space-y-2 text-sm text-purple-700">
        {positions.map((pos, idx) => {
          const card = cards[idx]
          const meanings = card.isReversed
            ? allCards[card.name]?.meanings.reversed
            : allCards[card.name]?.meanings.upright
          const summary = meanings?.slice(0, 3).join(' • ') || ''

          return (
            <div key={pos.name} className="reading-summary__item">
              <span className="reading-summary__label">
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
      <p className="reading-summary__disclaimer">
        ✨ This reading is based on the Rider-Waite-Smith tradition. Tarot offers guidance and reflection — trust your own intuition as the ultimate interpreter.
      </p>
    </div>
  )
}
