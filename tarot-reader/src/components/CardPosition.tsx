import React from 'react'
import { allCards } from '../data/cards'
import '../styles/components.css'

interface CardPositionProps {
  index: number
  positionName: string
  positionDescription: string
  cardName: string
  isReversed: boolean
  spreadCategory: string
}

const themeColors: Record<string, string> = {
  'Major Arcana': '',
  'Wands': 'interpretation__card-visual--wands',
  'Cups': 'interpretation__card-visual--cups',
  'Swords': 'interpretation__card-visual--swords',
  'Pentacles': 'interpretation__card-visual--pentacles',
}

const positionKeywords: Record<string, string> = {
  'Past': 'Your past has planted these seeds —',
  'Present': 'In the present moment, this energy suggests —',
  'Future': 'Looking ahead, this card points to —',
  'Your Situation': 'In your current situation —',
  'Advice': 'The guidance here is clear —',
  'Likely Outcome': 'If this path continues —',
  'Body': 'Your physical self is experiencing —',
  'Mind': 'Your mental state reveals —',
  'Spirit': 'Your spiritual essence is calling —',
  'The Challenge': 'The challenge you face is —',
  'What You Need': 'What you need is —',
  'Your Heart': 'Your heart is in the state of —',
  'The Other': 'The other person brings —',
  'The Relationship': 'The relationship itself is —',
  'Your Role': 'Your role right now is —',
  'Environment': 'The environment around you is —',
  'Career Path': 'Your career is moving toward —',
  'Path A': 'Taking this path leads to —',
  'Path B': 'The alternative path leads to —',
}

export const CardPosition: React.FC<CardPositionProps> = ({
  index,
  positionName,
  positionDescription,
  cardName,
  isReversed,
  spreadCategory,
}) => {
  const card = allCards[cardName]
  if (!card) return null

  const theme = card.def.arcana === 'major' ? 'Major Arcana' : (card.def.suit || '')
  const meaning = isReversed ? card.meanings.reversed : card.meanings.upright
  const themes = card.themes

  let relevantThemes: string[] = []
  if (spreadCategory === 'love' && themes.love) relevantThemes = themes.love
  else if (spreadCategory === 'career' && themes.career) relevantThemes = themes.career
  else if (spreadCategory in themes) {
    relevantThemes = themes[spreadCategory as keyof typeof themes] as string[]
  } else {
    relevantThemes = themes.general
  }

  const keyword = positionKeywords[positionName] || 'This card reveals that —'

  return (
    <div className="interpretation__position">
      <div className={`interpretation__card-visual ${themeColors[theme]}`}>
        <div className="interpretation__card-info">
          <div className="interpretation__card-number">{index + 1}</div>
          <div className="interpretation__card-position">{positionName}</div>
          <div className="interpretation__card-name">{cardName}</div>
          {isReversed && (
            <div className="interpretation__card-reversed">↩ Reversed</div>
          )}
        </div>
      </div>

      <div className="interpretation__body">
        <div className="interpretation__title-row">
          <h3 className="interpretation__title">{positionName}</h3>
          <span className="interpretation__theme-badge">{theme}</span>
        </div>

        <p className="interpretation__meaning">
          <strong>{keyword}</strong> {relevantThemes.join(' • ')}
        </p>

        <div className="interpretation__themes">
          {meaning.map((word, i) => (
            <span key={i} className="interpretation__keyword">
              {word}
            </span>
          ))}
        </div>

        {isReversed && (
          <p className="interpretation__reversed">
            ↩ Reversed: {card.meanings.reversed.join(' • ')}
          </p>
        )}

        <p className="interpretation__position-desc">{positionDescription}</p>
      </div>
    </div>
  )
}
