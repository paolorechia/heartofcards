import React from 'react'
import { CardPosition } from './CardPosition'
import { ReadingSummary } from './ReadingSummary'
import type { SpreadDefinition } from '../types'

interface InterpretationProps {
  spread: SpreadDefinition
  cards: { name: string; isReversed: boolean }[]
}

export const Interpretation: React.FC<InterpretationProps> = ({ spread, cards }) => {
  return (
    <div className="interpretation">
      <div className="interpretation__header">
        <h2 className="interpretation__header__title">{spread.name}</h2>
        <p className="interpretation__header__desc">{spread.description}</p>
      </div>

      <div className="interpretation__positions">
        {spread.positions.map((pos, idx) => (
          <CardPosition
            key={pos.name}
            index={idx}
            positionName={pos.name}
            positionDescription={pos.description}
            cardName={cards[idx]?.name || ''}
            isReversed={cards[idx]?.isReversed || false}
            spreadCategory={spread.category}
          />
        ))}
      </div>

      <ReadingSummary positions={spread.positions} cards={cards} />
    </div>
  )
}
