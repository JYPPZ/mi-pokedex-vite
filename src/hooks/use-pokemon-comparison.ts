import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import type { ComparisonPokemon, TypeEffectiveness, ComparisonAnalysis } from "@/types/comparison"
import { searchPokemonByName, getPokemonById, getTypeChart } from "@/services/pokemonApi";

export function usePokemonComparison() {
  const [selectedPokemon, setSelectedPokemon] = useState<ComparisonPokemon[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // obtener la tabla de tipos.
  const { data: typeChart = {} } = useQuery<TypeEffectiveness>({
    queryKey: ['typeChart'],
    queryFn: getTypeChart,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // para los resultados de búsqueda
  const { data: searchResults = [], isLoading: isSearchLoading } = useQuery<any[]>({
    queryKey: ['pokemonSearch', debouncedSearchTerm],
    queryFn: () => searchPokemonByName(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length >= 2,
  });
  // añadir/quitar Pokemon
  const addPokemon = async (pokemonId: number) => {
    if (selectedPokemon.length >= 4 || selectedPokemon.some((p) => p.id === pokemonId)) {
      return;
    }

    const data = await getPokemonById(pokemonId);

    const comparisonPokemon: ComparisonPokemon = {
      id: data.id,
      name: data.name,
      sprite: data.sprites?.other?.["official-artwork"]?.front_default || data.sprites?.front_default,
      types: data.types,
      stats: data.stats,
      height: data.height,
      weight: data.weight,
      abilities: data.abilities,
      base_experience: data.base_experience || 0,
    };

    setSelectedPokemon((prev) => [...prev, comparisonPokemon]);
    setSearchTerm("");
  };

  const removePokemon = (pokemonId: number) => {
    setSelectedPokemon((prev) => prev.filter((p) => p.id !== pokemonId));
  };

  const clearAll = () => {
    setSelectedPokemon([]);
  };

  // Analysis
  const analysis = useMemo((): ComparisonAnalysis | null => {
    if (selectedPokemon.length < 2) return null

    const statTotals = selectedPokemon.map((pokemon) => ({
      name: pokemon.name,
      total: pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0),
      hp: pokemon.stats.find((s) => s.stat.name === "hp")?.base_stat || 0,
      attack: pokemon.stats.find((s) => s.stat.name === "attack")?.base_stat || 0,
      defense: pokemon.stats.find((s) => s.stat.name === "defense")?.base_stat || 0,
      speed: pokemon.stats.find((s) => s.stat.name === "speed")?.base_stat || 0,
    }))

    const winners = {
      stats: statTotals.reduce((max, current) => (current.total > max.total ? current : max)).name,
      speed: statTotals.reduce((max, current) => (current.speed > max.speed ? current : max)).name,
      defense: statTotals.reduce((max, current) => (current.defense > max.defense ? current : max)).name,
      attack: statTotals.reduce((max, current) => (current.attack > max.attack ? current : max)).name,
      overall: statTotals.reduce((max, current) => (current.total > max.total ? current : max)).name,
    }

    // Type advantages
    const typeAdvantages: { [pokemonName: string]: string[] } = {}
    selectedPokemon.forEach((pokemon) => {
      const advantages: string[] = []
      const pokemonTypes = pokemon.types.map((t) => t.type.name)

      selectedPokemon.forEach((opponent) => {
        if (opponent.id === pokemon.id) return

        const opponentTypes = opponent.types.map((t) => t.type.name)
        pokemonTypes.forEach((type) => {
          if (typeChart[type]) {
            opponentTypes.forEach((opponentType) => {
              if (typeChart[type].double_damage_to.includes(opponentType)) {
                advantages.push(`Super effective against ${opponent.name} (${opponentType})`)
              }
            })
          }
        })
      })

      typeAdvantages[pokemon.name] = advantages
    })

    const recommendations = [
      `${winners.overall} has the highest total stats (${statTotals.find((s) => s.name === winners.overall)?.total})`,
      `${winners.speed} is the fastest Pokémon in this comparison`,
      `${winners.defense} has the best defensive capabilities`,
      `${winners.attack} deals the most physical damage`,
    ]

    return {
      winner: winners.overall,
      categories: winners,
      recommendations,
      typeAdvantages,
    }
  }, [selectedPokemon, typeChart])

  return {
    selectedPokemon,
    searchResults,
    searchTerm,
    setSearchTerm,
    loading: isSearchLoading,
    addPokemon,
    removePokemon,
    clearAll,
    analysis,
  }
}
