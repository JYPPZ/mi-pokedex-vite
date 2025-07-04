import { Trophy, Target, Shield, Zap, TrendingUp, Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ComparisonAnalysis, ComparisonPokemon } from "@/types/comparison"

interface ComparisonAnalysisProps {
  analysis: ComparisonAnalysis
  pokemon: ComparisonPokemon[]
}

export function ComparisonAnalysisComponent({ analysis, pokemon }: ComparisonAnalysisProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "stats":
        return <TrendingUp className="h-4 w-4" />
      case "speed":
        return <Zap className="h-4 w-4" />
      case "defense":
        return <Shield className="h-4 w-4" />
      case "attack":
        return <Target className="h-4 w-4" />
      default:
        return <Trophy className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "stats":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "speed":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "defense":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "attack":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Winner */}
      <Card className="border-2 border-yellow-200 dark:border-yellow-800 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
            <Trophy className="h-5 w-5" />
            Campeón absoluto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 relative">
              <img
                src={pokemon.find((p) => p.name === analysis.winner)?.sprite || "/placeholder.svg"}
                alt={analysis.winner}
                className="w-full h-full object-contain"
              />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <Trophy className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold capitalize text-yellow-800 dark:text-yellow-200">{analysis.winner}</h3>
              <p className="text-yellow-700 dark:text-yellow-300">Domina con el mayor total de estadísticas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Winners */}
      <Card>
        <CardHeader>
          <CardTitle>Campeones por categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(analysis.categories).map(([category, winner]) => (
              <div key={category} className="text-center space-y-2">
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${getCategoryColor(category)}`}>
                  {getCategoryIcon(category)}
                  <span className="font-medium capitalize">{category}</span>
                </div>
                <div className="space-y-1">
                  <img
                    src={pokemon.find((p) => p.name === winner)?.sprite || "/placeholder.svg"}
                    alt={winner}
                    className="w-12 h-12 mx-auto object-contain"
                  />
                  <div className="font-semibold capitalize text-sm">{winner}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Type Advantages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Análisis de efectividad de tipos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(analysis.typeAdvantages).map(([pokemonName, advantages]) => (
              <div key={pokemonName} className="space-y-2">
                <div className="flex items-center gap-3">
                  <img
                    src={pokemon.find((p) => p.name === pokemonName)?.sprite || "/placeholder.svg"}
                    alt={pokemonName}
                    className="w-8 h-8 object-contain"
                  />
                  <h4 className="font-semibold capitalize">{pokemonName}</h4>
                </div>
                {advantages.length > 0 ? (
                  <div className="flex flex-wrap gap-2 ml-11">
                    {advantages.map((advantage, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs bg-green-50 text-green-700 border-green-200"
                      >
                        {advantage}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 ml-11">Sin ventajas de tipo en esta comparación</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Consejos de batalla
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
