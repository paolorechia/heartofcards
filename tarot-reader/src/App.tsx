import { useState } from 'react'
import { spreads } from './data/spreads'
import { majorArcanaNames } from './data/cards'
import { StepIndicator } from './components/StepIndicator'
import { SpreadSelector } from './components/SpreadSelector'
import { CardPicker } from './components/CardPicker'
import { Interpretation } from './components/Interpretation'
import { WasmCard } from './components/WasmCard'

type CardSelection = { name: string; isReversed: boolean }[]
type Mode = 'reading' | 'generator'

function App() {
  const [mode, setMode] = useState<Mode>('reading')
  const [step, setStep] = useState(1)
  const [selectedSpreadId, setSelectedSpreadId] = useState<string>('')
  const [cardSelection, setCardSelection] = useState<CardSelection>([])
  const [generatedCount, setGeneratedCount] = useState(22)
  const [generatedSeed, setGeneratedSeed] = useState(42)

  const selectedSpread = spreads[selectedSpreadId]

  const handleSpreadSelect = (spreadId: string) => {
    setSelectedSpreadId(spreadId)
    setStep(2)
  }

  const handleCardPick = (cards: CardSelection) => {
    setCardSelection(cards)
    setStep(3)
  }

  const handleReset = () => {
    setStep(1)
    setSelectedSpreadId('')
    setCardSelection([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-purple-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔮</span>
            <h1 className="text-xl font-bold text-purple-800">Tarot Reader</h1>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => { setMode('reading'); setStep(1) }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                mode === 'reading'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              }`}
            >
              📖 Reading
            </button>
            <button
              onClick={() => { setMode('generator'); setStep(1) }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                mode === 'generator'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              }`}
            >
              ⚡ Card Generator
            </button>
            {mode === 'reading' && step > 1 && (
              <button
                onClick={handleReset}
                className="text-sm text-purple-600 hover:text-purple-800 transition-colors ml-2"
              >
                ← New Reading
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* READING MODE */}
        {mode === 'reading' && (
          <>
            <StepIndicator
              currentStep={step}
              totalSteps={3}
              title={
                step === 1
                  ? 'Choose a Spread'
                  : step === 2
                  ? 'Pick Your Cards'
                  : 'Reveal Your Reading'
              }
            />

            {step === 1 && <SpreadSelector onSelect={handleSpreadSelect} />}

            {step === 2 && selectedSpread && (
              <CardPicker
                numCards={selectedSpread.numCards}
                onPick={handleCardPick}
              />
            )}

            {step === 3 && selectedSpread && (
              <Interpretation spread={selectedSpread} cards={cardSelection} />
            )}
          </>
        )}

        {/* GENERATOR MODE */}
        {mode === 'generator' && (
          <GeneratorView
            count={generatedCount}
            seed={generatedSeed}
            onCountChange={(c) => setGeneratedCount(c)}
            onSeedChange={(s) => setGeneratedSeed(s)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-purple-400">
        <p>
          Based on the Rider-Waite-Smith tradition (1909). Tarot for reflection and guidance —
          trust your intuition above all. Card generation powered by Rust/WASM.
        </p>
      </footer>
    </div>
  )
}

// ============================================================
// GENERATOR VIEW — shows cards with WASM-generated SVGs
// ============================================================

interface GeneratorViewProps {
  count: number
  seed: number
  onCountChange: (count: number) => void
  onSeedChange: (seed: number) => void
}

function GeneratorView({ count, seed, onCountChange, onSeedChange }: GeneratorViewProps) {
  const minorArcanaNames: string[] = []
  // Build minor arcana names from the cards module
  const suits = ['Wands', 'Cups', 'Swords', 'Pentacles'] as const
  const ranks = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King']
  for (const suit of suits) {
    for (const rank of ranks) {
      minorArcanaNames.push(`${suit} ${rank}`)
    }
  }

  const total = majorArcanaNames.length + minorArcanaNames.length
  const cardsToShow = majorArcanaNames.slice(0, Math.min(count, majorArcanaNames.length))
  const remaining = count > majorArcanaNames.length
    ? minorArcanaNames.slice(0, Math.min(count - majorArcanaNames.length, minorArcanaNames.length))
    : []

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-purple-900">SVG Card Generator</h2>
        <p className="text-purple-600 mt-2 max-w-lg mx-auto">
          Generate tarot cards as unique SVG illustrations using Rust/WASM. Each card features suit-specific artwork with golden detailing.
        </p>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          <div className="flex items-center gap-3">
            <label className="text-sm text-purple-700 font-medium">Cards:</label>
            <input
              type="range"
              min={1}
              max={78}
              value={count}
              onChange={(e) => onCountChange(Number(e.target.value))}
              className="w-40 accent-purple-600"
            />
            <span className="text-lg text-purple-800 font-bold min-w-[2ch]">{count}</span>
            <span className="text-xs text-purple-500">/ {total}</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-purple-700 font-medium">Seed:</label>
            <input
              type="number"
              value={seed}
              onChange={(e) => onSeedChange(Number(e.target.value))}
              className="w-24 px-2 py-1 border border-purple-300 rounded-lg text-center text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <button
              onClick={() => onSeedChange(Math.floor(Math.random() * 10000))}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors"
            >
              🎲
            </button>
          </div>
        </div>
      </div>

      {/* Card grid */}
      {cardsToShow.length === 0 && remaining.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">🔮</div>
          <p className="text-purple-500 text-lg">Initializing card generator...</p>
          <p className="text-purple-400 mt-2 text-sm">Loading Rust/WASM module</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 max-w-7xl mx-auto">
          {cardsToShow.map((name, idx) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <WasmCard
                cardName={name}
                arcana="major"
                index={idx}
                suit={undefined}
                number={0}
              />
              <span className="text-[10px] text-purple-600 text-center leading-tight max-w-[110px] truncate">
                {name}
              </span>
            </div>
          ))}
          {remaining.map((name, idx) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <WasmCard
                cardName={name}
                arcana="minor"
                index={majorArcanaNames.length + idx}
                suit={minorArcanaNames[idx] ? minorArcanaNames[idx].split(' ')[0] : undefined}
                number={parseInt(minorArcanaNames[idx]?.split(' ')[1] || '0')}
              />
              <span className="text-[10px] text-purple-600 text-center leading-tight max-w-[110px] truncate">
                {name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="text-center text-sm text-purple-500 max-w-2xl mx-auto mt-8 p-4 bg-purple-50 rounded-xl">
        <p>
          🃏 <strong>{cardsToShow.length}</strong> Major Arcana +{' '}
          <strong>{remaining.length}</strong> Minor Arcana shown
        </p>
        <p className="mt-1">
          SVGs generated client-side with Rust/WASM. Each card features suit-specific artwork,
          golden detailing, and procedural variation.
        </p>
      </div>
    </div>
  )
}

export default App
