import React, { useEffect, useRef, useState } from 'react'
import init, { TarotSvgGen } from '../../pkg/tarot_gen'

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
      <div className="w-44 h-72 bg-purple-900/40 rounded-xl animate-pulse flex items-center justify-center">
        <span className="text-3xl">🔮</span>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="w-44 h-72 hover:scale-105 hover:shadow-xl hover:z-10 transition-all duration-200 cursor-pointer"
      dangerouslySetInnerHTML={{ __html: svg || '' }}
    />
  )
}
