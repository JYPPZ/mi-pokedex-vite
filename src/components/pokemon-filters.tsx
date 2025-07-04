import { useState } from "react"
import { Search, Filter, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import type { FilterOptions } from "@/types/pokemon"

interface PokemonFiltersProps {
  filters: FilterOptions
  types: string[]
  onFiltersChange: (filters: Partial<FilterOptions>) => void
  totalCount: number
  filteredCount: number
}

export function PokemonFilters({ filters, types, onFiltersChange, totalCount, filteredCount }: PokemonFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleTypeToggle = (type: string) => {
    const newTypes = filters.types.includes(type) ? filters.types.filter((t) => t !== type) : [...filters.types, type]
    onFiltersChange({ types: newTypes })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      types: [],
      generation: "all",
      sortBy: "id",
      sortOrder: "asc",
      minStats: 0,
      maxStats: 1000,
    })
  }

  const getTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      normal: "bg-gray-400 hover:bg-gray-500",
      fire: "bg-red-500 hover:bg-red-600",
      water: "bg-blue-500 hover:bg-blue-600",
      electric: "bg-yellow-400 hover:bg-yellow-500",
      grass: "bg-green-500 hover:bg-green-600",
      ice: "bg-blue-300 hover:bg-blue-400",
      fighting: "bg-red-700 hover:bg-red-800",
      poison: "bg-purple-500 hover:bg-purple-600",
      ground: "bg-yellow-600 hover:bg-yellow-700",
      flying: "bg-indigo-400 hover:bg-indigo-500",
      psychic: "bg-pink-500 hover:bg-pink-600",
      bug: "bg-green-400 hover:bg-green-500",
      rock: "bg-yellow-800 hover:bg-yellow-900",
      ghost: "bg-purple-700 hover:bg-purple-800",
      dragon: "bg-indigo-700 hover:bg-indigo-800",
      dark: "bg-gray-800 hover:bg-gray-900",
      steel: "bg-gray-500 hover:bg-gray-600",
      fairy: "bg-pink-300 hover:bg-pink-400",
    }
    return colors[type] || "bg-gray-400 hover:bg-gray-500"
  }

  return (
    <Card className="sticky top-20 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Busca Pokémon por nombre o número..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="pl-10 pr-4"
          />
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {filteredCount.toLocaleString()} de {totalCount.toLocaleString()} Pokémon
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Avanzado
              <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
            </Button>
            {(filters.search || filters.types.length > 0 || filters.minStats > 0 || filters.maxStats < 1000) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Limpiar
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {filters.types.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.types.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className={`${getTypeColor(type)} text-white cursor-pointer`}
                onClick={() => handleTypeToggle(type)}
              >
                {type}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Sort Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => onFiltersChange({ sortBy: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="id">N.º Pokédex</option>
                  <option value="name">Nombre</option>
                  <option value="height">Altura</option>
                  <option value="weight">Peso</option>
                  <option value="stats">Estadística total</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Orden</label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => onFiltersChange({ sortOrder: e.target.value as "asc" | "desc" })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="asc">Ascendente</option>
                  <option value="desc">Descendente</option>
                </select>
              </div>
            </div>

            {/* Stats Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rango de estadística total: {filters.minStats} - {filters.maxStats}
              </label>
              <div className="px-2">
                <Slider
                  value={[filters.minStats, filters.maxStats]}
                  onValueChange={([min, max]) => onFiltersChange({ minStats: min, maxStats: max })}
                  max={1000}
                  min={0}
                  step={10}
                  className="w-full"
                />
              </div>
            </div>

            {/* Type Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Filtrar por tipo</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {types.map((type) => (
                  <Button
                    key={type}
                    variant={filters.types.includes(type) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTypeToggle(type)}
                    className={`capitalize ${filters.types.includes(type) ? `${getTypeColor(type)} text-white border-0` : "hover:scale-105"
                      } transition-all duration-200`}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}