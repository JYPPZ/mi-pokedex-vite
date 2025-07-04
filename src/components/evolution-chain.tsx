import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { EvolutionNode } from "@/types/pokemon-detail"
import { apiClient } from "@/services/pokemonApi";
import { useMemo } from "react";

interface EvolutionChainProps {
  evolutionChainUrl: string;
  currentPokemonId: number;
}

// Función para extraer todos los nombres de una cadena
const extractPokemonNames = (node: EvolutionNode): string[] => {
  const names = [node.species.name]
  node.evolves_to.forEach((evolution) => {
    names.push(...extractPokemonNames(evolution))
  })
  return names
}

export function EvolutionChainComponent({ evolutionChainUrl, currentPokemonId }: EvolutionChainProps) {

  // Query para obtener la cadena de evolución
  const { data: evolutionChainData, isLoading: isLoadingChain } = useQuery({
    queryKey: ['evolutionChain', evolutionChainUrl],
    queryFn: async () => {
      // Usamos fetch porque es una URL completa
      const response = await fetch(evolutionChainUrl);
      if (!response.ok) throw new Error("Failed to fetch evolution chain");
      return response.json();
    },
    enabled: !!evolutionChainUrl, // Se ejecuta solo si la URL existe
    staleTime: Infinity,
  });

  // Extraemos los nombres y hacemos una query para todos sus detalles a la vez
  const pokemonNames = useMemo(() => {
    if (!evolutionChainData) return [];
    return extractPokemonNames(evolutionChainData.chain);
  }, [evolutionChainData]);

  // 3. Query para obtener los detalles de los Pokémon de la cadena
  const { data: evolutionPokemonDetails = [], isLoading: isLoadingDetails } = useQuery({
    queryKey: ['evolutionDetails', pokemonNames],
    queryFn: async () => {
      if (pokemonNames.length === 0) return [];
      const promises = pokemonNames.map(name => apiClient.get(`/pokemon/${name}`));
      const responses = await Promise.all(promises);
      return responses.map(res => ({
        id: res.data.id,
        name: res.data.name,
        sprite: res.data.sprites?.other?.["official-artwork"]?.front_default || res.data.sprites?.front_default,
        types: res.data.types.map((t: any) => t.type.name),
      }));
    },
    enabled: pokemonNames.length > 0, // Se ejecuta solo si tenemos nombres
    staleTime: Infinity,
  });

  const getEvolutionRequirement = (details: any) => {
    if (!details || details.length === 0) return null

    const detail = details[0]
    const requirements = []

    if (detail.min_level) {
      requirements.push(`Nivel ${detail.min_level}`)
    }
    if (detail.item) {
      requirements.push(`Usa ${detail.item.name.replace("-", " ")}`)
    }
    if (detail.held_item) {
      requirements.push(`Sostén ${detail.held_item.name.replace("-", " ")}`)
    }
    if (detail.min_happiness) {
      requirements.push(`Felicidad ${detail.min_happiness}+`)
    }
    if (detail.time_of_day) {
      requirements.push(`Durante el ${detail.time_of_day}`)
    }
    if (detail.location) {
      requirements.push(`En ${detail.location.name.replace("-", " ")}`)
    }
    if (detail.trigger.name === "trade") {
      requirements.push("Intercambio")
    }

    return requirements.length > 0 ? requirements.join(", ") : "Condición especial"
  }

  const renderEvolutionNode = (node: EvolutionNode, depth = 0) => {
    const pokemon = evolutionPokemonDetails.find((p) => p.name === node.species.name)
    if (!pokemon) return []

    const elements = []

    // Current Pokemon
    elements.push(
      <div key={`${pokemon.name}-${depth}`} className="flex flex-col items-center">
        <Card
          className={`group hover:scale-105 transition-all duration-300 ${pokemon.id === currentPokemonId ? "ring-2 ring-blue-500 shadow-lg" : ""
            }`}
        >
          <CardContent className="p-4 text-center">
            <Link to={`/pokemon/${pokemon.id}`}>
              <div className="w-24 h-24 mx-auto mb-2 relative">
                <img
                  src={pokemon.sprite || "/placeholder.svg?height=96&width=96"}
                  alt={pokemon.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h4 className="font-semibold capitalize text-sm mb-1">{pokemon.name}</h4>
              <div className="text-xs text-gray-500">#{pokemon.id.toString().padStart(3, "0")}</div>
            </Link>
          </CardContent>
        </Card>
      </div>,
    )

    // Evolution arrows and next evolutions
    node.evolves_to.forEach((evolution, index) => {
      const requirement = getEvolutionRequirement(evolution.evolution_details)

      elements.push(
        <div key={`arrow-${evolution.species.name}-${index}`} className="flex flex-col items-center mx-4">
          <div className="flex items-center justify-center mb-2">
            <ArrowRight className="h-6 w-6 text-blue-500" />
          </div>
          {requirement && (
            <Badge variant="outline" className="text-xs px-2 py-1 mb-2 text-center max-w-24">
              {requirement}
            </Badge>
          )}
        </div>,
      )

      elements.push(...renderEvolutionNode(evolution, depth + 1))
    })

    return elements
  }

  if (isLoadingChain || isLoadingDetails) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!evolutionChainData) {
    return <p className="text-center text-gray-500">No se pudo cargar la cadena evolutiva.</p>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Cadena evolutiva</h3>
      <div className="flex flex-wrap items-center justify-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl">
        {renderEvolutionNode(evolutionChainData.chain)}
      </div>
    </div>
  )
}