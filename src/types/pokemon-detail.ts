export interface PokemonSpecies {
  id: number
  name: string
  flavor_text_entries: Array<{
    flavor_text: string
    language: {
      name: string
    }
    version: {
      name: string
    }
  }>
  genera: Array<{
    genus: string
    language: {
      name: string
    }
  }>
  habitat: {
    name: string
  } | null
  evolution_chain: {
    url: string
  }
  capture_rate: number
  base_happiness: number
  growth_rate: {
    name: string
  }
  egg_groups: Array<{
    name: string
  }>
}

export interface EvolutionChain {
  id: number
  chain: EvolutionNode
}

export interface EvolutionNode {
  species: {
    name: string
    url: string
  }
  evolution_details: Array<{
    min_level: number | null
    trigger: {
      name: string
    }
    item: {
      name: string
    } | null
    held_item: {
      name: string
    } | null
    time_of_day: string
    location: {
      name: string
    } | null
    min_happiness: number | null
    min_beauty: number | null
    min_affection: number | null
    relative_physical_stats: number | null
    party_species: {
      name: string
    } | null
    party_type: {
      name: string
    } | null
    trade_species: {
      name: string
    } | null
    needs_overworld_rain: boolean
    turn_upside_down: boolean
  }>
  evolves_to: EvolutionNode[]
}

export interface Move {
  name: string
  url: string
  level_learned_at: number
  move_learn_method: {
    name: string
  }
  version_group_details: Array<{
    level_learned_at: number
    move_learn_method: {
      name: string
    }
    version_group: {
      name: string
    }
  }>
}

export interface MoveDetail {
  id: number
  name: string
  type: {
    name: string
  }
  power: number | null
  pp: number
  accuracy: number | null
  priority: number
  damage_class: {
    name: string
  }
  effect_entries: Array<{
    effect: string
    language: {
      name: string
    }
  }>
  flavor_text_entries: Array<{
    flavor_text: string
    language: {
      name: string
    }
  }>
}
