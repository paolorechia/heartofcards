import React from 'react'
import '../styles/components.css'

interface GeneratorControlsProps {
  count: number
  seed: number
  totalCards: number
  onCountChange: (count: number) => void
  onSeedChange: (seed: number) => void
}

export const GeneratorControls: React.FC<GeneratorControlsProps> = ({
  count,
  seed,
  totalCards,
  onCountChange,
  onSeedChange,
}) => {
  const handleRandomSeed = () => {
    onSeedChange(Math.floor(Math.random() * 10000))
  }

  return (
    <div className="generator__controls">
      <div className="generator__control-group">
        <label className="generator__control-label">Cards:</label>
        <input
          type="range"
          className="generator__slider"
          min={1}
          max={78}
          value={count}
          onChange={(e) => onCountChange(Number(e.target.value))}
        />
        <span className="generator__control-value">{count}</span>
        <span className="generator__control-unit">/{totalCards}</span>
      </div>

      <div className="generator__control-group">
        <label className="generator__control-label">Seed:</label>
        <input
          type="number"
          className="generator__seed-input"
          value={seed}
          onChange={(e) => onSeedChange(Number(e.target.value))}
        />
        <button
          onClick={handleRandomSeed}
          className="generator__btn-random"
        >
          🎲
        </button>
      </div>
    </div>
  )
}
