import { useQuery } from "@tanstack/react-query";
import { getPokemonById, getPokemonSpecies, getEvolutionChain, getMoveDetails } from "@/services/pokemonApi";

export function usePokemonDetail(id: string) {

  // datos básicos del Pokémon
  const { data: pokemon, isLoading: isLoadingPokemon, error: pokemonError } = useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => getPokemonById(Number(id)),
    enabled: !!id,
  });

  // datos de la especie
  const speciesUrl = pokemon?.species.url;
  const { data: species, isLoading: isLoadingSpecies } = useQuery({
    queryKey: ['species', speciesUrl],
    queryFn: () => getPokemonSpecies(speciesUrl!),
    enabled: !!speciesUrl,
    staleTime: Infinity,
  });

  // cadena de evolución
  const evolutionChainUrl = species?.evolution_chain.url;
  const { data: evolutionChain, isLoading: isLoadingEvolution } = useQuery({
    queryKey: ['evolutionChain', evolutionChainUrl],
    queryFn: () => getEvolutionChain(evolutionChainUrl!),
    enabled: !!evolutionChainUrl,
    staleTime: Infinity,
  });

  // detalles de los movimientos.
  const pokemonMoves = pokemon?.moves;
  const { data: moves = [], isLoading: isLoadingMoves } = useQuery({
    queryKey: ['moves', id],
    queryFn: () => getMoveDetails(pokemonMoves!),
    enabled: !!pokemonMoves && pokemonMoves.length > 0,
    staleTime: Infinity,
  });

  const getEnglishFlavorText = (entries: any[]) => {
    const englishEntry = entries.find((entry) => entry.language.name === "en")
    return englishEntry?.flavor_text?.replace(/\f/g, " ") || "No description available."
  }

  const getEnglishGenus = (genera: any[]) => {
    const englishGenus = genera.find((genus) => genus.language.name === "en")
    return englishGenus?.genus || "Unknown Pokémon"
  }

  return {
    pokemon,
    species,
    evolutionChain,
    moves,
    loading: isLoadingPokemon || isLoadingSpecies || isLoadingEvolution || isLoadingMoves,
    error: pokemonError,
    getEnglishFlavorText,
    getEnglishGenus,
  }
}
