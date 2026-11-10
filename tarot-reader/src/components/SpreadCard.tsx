import React from 'react'

interface SpreadCardProps {
  name: string
  numCards: number
  description: string
  positions: { name: string }[]
  onClick: () => void
}

export const SpreadCard: React.FC<SpreadCardProps> = ({
  name,
  numCards,
  description,
  positions,
  onClick,
}) => {
  return (
    <button
      className="spread-card"
      onClick={onClick}
    >
      <div className="spread-card__header">
        <div>
          <h3 className="spread-card__title">{name}</h3>
          <p className="spread-card__subtitle">{numCards} cards</p>
        </div>
        <div className="spread-card__icon">✦</div>
      </div>
      <p className="spread-card__desc">{description}</p>
      <div className="spread-card__tags">
        {positions.map((pos) => (
          <span key={pos.name} className="tag">
            {pos.name}
          </span>
        ))}
      </div>
    </button>
  )
}
