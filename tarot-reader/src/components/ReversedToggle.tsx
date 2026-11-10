import React from 'react'

interface ReversedToggleProps {
  cardName: string
  isReversed: boolean
  onToggle: (cardName: string) => void
}

export const ReversedToggle: React.FC<ReversedToggleProps> = ({
  cardName,
  isReversed,
  onToggle,
}) => {
  return (
    <button
      className={`reversed-toggle ${isReversed ? 'reversed-toggle--active' : 'reversed-toggle--inactive'}`}
      onClick={() => onToggle(cardName)}
    >
      {isReversed ? `↩ ${cardName}` : cardName}
    </button>
  )
}
