import React, { useState } from 'react'
import { spreads, spreadCategories } from '../data/spreads'
import { CategoryFilter } from './CategoryFilter'
import { SpreadCard } from './SpreadCard'
import '../styles/components.css'

interface SpreadSelectorProps {
  onSelect: (spreadId: string) => void
}

export const SpreadSelector: React.FC<SpreadSelectorProps> = ({ onSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('general')

  const filteredSpreads = Object.values(spreads).filter((s) => s.category === selectedCategory)

  return (
    <div className="section">
      <div className="section__header">
        <h2 className="section__title">Choose Your Spread</h2>
        <p className="section__subtitle">
          Select a spread pattern, then pick the cards you have drawn from your physical deck.
        </p>
      </div>

      <CategoryFilter
        categories={spreadCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="spread-grid">
        {filteredSpreads.map((spread) => (
          <SpreadCard
            key={spread.id}
            name={spread.name}
            numCards={spread.numCards}
            description={spread.description}
            positions={spread.positions}
            onClick={() => onSelect(spread.id)}
          />
        ))}
      </div>
    </div>
  )
}
