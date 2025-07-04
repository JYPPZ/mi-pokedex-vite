import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Loader2, Grid3X3, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PokemonFilters } from "@/components/pokemon-filters"
import { PokemonCard } from "@/components/pokemon-card"
import { usePokemonData } from "@/hooks/use-pokemon-data"

export default function PokemonListPage() {
    const [searchParams] = useSearchParams();
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const {
        pokemon,
        loading,
        loadingMore,
        hasMore,
        types,
        filters,
        updateFilters,
        loadMore,
        totalCount,
        filteredCount,
    } = usePokemonData();

    // Handle search param from homepage
    useEffect(() => {
        const searchQuery = searchParams.get("search")
        if (searchQuery && searchQuery !== filters.search) {
            updateFilters({ search: searchQuery });
        }
    }, [searchParams, updateFilters, filters.search])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center space-y-4">
                            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                            <p className="text-xl text-gray-600 dark:text-gray-300">Cargando...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Colección de Pokémon</h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Descubre y explora el mundo completo de Pokémon
                            </p>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-1">
                            <Button
                                variant={viewMode === "grid" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewMode("grid")}
                                className="flex items-center gap-2"
                            >
                                <Grid3X3 className="h-4 w-4" />
                                Cuadrícula
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewMode("list")}
                                className="flex items-center gap-2"
                            >
                                <List className="h-4 w-4" />
                                Lista
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <PokemonFilters
                            filters={filters}
                            types={types}
                            onFiltersChange={updateFilters}
                            totalCount={totalCount}
                            filteredCount={filteredCount}
                        />
                    </div>

                    {/* Pokemon Grid */}
                    <div className="lg:col-span-3">
                        {!loading && filteredCount === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No Pokémon Found</h3>
                                <p className="text-gray-600 dark:text-gray-300">Try adjusting your search criteria or filters</p>
                            </div>
                        ) : (
                            <>
                                <div
                                    className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                                        }`}
                                >
                                    {pokemon.map((p) => (
                                        <PokemonCard
                                            key={p.id}
                                            pokemon={p}
                                        />
                                    ))}
                                </div>

                                {/* Load More Button */}
                                {hasMore && (
                                    <div className="text-center mt-12">
                                        <Button onClick={() => loadMore()} disabled={loadingMore} size="lg" className="px-8 py-4 text-lg">
                                            {loadingMore ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                                    Cargando más...
                                                </>
                                            ) : (
                                                "Cargar más Pokémon"
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}