import React from 'react'
import { WasmCard } from './WasmCard'

interface WasmCardGridProps {
  cards: Array<{
    name: string
    arcana: 'major' | 'minor'
    suit?: string
    number: number
    index: number
  }>
}

export const WasmCardGrid: React.FC<WasmCardGridProps> = ({ cards }) => {
  return (
    <div className="wasm-card-grid">
      {cards.map((card) => (
        <div key={card.name} className="wasm-card-container">
          <WasmCard
            cardName={card.name}
            arcana={card.arcana}
            suit={card.suit}
            number={card.number}
            index={card.index}
          />
          <span className="wasm-card__name">{card.name}</span>
        </div>
      ))}
    </div>
  )
}
