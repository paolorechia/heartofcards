import React, { useState } from 'react'
import { spreads, spreadCategories } from '../data/spreads'

interface SpreadSelectorProps {
  onSelect: (spreadId: string) => void
}

export const SpreadSelector: React.FC<SpreadSelectorProps> = ({ onSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('general')

  const filteredSpreads = Object.values(spreads).filter((s) => s.category === selectedCategory)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-purple-900 text-center">Choose Your Spread</h2>
      <p className="text-purple-600 text-center max-w-lg mx-auto">
        Select a spread pattern, then pick the cards you have drawn from your physical deck.
      </p>

      {/* Category selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries(spreadCategories).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === key
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Spread cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mt-6">
        {filteredSpreads.map((spread) => (
          <button
            key={spread.id}
            onClick={() => onSelect(spread.id)}
            className="text-left bg-white border-2 border-purple-200 rounded-xl p-5 hover:border-purple-400 hover:shadow-lg transition-all group"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-purple-800 group-hover:text-purple-600">
                  {spread.name}
                </h3>
                <p className="text-xs text-purple-500 mt-1">{spread.numCards} cards</p>
              </div>
              <div className="text-purple-300 group-hover:text-purple-500 text-2xl">✦</div>
            </div>
            <p className="text-sm text-purple-600 mt-3">{spread.description}</p>
            <div className="flex flex-wrap gap-1 mt-3">
              {spread.positions.map((pos) => (
                <span
                  key={pos.name}
                  className="inline-block bg-purple-50 text-purple-600 text-xs px-2 py-1 rounded"
                >
                  {pos.name}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
