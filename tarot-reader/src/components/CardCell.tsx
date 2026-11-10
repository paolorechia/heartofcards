import React from 'react'

interface CardCellProps {
  name: string
  isSelected: boolean
  isReversed: boolean
  onClick: () => void
}

export const CardCell: React.FC<CardCellProps> = ({
  name,
  isSelected,
  isReversed,
  onClick,
}) => {
  const classes = `card-cell ${isSelected ? 'card-cell--selected' : isReversed ? 'card-cell--reversed' : ''}`

  return (
    <button
      className={classes}
      onClick={onClick}
      title={name}
    >
      {isSelected && (
        <div className="card-cell__badge card-cell__badge--check">✓</div>
      )}
      {isReversed && (
        <div className="card-cell__badge card-cell__badge--reversed" title="Reversed">↩</div>
      )}
      <div className="card-cell__name">
        <span className="card-cell__name--main">{name.split(' ').slice(0, 1).map((w) => <span key={w}>{w} </span>)}</span>
        {name.includes(' ') && (
          <span className="card-cell__name--sub">{name.split(' ').slice(1).join(' ')}</span>
        )}
      </div>
    </button>
  )
}
