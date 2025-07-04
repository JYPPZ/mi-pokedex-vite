import { useState, useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { getPokemonList, getPokemonTypes, getPokemonDetailsFromList } from "@/services/pokemonApi"; // Funciones de servicio
import type { FilterOptions } from "@/types/pokemon";

// Valor por defecto para los filtros
const initialFilters: FilterOptions = {
  search: "",
  types: [],
  generation: "all",
  sortBy: "id",
  sortOrder: "asc",
  minStats: 0,
  maxStats: 1000,
};

export function usePokemonData() {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [debouncedSearch] = useDebounce(filters.search, 300);

  // Lista pokemon
  const { data: allPokemonList = [], isLoading: isLoadingList } = useQuery({
    queryKey: ['allPokemonList'],
    queryFn: () => getPokemonList(1302), // PokeAPI tiene ~1302 pokémon
    staleTime: Infinity,
  });

  // obtener todos los tipos de Pokémon
  const { data: types = [], isLoading: isLoadingTypes } = useQuery({
    queryKey: ['pokemonTypes'],
    queryFn: getPokemonTypes,
    staleTime: Infinity,
  });

  // Esta es la query que alimenta la UI y se actualiza con los filtros.
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingDetails,
  } = useInfiniteQuery({
    queryKey: ['pokemonDetails'], // Se podría añadir los filtros a la key si la API los soportara
    queryFn: ({ pageParam = 0 }) => getPokemonDetailsFromList(allPokemonList, pageParam, 20), // Nuestra función de servicio ahora recibe la lista
    getNextPageParam: (_lastPage: any, allPages: any[]) => {
      const nextPage = allPages.length * 20;
      return nextPage < allPokemonList.length ? nextPage : undefined;
    },
    enabled: !!allPokemonList.length, // Solo se ejecuta cuando la lista maestra está cargada
    initialPageParam: 0, // <-- Add this line
  });


  // 4. Lógica de filtrado y ordenamiento en el CLIENTE (aplicada a los datos ya cargados).
  const filteredPokemon = useMemo(() => {
    // Aplanamos las páginas en un solo array
    const allFetchedPokemon = data?.pages.flat() || [];

    let filtered = allFetchedPokemon;

    // Search filter
    if (debouncedSearch) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.id.toString().includes(debouncedSearch)
      );
    }

    // Type filter
    if (filters.types.length > 0) {
      filtered = filtered.filter((p) => p.types.some((type: any) => filters.types.includes(type.type.name)))
    }

    // Stats filter
    filtered = filtered.filter((p) => {
      const totalStats = p.stats.reduce((sum: number, stat: any) => sum + stat.base_stat, 0)
      return totalStats >= filters.minStats && totalStats <= filters.maxStats
    })

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (filters.sortBy) {
        case "name":
          aValue = a.name
          bValue = b.name
          break
        case "id":
          aValue = a.id
          bValue = b.id
          break
        case "height":
          aValue = a.height
          bValue = b.height
          break
        case "weight":
          aValue = a.weight
          bValue = b.weight
          break
        case "stats":
          aValue = a.stats.reduce((sum: number, stat: any) => sum + stat.base_stat, 0)
          bValue = b.stats.reduce((sum: number, stat: any) => sum + stat.base_stat, 0)
          break
        default:
          aValue = a.id
          bValue = b.id
      }

      if (filters.sortOrder === "desc") {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    })

    return filtered;
  }, [data, filters, debouncedSearch]);


  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  return {
    pokemon: filteredPokemon,
    loading: isLoadingList || isLoadingTypes,
    loadingMore: isFetchingNextPage,
    hasMore: hasNextPage,
    types,
    filters,
    updateFilters,
    loadMore: fetchNextPage,
    loadingDetails: isLoadingDetails,
  }
}
