import { useMemo } from "react"

interface StatsRadarProps {
  stats: Array<{
    base_stat: number
    stat: {
      name: string
    }
  }>
  size?: number
}

export function StatsRadar({ stats, size = 300 }: StatsRadarProps) {
  const statNames = {
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    "special-attack": "SP.ATK",
    "special-defense": "SP.DEF",
    speed: "SPD",
  }

  const maxStat = 255 // Maximum possible stat value
  const center = size / 2
  const radius = size / 2 - 40

  const points = useMemo(() => {
    return stats.map((stat, index) => {
      const angle = (index * 2 * Math.PI) / stats.length - Math.PI / 2
      const value = stat.base_stat / maxStat
      const x = center + Math.cos(angle) * radius * value
      const y = center + Math.sin(angle) * radius * value
      return {
        x,
        y,
        value: stat.base_stat,
        name: statNames[stat.stat.name as keyof typeof statNames] || stat.stat.name,
      }
    })
  }, [stats, center, radius])

  const gridLines = useMemo(() => {
    const lines = []
    for (let i = 1; i <= 5; i++) {
      const gridRadius = (radius * i) / 5
      const gridPoints = []
      for (let j = 0; j < stats.length; j++) {
        const angle = (j * 2 * Math.PI) / stats.length - Math.PI / 2
        const x = center + Math.cos(angle) * gridRadius
        const y = center + Math.sin(angle) * gridRadius
        gridPoints.push(`${x},${y}`)
      }
      lines.push(gridPoints.join(" "))
    }
    return lines
  }, [stats.length, center, radius])

  const axisLines = useMemo(() => {
    return stats.map((_, index) => {
      const angle = (index * 2 * Math.PI) / stats.length - Math.PI / 2
      const x = center + Math.cos(angle) * radius
      const y = center + Math.sin(angle) * radius
      return { x1: center, y1: center, x2: x, y2: y }
    })
  }, [stats.length, center, radius])

  const labels = useMemo(() => {
    return stats.map((stat, index) => {
      const angle = (index * 2 * Math.PI) / stats.length - Math.PI / 2
      const labelRadius = radius + 20
      const x = center + Math.cos(angle) * labelRadius
      const y = center + Math.sin(angle) * labelRadius
      return {
        x,
        y,
        text: statNames[stat.stat.name as keyof typeof statNames] || stat.stat.name,
        value: stat.base_stat,
      }
    })
  }, [stats, center, radius])

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="drop-shadow-lg">
        {/* Grid lines */}
        {gridLines.map((line, index) => (
          <polygon
            key={index}
            points={line}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-300 dark:text-gray-600"
            opacity={0.3}
          />
        ))}

        {/* Axis lines */}
        {axisLines.map((line, index) => (
          <line
            key={index}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-400 dark:text-gray-500"
            opacity={0.5}
          />
        ))}

        {/* Stats polygon */}
        <polygon
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="rgba(59, 130, 246, 0.3)"
          stroke="rgb(59, 130, 246)"
          strokeWidth="2"
        />

        {/* Stat points */}
        {points.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r="4" fill="rgb(59, 130, 246)" stroke="white" strokeWidth="2" />
        ))}
      </svg>

      {/* Labels */}
      <div className="relative" style={{ width: size, height: size, marginTop: -size }}>
        {labels.map((label, index) => (
          <div
            key={index}
            className="absolute text-sm font-medium text-center"
            style={{
              left: label.x - 30,
              top: label.y - 10,
              width: 60,
            }}
          >
            <div className="text-gray-700 dark:text-gray-300">{label.text}</div>
            <div className="text-blue-600 dark:text-blue-400 font-bold">{label.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}