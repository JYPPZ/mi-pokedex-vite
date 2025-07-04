export interface Pokemon {
  id: number
  name: string
  url: string
  sprites: {
    front_default: string
    other: {
      "official-artwork": {
        front_default: string
      }
      home: {
        front_default: string
      }
    }
  }
  types: Array<{
    type: {
      name: string
      url: string
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
  species: {
    url: string
  }
}

export interface PokemonListItem {
  name: string
  url: string
  id: number
}

export interface PokemonType {
  name: string
  url: string
}

export interface FilterOptions {
  search: string
  types: string[]
  generation: string
  sortBy: string
  sortOrder: "asc" | "desc"
  minStats: number
  maxStats: number
}
