import React, { useEffect, useRef, useState } from 'react'
import init, { TarotSvgGen } from '../../pkg/tarot_gen'
import '../styles/components.css'

interface WasmCardProps {
  cardName: string
  arcana: 'major' | 'minor'
  suit?: string
  number: number
  index: number
}

export const WasmCard: React.FC<WasmCardProps> = ({
  cardName,
  arcana,
  suit,
  number,
  index,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function generate() {
      await init()
      const gen = new TarotSvgGen()
      const config = JSON.stringify({
        name: cardName,
        arcana,
        suit,
        number,
      })
      const svgStr = gen.generate_card(config, index * 137.0)
      setSvg(svgStr)
      setLoading(false)
    }
    generate()
  }, [cardName, arcana, suit, number, index])

  if (loading) {
    return (
      <div className="wasm-card__loading">
        <span className="wasm-card__loading-icon">🔮</span>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="wasm-card"
      dangerouslySetInnerHTML={{ __html: svg || '' }}
    />
  )
}
