import React, { useMemo } from 'react'
import { majorArcanaNames } from '../data/cards'
import { GeneratorControls } from './GeneratorControls'
import { WasmCardGrid } from './WasmCardGrid'
import '../styles/components.css'

const suits = ['Wands', 'Cups', 'Swords', 'Pentacles'] as const

const ranks = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'] as const

interface GeneratorViewProps {
  count: number
  seed: number
  onCountChange: (count: number) => void
  onSeedChange: (seed: number) => void
}

export const GeneratorView: React.FC<GeneratorViewProps> = ({
  count,
  seed,
  onCountChange,
  onSeedChange,
}) => {
  const minorArcanaNames = useMemo(() => {
    return suits.flatMap((suit) =>
      ranks.map((rank) => `${suit} ${rank}`)
    )
  }, [])

  const total = majorArcanaNames.length + minorArcanaNames.length

  const cardsToShow = useMemo(() => {
    const majorCards = majorArcanaNames.slice(0, Math.min(count, majorArcanaNames.length))
    const remaining = count > majorArcanaNames.length
      ? minorArcanaNames.slice(0, Math.min(count - majorArcanaNames.length, minorArcanaNames.length))
      : []

    return [
      ...majorCards.map((name, idx) => ({
        name,
        arcana: 'major' as const,
        index: idx,
        suit: undefined,
        number: 0,
      })),
      ...remaining.map((name, idx) => {
        const [suitName, rank] = name.split(' ')
        const num = rank === 'Ace' ? 1 : rank === 'Page' ? 11 : rank === 'Knight' ? 12 : rank === 'Queen' ? 13 : rank === 'King' ? 14 : parseInt(rank)
        return {
          name,
          arcana: 'minor' as const,
          suit: suitName,
          number: num,
          index: majorArcanaNames.length + idx,
        }
      }),
    ]
  }, [count, majorArcanaNames, minorArcanaNames])

  if (cardsToShow.length === 0) {
    return (
      <div className="generator">
        <div className="generator__header">
          <h2 className="generator__header__title">SVG Card Generator</h2>
          <p className="generator__header__desc">
            Generate tarot cards as unique SVG illustrations using Rust/WASM. Each card features suit-specific artwork with golden detailing.
          </p>
        </div>

        <GeneratorControls
          count={count}
          seed={seed}
          totalCards={total}
          onCountChange={onCountChange}
          onSeedChange={onSeedChange}
        />

        <div className="generator__placeholder">
          <div className="generator__placeholder-icon">🔮</div>
          <p className="generator__placeholder-title">Initializing card generator...</p>
          <p className="generator__placeholder-desc">Loading Rust/WASM module</p>
        </div>
      </div>
    )
  }

  return (
    <div className="generator">
      <div className="generator__header">
        <h2 className="generator__header__title">SVG Card Generator</h2>
        <p className="generator__header__desc">
          Generate tarot cards as unique SVG illustrations using Rust/WASM. Each card features suit-specific artwork with golden detailing.
        </p>
      </div>

      <GeneratorControls
        count={count}
        seed={seed}
        totalCards={total}
        onCountChange={onCountChange}
        onSeedChange={onSeedChange}
      />

      <WasmCardGrid cards={cardsToShow} />

      <div className="generator-summary">
        <p>
          🃏 <strong>{cardsToShow.filter(c => c.arcana === 'major').length}</strong> Major Arcana +{' '}
          <strong>{cardsToShow.filter(c => c.arcana === 'minor').length}</strong> Minor Arcana shown
        </p>
        <p className="mt-1">
          SVGs generated client-side with Rust/WASM. Each card features suit-specific artwork,
          golden detailing, and procedural variation.
        </p>
      </div>
    </div>
  )
}
