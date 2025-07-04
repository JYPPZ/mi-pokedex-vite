export interface ComparisonPokemon {
  id: number
  name: string
  sprite: string
  types: Array<{
    type: {
      name: string
    }
  }>
  stats: Array<{
    base_stat: number
    stat: {
      name: string
    }
  }>
  height: number
  weight: number
  abilities: Array<{
    ability: {
      name: string
    }
  }>
  base_experience: number
}

export interface TypeEffectiveness {
  [key: string]: {
    double_damage_to: string[]
    half_damage_to: string[]
    no_damage_to: string[]
    double_damage_from: string[]
    half_damage_from: string[]
    no_damage_from: string[]
  }
}

export interface ComparisonAnalysis {
  winner: string
  categories: {
    stats: string
    speed: string
    defense: string
    attack: string
    overall: string
  }
  recommendations: string[]
  typeAdvantages: {
    [pokemonName: string]: string[]
  }
}
