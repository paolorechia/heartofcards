import React, { useState, useMemo } from 'react'
import { majorArcanaNames, suits } from '../data/cards'
import { TabbedPanel } from './TabbedPanel'
import { CardCell } from './CardCell'
import { ReversedToggle } from './ReversedToggle'
import '../styles/components.css'

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
      numOrder.map((num) => ({
        name: `${suit} ${num}`,
        suit,
      }))
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
    <div className="section">
      <div className="section__header">
        <h2 className="section__title">Pick Your Cards</h2>
        <p className="section__subtitle">
          Select {numCards} card{numCards > 1 ? 's' : ''} from your physical deck, then confirm your reading.
        </p>
        <div className={`status-badge ${remaining === 0 ? 'status-badge--success' : 'status-badge--pending'}`}>
          {selectedCards.length}/{numCards} selected {remaining > 0 ? `(${remaining} more)` : '✓'}
        </div>
      </div>

      <TabbedPanel
        tabs={[
          { key: 'major', label: 'Major Arcana' },
          { key: 'minor', label: 'Minor Arcana' },
        ]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as 'major' | 'minor')}
      />

      {activeTab === 'minor' && (
        <TabbedPanel
          tabs={suits.map((suit) => ({ key: suit, label: suit }))}
          activeTab={activeSuit}
          onTabChange={(suit) => setActiveSuit(suit)}
        />
      )}

      <div className="card-grid">
        {(activeTab === 'major' ? majorNames : filteredMinor.map((c) => c.name)).map((name) => (
          <CardCell
            key={name}
            name={name}
            isSelected={isCardSelected(name)}
            isReversed={isCardReversed(name)}
            onClick={() => toggleCard(name)}
          />
        ))}
      </div>

      {selectedCards.length > 0 && (
        <div className="selected-section">
          <p className="selected-section__label">
            Mark reversed cards (optional):
          </p>
          <div className="card-grid">
            {selectedCards.map((name) => (
              <ReversedToggle
                key={name}
                cardName={name}
                isReversed={isCardReversed(name)}
                onToggle={toggleReversed}
              />
            ))}
          </div>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={confirmCards}
          disabled={selectedCards.length < numCards}
          className={`btn--confirm ${selectedCards.length < numCards ? 'btn--disabled' : ''}`}
        >
          {selectedCards.length >= numCards ? 'Reveal My Reading ✨' : `Select ${numCards - remaining} more`}
        </button>
      </div>
    </div>
  )
}
