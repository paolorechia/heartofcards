import React, { useState, useMemo } from 'react'
import { majorArcanaNames, suits } from '../data/cards'

interface CardPickerProps {
  numCards: number
  onPick: (selectedCards: { name: string; isReversed: boolean }[]) => void
}

export const CardPicker: React.FC<CardPickerProps> = ({ numCards, onPick }) => {
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [isReversed, setIsReversed] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState<'major' | 'minor'>('major')
  const [activeSuit, setActiveSuit] = useState<string>('Wands')

  const majorNames = useMemo(() => {
    const order = ['The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor', 'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit', 'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance', 'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World']
    return order.filter((n) => majorArcanaNames.includes(n))
  }, [])

  const minorNames = useMemo(() => {
    const numOrder = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King']
    return suits.flatMap((suit) =>
      numOrder.map((num) => {
        const cardName = `${suit} ${num}`
        return { name: cardName, suit }
      })
    )
  }, [])

  const filteredMinor = useMemo(() => {
    return minorNames.filter((c) => c.suit === activeSuit)
  }, [activeSuit, minorNames])

  const toggleCard = (name: string) => {
    setSelectedCards((prev) => {
      const exists = prev.includes(name)
      if (exists) {
        return prev.filter((n) => n !== name)
      }
      if (prev.length < numCards) {
        return [...prev, name]
      }
      return prev
    })
  }

  const toggleReversed = (name: string) => {
    setIsReversed((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  const isCardSelected = (name: string) => selectedCards.includes(name)
  const isCardReversed = (name: string) => !!isReversed[name]

  const confirmCards = () => {
    const cards = selectedCards
      .filter((_, i) => i < numCards)
      .map((name) => ({ name, isReversed: isReversed[name] || false }))
    onPick(cards)
  }

  const remaining = numCards - selectedCards.length

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-purple-900">Pick Your Cards</h2>
        <p className="text-purple-600 mt-1">
          Select {numCards} card{numCards > 1 ? 's' : ''} from your physical deck, then confirm your reading.
        </p>
        <div className={`inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-medium ${
          remaining === 0
            ? 'bg-green-100 text-green-700'
            : 'bg-purple-100 text-purple-700'
        }`}>
          {selectedCards.length}/{numCards} selected {remaining > 0 ? `(${remaining} more)` : '✓'}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 justify-center">
        <button
          onClick={() => setActiveTab('major')}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === 'major'
              ? 'bg-purple-600 text-white shadow'
              : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
          }`}
        >
          Major Arcana
        </button>
        <button
          onClick={() => setActiveTab('minor')}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === 'minor'
              ? 'bg-purple-600 text-white shadow'
              : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
          }`}
        >
          Minor Arcana
        </button>
      </div>

      {/* Suit selector for Minor Arcana */}
      {activeTab === 'minor' && (
        <div className="flex flex-wrap gap-2 justify-center">
          {suits.map((suit) => (
            <button
              key={suit}
              onClick={() => setActiveSuit(suit)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                activeSuit === suit
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
              }`}
            >
              {suit}
            </button>
          ))}
        </div>
      )}

      {/* Card grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2 max-w-5xl mx-auto">
        {(activeTab === 'major' ? majorNames : filteredMinor.map((c) => c.name)).map((name) => {
          const isSelected = isCardSelected(name)
          const reversed = isCardReversed(name)

          return (
            <button
              key={name}
              onClick={() => toggleCard(name)}
              className={`relative aspect-[2/3] rounded-lg border-2 transition-all text-xs font-medium leading-tight flex flex-col items-center justify-center p-1 ${
                isSelected
                  ? 'border-purple-600 bg-purple-100 text-purple-800 shadow-lg scale-105'
                  : reversed
                  ? 'border-purple-300 bg-purple-50 text-purple-600'
                  : 'border-purple-100 bg-white text-purple-700 hover:border-purple-300 hover:shadow-md'
              }`}
              title={name}
            >
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 rounded-full text-white text-xs flex items-center justify-center">
                  ✓
                </div>
              )}
              {reversed && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center" title="Reversed">
                  ↩
                </div>
              )}
              <div className="text-center">
                {name.split(' ').slice(0, 1).map((w) => (
                  <div key={w} className="font-bold">{w}</div>
                ))}
                {name.includes(' ') && (
                  <div className="opacity-60 text-[10px]">{name.split(' ').slice(1).join(' ')}</div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Reversed toggle area for selected cards */}
      {selectedCards.length > 0 && (
        <div className="max-w-5xl mx-auto mt-4 p-4 bg-purple-50 rounded-xl">
          <p className="text-sm text-purple-700 font-medium mb-2">
            Mark reversed cards (optional):
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedCards.map((name) => (
              <button
                key={name}
                onClick={() => toggleReversed(name)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  isCardReversed(name)
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-100'
                }`}
              >
                {isCardReversed(name) ? `↩ ${name}` : `${name}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Confirm button */}
      <div className="text-center mt-6">
        <button
          onClick={confirmCards}
          disabled={selectedCards.length < numCards}
          className={`px-8 py-3 rounded-full text-base font-semibold transition-all ${
            selectedCards.length >= numCards
              ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg cursor-pointer'
              : 'bg-purple-200 text-purple-400 cursor-not-allowed'
          }`}
        >
          {selectedCards.length >= numCards ? 'Reveal My Reading ✨' : `Select ${numCards - remaining} more`}
        </button>
      </div>
    </div>
  )
}
