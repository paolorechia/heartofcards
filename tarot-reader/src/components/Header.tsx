import React from 'react'

interface HeaderProps {
  mode: 'reading' | 'generator'
  step: number
  onModeChange: (mode: 'reading' | 'generator') => void
  onReset: () => void
}

export const Header: React.FC<HeaderProps> = ({ mode, step, onModeChange, onReset }) => {
  const handleReadingClick = () => {
    if (mode === 'reading' && step > 1) {
      onReset()
    } else {
      onModeChange('reading')
    }
  }

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__brand">
          <span className="app-header__logo">🔮</span>
          <h1 className="app-header__title">Tarot Reader</h1>
        </div>
        <div className="app-header__actions">
          <button
            onClick={handleReadingClick}
            className={`btn ${mode === 'reading' ? 'btn--primary' : 'btn--secondary'}`}
          >
            📖 Reading
          </button>
          <button
            onClick={() => onModeChange('generator')}
            className={`btn ${mode === 'generator' ? 'btn--primary' : 'btn--secondary'}`}
          >
            ⚡ Card Generator
          </button>
          {mode === 'reading' && step > 1 && (
            <button
              onClick={onReset}
              className="btn btn--ghost"
            >
              ← New Reading
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
