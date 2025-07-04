import { Search, Plus, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PokemonSelectorProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  searchResults: any[]
  loading: boolean
  onAddPokemon: (id: number) => void
  selectedCount: number
  maxSelection: number
}

export function PokemonSelector({
  searchTerm,
  setSearchTerm,
  searchResults,
  loading,
  onAddPokemon,
  selectedCount,
  maxSelection,
}: PokemonSelectorProps) {
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

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Busca Pokémon para comparar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4"
          disabled={selectedCount >= maxSelection}
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin" />}
      </div>

      {selectedCount >= maxSelection && (
        <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
          Solo se pueden comparar {maxSelection} Pokémon a la vez
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="grid gap-2 max-h-64 overflow-y-auto">
          {searchResults.map((pokemon) => (
            <Card key={pokemon.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={pokemon.sprites?.front_default || "/placeholder.svg?height=40&width=40"}
                      alt={pokemon.name}
                      className="w-10 h-10 object-contain"
                    />
                    <div>
                      <div className="font-medium capitalize">{pokemon.name}</div>
                      <div className="text-xs text-gray-500">#{pokemon.id.toString().padStart(3, "0")}</div>
                    </div>
                    <div className="flex gap-1">
                      {pokemon.types.map((type: any) => (
                        <Badge
                          key={type.type.name}
                          className={`${getTypeColor(type.type.name)} text-white border-0 text-xs`}
                        >
                          {type.type.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onAddPokemon(pokemon.id)}
                    disabled={selectedCount >= maxSelection}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Agregar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
