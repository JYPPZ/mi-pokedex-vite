import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { getPokemonList, getPokemonTypes, getPokemonDetailsFromList } from "@/services/pokemonApi"; // Funciones de servicio
import type { FilterOptions } from "@/types/pokemon";
const PAGE_SIZE = 20;

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
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch] = useDebounce(filters.search, 300);

  //query para los tipos
  const { data: types = [] } = useQuery({
    queryKey: ['pokemonTypes'],
    queryFn: getPokemonTypes,
    staleTime: Infinity,
  });

  // Lista pokemon
  const { data: allPokemonList = [], isLoading: isLoadingList } = useQuery({
    queryKey: ['allPokemonList'],
    queryFn: () => getPokemonList(1302),
    staleTime: Infinity,
  });

  // query para TODOS los detalles. Sin paginación
  const { data: allPokemonDetails = [], isLoading: isLoadingAllDetails } = useQuery({
    queryKey: ['allPokemonDetails'],
    queryFn: () => getPokemonDetailsFromList(allPokemonList, 0, allPokemonList.length),
    staleTime: Infinity,
    enabled: allPokemonList.length > 0,
  });

  // Lógica de filtrado y ordenamiento en el CLIENTE
  const processedPokemon = useMemo(() => {
    let filtered = [...allPokemonDetails];

    // Filtro de búsqueda
    if (debouncedSearch) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.id.toString().includes(debouncedSearch)
      );
    }

    // Type filter
    if (filters.types.length > 0) {
      filtered = filtered.filter((p) =>
        p.types.some((type: any) => filters.types.includes(type.type.name)))
    }

    // Stats filter
    filtered = filtered.filter(p => {
      const totalStats = p.stats.reduce((sum: number, stat: any) => sum + stat.base_stat, 0);
      return totalStats >= filters.minStats && totalStats <= filters.maxStats;
    });

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
  }, [allPokemonDetails, filters, debouncedSearch]);

  // Resetea la página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, debouncedSearch]);

  // Paginación en el lado del cliente
  const paginatedPokemon = useMemo(() => {
    const end = currentPage * PAGE_SIZE;
    return processedPokemon.slice(0, end);
  }, [processedPokemon, currentPage]);

  // Función para cargar más
  const loadMore = () => {
    const hasMoreToLoad = paginatedPokemon.length < processedPokemon.length;
    if (hasMoreToLoad) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    pokemon: paginatedPokemon,
    loading: isLoadingList || isLoadingAllDetails,
    loadingMore: false,
    hasMore: paginatedPokemon.length < processedPokemon.length,
    types,
    filters,
    updateFilters,
    loadMore,
    totalCount: allPokemonDetails.length,
    filteredCount: processedPokemon.length,
  };
}
