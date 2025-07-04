import { Link } from "react-router-dom"
import { Heart, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Pokemon } from "@/types/pokemon"

interface PokemonCardProps {
  pokemon: Pokemon
  isFavorite?: boolean
  onToggleFavorite?: (pokemon: Pokemon) => void
}

export function PokemonCard({ pokemon, isFavorite = false, onToggleFavorite }: PokemonCardProps) {
  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)

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

  const getStatColor = (statValue: number): string => {
    if (statValue >= 100) return "text-green-600 dark:text-green-400"
    if (statValue >= 70) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <Card className="group hover:scale-105 hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          {/* Background Gradient based on primary type */}
          <div className={`absolute inset-0 opacity-10 ${getTypeColor(pokemon.types[0]?.type.name)}`} />

          {/* Favorite Button */}
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 z-10 w-8 h-8 p-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              onClick={(e) => {
                e.preventDefault()
                onToggleFavorite(pokemon)
              }}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
            </Button>
          )}

          {/* Pokemon Image */}
          <Link to={`/pokemon/${pokemon.id}`}>
            <div className="relative p-6 text-center">
              <div className="w-32 h-32 mx-auto mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-gray-100/50 dark:from-gray-700/50 dark:to-gray-800/50 rounded-full" />
                <img
                  src={
                    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
                    pokemon.sprites?.other?.home?.front_default ||
                    pokemon.sprites?.front_default ||
                    "/placeholder.svg?height=128&width=128" ||
                    "/placeholder.svg"
                  }
                  alt={pokemon.name}
                  className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Pokemon Number */}
              <div className="absolute top-4 left-4 bg-black/20 text-white text-xs px-2 py-1 rounded-full font-mono">
                #{pokemon.id.toString().padStart(3, "0")}
              </div>
            </div>
          </Link>
        </div>

        <div className="p-4 space-y-3">
          {/* Name */}
          <Link to={`/pokemon/${pokemon.id}`}>
            <h3 className="font-bold text-lg capitalize text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {pokemon.name}
            </h3>
          </Link>

          {/* Types */}
          <div className="flex gap-1 flex-wrap">
            {pokemon.types.map((type) => (
              <Badge
                key={type.type.name}
                className={`${getTypeColor(type.type.name)} text-white border-0 text-xs capitalize`}
              >
                {type.type.name}
              </Badge>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Altura:</span>
              <span className="font-medium">{(pokemon.height / 10).toFixed(1)}m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Peso:</span>
              <span className="font-medium">{(pokemon.weight / 10).toFixed(1)}kg</span>
            </div>
          </div>

          {/* Total Stats */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Estadística total</span>
            </div>
            <span className={`font-bold text-sm ${getStatColor(totalStats)}`}>{totalStats}</span>
          </div>

          {/* Abilities Preview */}
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
            <span className="font-medium">Habilidades: </span>
            {pokemon.abilities
              .slice(0, 2)
              .map((ability) => ability.ability.name)
              .join(", ")}
            {pokemon.abilities.length > 2 && "..."}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
