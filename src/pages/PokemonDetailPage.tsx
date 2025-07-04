import { Link, useParams } from "react-router-dom"
import { ArrowLeft, Share2, BarChart3, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { StatsRadar } from "@/components/stats-radar"
import { EvolutionChainComponent } from "@/components/evolution-chain"
import { PokemonMoves } from "@/components/pokemon-moves"
import { usePokemonDetail } from "@/hooks/use-pokemon-detail"
import { useState } from "react"

export default function PokemonDetailPage() {
    //Obtener el ID de la URL
    const { id } = useParams<{ id: string }>();
    const { pokemon, species, moves, loading, error, getEnglishFlavorText, getEnglishGenus } = usePokemonDetail(id || "");
    const [activeSprite, setActiveSprite] = useState<string>("official");

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center space-y-4">
                            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                            <p className="text-xl text-gray-600 dark:text-gray-300">Cargando detalles del Pokémon...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !pokemon) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center space-y-4">
                        <div className="text-6xl mb-4">😵</div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Pokémon no encontrado</h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            {error ? (typeof error === "string" ? error : error.message) : "Este Pokémon no existe."}
                        </p>
                        <Link to="/pokemon">
                            <Button>Volver a la Pokédex</Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const getTypeColor = (type: string): string => {
        const colors: { [key: string]: string } = {
            normal: "bg-gray-100",
            fire: "bg-red-100",
            water: "bg-blue-100",
            electric: "bg-yellow-100",
            grass: "bg-green-100",
            ice: "bg-blue-100",
            fighting: "bg-red-200",
            poison: "bg-purple-100",
            ground: "bg-yellow-200",
            flying: "bg-indigo-100",
            psychic: "bg-pink-100",
            bug: "bg-lime-100",
            rock: "bg-yellow-300",
            ghost: "bg-purple-200",
            dragon: "bg-indigo-200",
            dark: "bg-gray-200",
            steel: "bg-gray-100",
            fairy: "bg-pink-100",
        }
        return colors[type] || "bg-gray-400"
    }

    const getTypeColorStrong = (type: string): string => {
        const colors: { [key: string]: string } = {
          normal: "bg-gray-400",
          fire: "bg-red-500",
          water: "bg-blue-500",
          electric: "bg-yellow-400",
          grass: "bg-green-500",
          ice: "bg-blue-400",
          fighting: "bg-red-600",
          poison: "bg-purple-500",
          ground: "bg-yellow-600",
          flying: "bg-indigo-400",
          psychic: "bg-pink-500",
          bug: "bg-lime-500",
          rock: "bg-yellow-800",
          ghost: "bg-purple-700",
          dragon: "bg-indigo-700",
          dark: "bg-gray-800",
          steel: "bg-gray-500",
          fairy: "bg-pink-400",
        }
        return colors[type] || "bg-gray-400"
    }

    const primaryType = pokemon.types[0]?.type.name
    const totalStats = pokemon.stats.reduce((sum: number, stat: any) => sum + stat.base_stat, 0)

    const sprites = {
        front_default: pokemon.sprites.front_default,
        back_default: pokemon.sprites.back_default,
        front_shiny: pokemon.sprites.front_shiny,
        back_shiny: pokemon.sprites.back_shiny,
        official: pokemon.sprites.other?.["official-artwork"]?.front_default,
        home: pokemon.sprites.other?.home?.front_default,
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
            <div className="container mx-auto px-4 py-8">
                {/* Navigation */}
                <div className="flex items-center justify-between mb-8">
                    <Link to="/pokemon">
                        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                            <ArrowLeft className="h-4 w-4" />
                            Volver a la Pokédex
                        </Button>
                    </Link>

                    <div className="flex items-center gap-2">
                        {pokemon.id > 1 && (
                            <Link to={`/pokemon/${pokemon.id - 1}`}>
                                <Button variant="outline" size="sm">
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                        <span className="text-sm text-gray-600 dark:text-gray-400">#{pokemon.id.toString().padStart(3, "0")}</span>
                        <Link to={`/pokemon/${pokemon.id + 1}`}>
                            <Button variant="outline" size="sm">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Pokemon Image & Basic Info */}
                    <Card className="relative p-8 ${getTypeColor(primaryType)} bg-opacity-10">
                        <div className={`relative p-8 ${getTypeColor(primaryType)} bg-opacity-100`}>
                            <div className="text-center">
                                <div className="w-64 h-64 mx-auto mb-6 relative">
                                    <img
                                        src={
                                            sprites[activeSprite as keyof typeof sprites] ||
                                            "/placeholder.svg?height=256&width=256"
                                        }
                                        alt={pokemon.name}
                                        className="w-full h-full object-contain drop-shadow-2xl"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h1 className="text-4xl font-bold capitalize text-gray-800 dark:text-white mb-2">{pokemon.name}</h1>
                                        <p className="text-lg text-gray-600 dark:text-gray-300">
                                            {species && getEnglishGenus(species.genera)}
                                        </p>
                                    </div>

                                    <div className="flex justify-center gap-2">
                                        {pokemon.types.map((type: any) => (
                                            <Badge
                                                key={type.type.name}
                                                className={`${getTypeColorStrong(type.type.name)} text-white border-0 text-lg px-4 py-2 capitalize`}
                                            >
                                                {type.type.name}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="flex justify-center gap-4">
                                        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                                            <Share2 className="h-4 w-4" />
                                            Compartir
                                        </Button>
                                        <Link to={`/compare?pokemon=${pokemon.id}`}>
                                            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                                                <BarChart3 className="h-4 w-4" />
                                                Comparar
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Quick Stats */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información básica</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Altura</div>
                                        <div className="text-2xl font-bold">{(pokemon.height / 10).toFixed(1)} m</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Peso</div>
                                        <div className="text-2xl font-bold">{(pokemon.weight / 10).toFixed(1)} kg</div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Habilidades</div>
                                    <div className="flex flex-wrap gap-2">
                                        {pokemon.abilities.map((ability: any, index: number) => (
                                            <Badge key={index} variant="outline" className="capitalize">
                                                {ability.ability.name.replace("-", " ")}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {species && (
                                    <div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Descripción</div>
                                        <p className="text-sm leading-relaxed">{getEnglishFlavorText(species.flavor_text_entries)}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Sprite Gallery */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Galería de sprites</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-2">
                                    {Object.entries(sprites).map(
                                        ([key, sprite]) =>
                                            sprite && (
                                                <button
                                                    key={key}
                                                    onClick={() => setActiveSprite(key)}
                                                    className={`p-2 rounded-lg border-2 transition-all ${activeSprite === key
                                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                                                        : "border-gray-200 dark:border-gray-700"
                                                        }`}
                                                >
                                                    <img
                                                        src={sprite || "/placeholder.svg"}
                                                        alt={`${pokemon.name} ${key}`}
                                                        className="w-full h-16 object-contain"
                                                    />
                                                </button>
                                            ),
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Detailed Information Tabs */}
                <Tabs defaultValue="stats" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="stats">Estadísticas</TabsTrigger>
                        <TabsTrigger value="moves">Movimientos</TabsTrigger>
                        <TabsTrigger value="evolution">Evolución</TabsTrigger>
                        <TabsTrigger value="details">Detalles</TabsTrigger>
                    </TabsList>

                    <TabsContent value="stats" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Estadísticas base</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {pokemon.stats.map((stat: any) => (
                                        <div key={stat.stat.name} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="capitalize font-medium">{stat.stat.name.replace("-", " ")}</span>
                                                <span className="font-bold">{stat.base_stat}</span>
                                            </div>
                                            <Progress value={(stat.base_stat / 255) * 100} className="h-2" />
                                        </div>
                                    ))}
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold">Total</span>
                                            <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{totalStats}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Radar de estadísticas</CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-center">
                                    <StatsRadar stats={pokemon.stats} />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="moves">
                        <Card>
                            <CardHeader>
                                <CardTitle>Movimientos ({moves.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <PokemonMoves moves={moves} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="evolution">
                        <Card>
                            <CardContent className="p-6">
                                {species?.evolution_chain.url ? (
                                    <EvolutionChainComponent evolutionChainUrl={species.evolution_chain.url} currentPokemonId={pokemon.id} />
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-600 dark:text-gray-400">Loading evolution chain...</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="details">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Información de crianza</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {species && (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Ratio de captura</span>
                                                <span className="font-medium">{species.capture_rate}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Felicidad base</span>
                                                <span className="font-medium">{species.base_happiness}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Ritmo de crecimiento</span>
                                                <span className="font-medium capitalize">{species.growth_rate.name.replace("-", " ")}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600 dark:text-gray-400">Grupos huevo</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {species.egg_groups.map((group: any, index: number) => (
                                                        <Badge key={index} variant="outline" className="capitalize">
                                                            {group.name.replace("-", " ")}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Datos de juego</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Experiencia base</span>
                                        <span className="font-medium">{pokemon.base_experience || "Desconocido"}</span>
                                    </div>
                                    {species?.habitat && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Hábitat</span>
                                            <span className="font-medium capitalize">{species.habitat.name.replace("-", " ")}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">ID Pokédex</span>
                                        <span className="font-medium">#{pokemon.id.toString().padStart(3, "0")}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}