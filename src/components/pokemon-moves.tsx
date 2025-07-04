import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { MoveDetail } from "@/types/pokemon-detail"

interface PokemonMovesProps {
  moves: MoveDetail[]
}

export function PokemonMoves({ moves }: PokemonMovesProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedMethod, setSelectedMethod] = useState<string>("all")

  const types = [...new Set(moves.map((move) => move.type.name))]
  const methods = [...new Set(moves.map((move) => move.move_learn_method?.name || "unknown"))]

  const filteredMoves = moves.filter((move) => {
    const matchesSearch = move.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || move.type.name === selectedType
    const matchesMethod = selectedMethod === "all" || move.move_learn_method?.name === selectedMethod
    return matchesSearch && matchesType && matchesMethod
  })

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

  const getDamageClassColor = (damageClass: string): string => {
    const colors = {
      physical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      special: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      status: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    }
    return colors[damageClass as keyof typeof colors] || colors.status
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar movimientos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
        >
          <option value="all">Todos los tipos</option>
          {types.map((type) => (
            <option key={type} value={type} className="capitalize">
              {type}
            </option>
          ))}
        </select>

        <select
          value={selectedMethod}
          onChange={(e) => setSelectedMethod(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
        >
          <option value="all">Todos los métodos</option>
          {methods.map((method) => (
            <option key={method} value={method} className="capitalize">
              {method.replace("-", " ")}
            </option>
          ))}
        </select>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        Mostrando {filteredMoves.length} de {moves.length} movimientos
      </div>

      <div className="grid gap-4">
        {filteredMoves.map((move, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold capitalize text-lg">{move.name.replace("-", " ")}</h4>
                    <Badge className={`${getTypeColor(move.type.name)} text-white border-0 capitalize`}>
                      {move.type.name}
                    </Badge>
                    <Badge className={getDamageClassColor(move.damage_class.name)} variant="outline">
                      {move.damage_class.name}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {move.flavor_text_entries.find((entry) => entry.language.name === "es")?.flavor_text ||
                      move.flavor_text_entries.find((entry) => entry.language.name === "en")?.flavor_text ||
                      move.effect_entries.find((entry) => entry.language.name === "es")?.effect ||
                      move.effect_entries.find((entry) => entry.language.name === "en")?.effect ||
                      "Sin descripción disponible."}
                  </p>

                  <div className="flex items-center gap-4 text-sm">
                    {move.level_learned_at > 0 && (
                      <span className="text-blue-600 dark:text-blue-400">Nivel {move.level_learned_at}</span>
                    )}
                    <span className="text-gray-500 capitalize">
                      {move.move_learn_method?.name?.replace("-", " ") || "Método desconocido"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-6 text-sm">
                  {move.power && (
                    <div className="text-center">
                      <div className="font-semibold text-red-600 dark:text-red-400">{move.power}</div>
                      <div className="text-gray-500">Poder</div>
                    </div>
                  )}
                  {move.accuracy && (
                    <div className="text-center">
                      <div className="font-semibold text-blue-600 dark:text-blue-400">{move.accuracy}%</div>
                      <div className="text-gray-500">Precisión</div>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="font-semibold text-green-600 dark:text-green-400">{move.pp}</div>
                    <div className="text-gray-500">PP</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}