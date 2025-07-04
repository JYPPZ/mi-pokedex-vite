import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { X, BarChart3, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PokemonSelector } from "@/components/pokemon-selector"
import { PokemonComparisonChart } from "@/components/pokemon-comparison-chart"
import { ComparisonAnalysisComponent } from "@/components/comparison-analysis"
import { usePokemonComparison } from "@/hooks/use-pokemon-comparison"

export default function ComparePage() {
    const [searchParams] = useSearchParams();
    const {
        selectedPokemon,
        searchResults,
        searchTerm,
        setSearchTerm,
        loading,
        addPokemon,
        removePokemon,
        clearAll,
        analysis,
    } = usePokemonComparison()

    // Leer la URL
    useEffect(() => {
        const pokemonParam = searchParams.get("pokemon")
        if (pokemonParam && selectedPokemon.length === 0) {
            try {
              addPokemon(Number.parseInt(pokemonParam));
            } catch (error) {
              console.error("Pokemon id inválido en la url:", error);
            }
          }
    }, [searchParams, selectedPokemon.length, addPokemon])

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <BarChart3 className="h-8 w-8 text-blue-600" />
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Comparador de Pokémon</h1>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Compara hasta 4 Pokémon lado a lado con estadísticas detalladas, efectividad de tipos y análisis de batalla
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Pokemon Selection */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="sticky top-20">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Selecciona Pokémon ({selectedPokemon.length}/4)</span>
                                    {selectedPokemon.length > 0 && (
                                        <Button variant="outline" size="sm" onClick={clearAll}>
                                            Limpiar todo
                                        </Button>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <PokemonSelector
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    searchResults={searchResults}
                                    loading={loading}
                                    onAddPokemon={addPokemon}
                                    selectedCount={selectedPokemon.length}
                                    maxSelection={4}
                                />

                                {/* Selected Pokemon */}
                                {selectedPokemon.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400">Seleccionados para comparar</h4>
                                        {selectedPokemon.map((pokemon) => (
                                            <div
                                                key={pokemon.id}
                                                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={pokemon.sprite || "/placeholder.svg?height=32&width=32"}
                                                        alt={pokemon.name}
                                                        className="w-8 h-8 object-contain"
                                                    />
                                                    <div>
                                                        <div className="font-medium capitalize text-sm">{pokemon.name}</div>
                                                        <div className="flex gap-1">
                                                            {pokemon.types.map((type) => (
                                                                <span
                                                                    key={type.type.name}
                                                                    className={`${getTypeColor(type.type.name)} text-white text-xs px-1 py-0.5 rounded`}
                                                                >
                                                                    {type.type.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removePokemon(pokemon.id)}
                                                    className="w-6 h-6 p-0 hover:bg-red-100 hover:text-red-600"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Comparison Results */}
                    <div className="lg:col-span-2">
                        {selectedPokemon.length === 0 ? (
                            <Card className="h-96 flex items-center justify-center">
                                <CardContent className="text-center space-y-4">
                                    <div className="text-6xl mb-4">⚔️</div>
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">¡Listo para la batalla!</h3>
                                    <p className="text-gray-600 dark:text-gray-300 max-w-md">
                                        Selecciona al menos 2 Pokémon desde el panel de búsqueda para comenzar a comparar sus estadísticas, habilidades y potencial de batalla.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : selectedPokemon.length === 1 ? (
                            <Card className="h-96 flex items-center justify-center">
                                <CardContent className="text-center space-y-4">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Agrega otro Pokémon</h3>
                                    <p className="text-gray-600 dark:text-gray-300 max-w-md">
                                        Has seleccionado <span className="font-semibold capitalize">{selectedPokemon[0].name}</span>. Agrega al menos un Pokémon más para iniciar la comparación.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-8">
                                {/* Action Buttons */}
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                                        <Download className="h-4 w-4" />
                                        Exportar
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                                        <Share2 className="h-4 w-4" />
                                        Compartir
                                    </Button>
                                </div>

                                {/* Comparison Chart */}
                                <PokemonComparisonChart pokemon={selectedPokemon} />

                                {/* Analysis */}
                                {analysis && <ComparisonAnalysisComponent analysis={analysis} pokemon={selectedPokemon} />}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}