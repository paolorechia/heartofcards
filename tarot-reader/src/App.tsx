import { useState } from 'react'
import { spreads } from './data/spreads'
import { SpreadSelector } from './components/SpreadSelector'
import { CardPicker } from './components/CardPicker'
import { Interpretation } from './components/Interpretation'
import { GeneratorView } from './components/GeneratorView'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { StepIndicator } from './components/StepIndicator'
import './styles/tokens.css'
import './styles/components.css'
import './styles/animations.css'

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

  const handleModeChange = (newMode: Mode) => {
    if (newMode === mode && newMode === 'reading' && step > 1) {
      handleReset()
    } else {
      setMode(newMode)
      setStep(1)
    }
  }

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
    <div className="app-shell animate-fade-in">
      <Header
        mode={mode}
        step={step}
        onModeChange={handleModeChange}
        onReset={handleReset}
      />

      <main className="main-content">
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

      <Footer />
    </div>
  )
}

export default App
