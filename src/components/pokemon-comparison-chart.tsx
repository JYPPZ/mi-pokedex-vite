import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { ComparisonPokemon } from "@/types/comparison"

interface PokemonComparisonChartProps {
  pokemon: ComparisonPokemon[]
}

export function PokemonComparisonChart({ pokemon }: PokemonComparisonChartProps) {
  const statNames = {
    hp: "PS",
    attack: "Ataque",
    defense: "Defensa",
    "special-attack": "Ataque Especial",
    "special-defense": "Defensa Especial",
    speed: "Velocidad",
  }

  const getTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      normal: "bg-gray-400",
      fire: "bg-red-500",
      water: "bg-blue-500",
      electric: "bg-yellow-400",
      grass: "bg-green-500",
      ice: "bg-blue-300",
      fighting: "bg-red-700",
      poison: "bg-purple-500",
      ground: "bg-yellow-600",
      flying: "bg-indigo-400",
      psychic: "bg-pink-500",
      bug: "bg-green-400",
      rock: "bg-yellow-800",
      ghost: "bg-purple-700",
      dragon: "bg-indigo-700",
      dark: "bg-gray-800",
      steel: "bg-gray-500",
      fairy: "bg-pink-300",
    }
    return colors[type] || "bg-gray-400"
  }

  const getStatColor = (index: number): string => {
    const colors = ["bg-blue-500", "bg-red-500", "bg-green-500", "bg-purple-500"]
    return colors[index % colors.length]
  }

  const maxStats = pokemon[0]?.stats.reduce(
    (acc, stat) => {
      const statName = stat.stat.name
      const maxValue = Math.max(...pokemon.map((p) => p.stats.find((s) => s.stat.name === statName)?.base_stat || 0))
      acc[statName] = maxValue
      return acc
    },
    {} as { [key: string]: number },
  )

  return (
    <div className="space-y-6">
      {/* Basic Info Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Información básica</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pokemon.map((p, index) => (
              <div key={p.id} className="text-center space-y-4">
                <div className="relative">
                  <img
                    src={p.sprite || "/placeholder.svg?height=120&width=120"}
                    alt={p.name}
                    className="w-30 h-30 mx-auto object-contain"
                  />
                  <div
                    className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${getStatColor(index)} flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {index + 1}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg capitalize">{p.name}</h3>
                  <div className="text-sm text-gray-500">#{p.id.toString().padStart(3, "0")}</div>
                </div>
                <div className="flex justify-center gap-1">
                  {p.types.map((type) => (
                    <span
                      key={type.type.name}
                      className={`${getTypeColor(type.type.name)} text-white text-xs px-2 py-1 rounded-full`}
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-gray-500">Altura</div>
                    <div className="font-medium">{(p.height / 10).toFixed(1)}m</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Peso</div>
                    <div className="font-medium">{(p.weight / 10).toFixed(1)}kg</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Comparación de estadísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {pokemon[0]?.stats.map((_, statIndex) => {
              const statName = pokemon[0].stats[statIndex].stat.name
              const displayName = statNames[statName as keyof typeof statNames] || statName

              return (
                <div key={statName} className="space-y-3">
                  <h4 className="font-medium text-sm uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    {displayName}
                  </h4>
                  <div className="space-y-2">
                    {pokemon.map((p, pokemonIndex) => {
                      const stat = p.stats.find((s) => s.stat.name === statName)
                      const statValue = stat?.base_stat || 0
                      const percentage = maxStats[statName] > 0 ? (statValue / maxStats[statName]) * 100 : 0

                      return (
                        <div key={p.id} className="flex items-center gap-4">
                          <div className="w-20 text-sm font-medium capitalize truncate">{p.name}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Progress
                                value={percentage}
                                className="flex-1 h-3"
                                style={{
                                  background: `linear-gradient(to right, ${getStatColor(pokemonIndex).replace("bg-", "rgb(")})`,
                                }}
                              />
                              <div className="w-12 text-sm font-bold text-right">{statValue}</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            {/* Total Stats */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-sm uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-3">
                Estadística total
              </h4>
              <div className="space-y-2">
                {pokemon.map((p, pokemonIndex) => {
                  const totalStats = p.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
                  const maxTotal = Math.max(
                    ...pokemon.map((pokemon) => pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)),
                  )
                  const percentage = (totalStats / maxTotal) * 100

                  return (
                    <div key={p.id} className="flex items-center gap-4">
                      <div className="w-20 text-sm font-medium capitalize truncate">{p.name}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Progress value={percentage} className={`flex-1 h-4 ${getStatColor(pokemonIndex)}`} />
                          <div className="w-12 text-sm font-bold text-right text-blue-600 dark:text-blue-400">
                            {totalStats}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
