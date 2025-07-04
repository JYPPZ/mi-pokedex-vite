import type React from "react"
import { useQuery } from "@tanstack/react-query";
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { Search, Sparkles, Zap, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { getFeaturedPokemon, getPokemonStats } from "@/services/pokemonApi";

// Componente para el estado de carga
function HomePageSkeleton() {
    return (
        <div className="text-center p-20">
            <h1 className="text-2xl font-bold">Cargando el mundo Pokémon...</h1>
        </div>
    );
}

export default function HomePage() {
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate();
    const { data: featuredPokemon, isLoading: isLoadingFeatured } = useQuery({
        queryKey: ['featuredPokemon'],
        queryFn: getFeaturedPokemon,
    });

    const { data: stats, isLoading: isLoadingStats } = useQuery({
        queryKey: ['pokemonStats'],
        queryFn: getPokemonStats,
        //para que no se vea un "0" mientras carga
        initialData: { total: 0, types: 18, generations: 8 },
    });

    // función de busqueda
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/pokemon?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    //mostramos un esqueleto si los datos principales aún no han llegado
    if (isLoadingFeatured) {
        return <HomePageSkeleton />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
                <div className="relative container mx-auto px-4 py-20">
                    <div className="text-center space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                PokéDex
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                Descubre, explora y domina el mundo Pokémon con la Pokédex digital más completa
                            </p>
                        </div>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    type="text"
                                    placeholder="Busca cualquier Pokémon..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-12 pr-4 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-blue-500 shadow-lg"
                                />
                                <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-6">
                                    Buscar
                                </Button>
                            </div>
                        </form>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
                            {/* Total Pokémon */}
                            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                                <CardContent className="p-6 text-center">
                                    {isLoadingStats ? (
                                        <div className="h-8 w-24 mx-auto bg-gray-200 rounded animate-pulse mb-2" />
                                    ) : (
                                        <div className="text-3xl font-bold text-blue-600">{stats.total.toLocaleString()}</div>
                                    )}
                                    <div className="text-gray-600">Total Pokémon</div>
                                </CardContent>
                            </Card>
                            {/* Types */}
                            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                                <CardContent className="p-6 text-center">
                                    {isLoadingStats ? (
                                        <div className="h-8 w-12 mx-auto bg-gray-200 rounded animate-pulse mb-2" />
                                    ) : (
                                        <div className="text-3xl font-bold text-purple-600">18</div>
                                    )}
                                    <div className="text-gray-600">Tipos</div>
                                </CardContent>
                            </Card>
                            {/* Generations */}
                            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                                <CardContent className="p-6 text-center">
                                    {isLoadingStats ? (
                                        <div className="h-8 w-12 mx-auto bg-gray-200 rounded animate-pulse mb-2" />
                                    ) : (
                                        <div className="text-3xl font-bold text-indigo-600">{stats.generations}</div>
                                    )}
                                    <div className="text-gray-600">Generaciones</div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Pokemon */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Pokémon destacados</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">Conoce algunos de los Pokémon más icónicos</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {featuredPokemon?.map((pokemon) => (
                            <Link key={pokemon.id} to={`/pokemon/${pokemon.id}`}>
                                <Card className="group hover:scale-105 transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl">
                                    <CardContent className="p-6 text-center">
                                        <div className="relative mb-4">
                                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center group-hover:from-blue-100 group-hover:to-purple-100 transition-colors">
                                                <img
                                                    src={
                                                        pokemon.sprites?.other?.["official-artwork"]?.front_default ||
                                                        pokemon.sprites?.front_default
                                                    }
                                                    alt={pokemon.name}
                                                    className="w-20 h-20 object-contain"
                                                />
                                            </div>
                                            <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                                #{pokemon.id.toString().padStart(3, "0")}
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-lg capitalize text-gray-800 dark:text-white">{pokemon.name}</h3>
                                        <div className="flex justify-center gap-1 mt-2">
                                            {pokemon.types?.map((type: any) => (
                                                <span
                                                    key={type.type.name}
                                                    className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getTypeColor(type.type.name)}`}
                                                >
                                                    {type.type.name}
                                                </span>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white/50 dark:bg-gray-800/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Funciones poderosas</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">Todo lo que necesitas para convertirte en un maestro Pokémon</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                <Search className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Búsqueda avanzada</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Encuentra cualquier Pokémon con potentes opciones de búsqueda y filtrado
                            </p>
                        </div>

                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Información detallada</h3>
                            <p className="text-gray-600 dark:text-gray-300">Estadísticas completas, habilidades, movimientos y cadenas evolutivas</p>
                        </div>

                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Comparar</h3>
                            <p className="text-gray-600 dark:text-gray-300">Comparación lado a lado de diferentes Pokémon</p>
                        </div>

                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                                <Heart className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Favoritos</h3>
                            <p className="text-gray-600 dark:text-gray-300">Guarda y organiza tus Pokémon favoritos</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <h2 className="text-4xl font-bold text-gray-800 dark:text-white">¿Listo para comenzar tu aventura?</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Explora el mundo completo de Pokémon con nuestra Pokédex integral
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/pokemon">
                                <Button size="lg" className="px-8 py-4 text-lg rounded-full">
                                    Ver todos los Pokémon
                                </Button>
                            </Link>
                            <Link to="/compare">
                                <Button variant="outline" size="lg" className="px-8 py-4 text-lg rounded-full bg-transparent">
                                    Comparar Pokémon
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

// Helper para colores
function getTypeColor(type: string): string {
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
