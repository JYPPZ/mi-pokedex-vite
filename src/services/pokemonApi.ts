import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'https://pokeapi.co/api/v2',
});

// Pokémon o Pokemon, nunca supe :) esta funcion muestra algunos pokemon en la pagina de inicio
export const getFeaturedPokemon = async () => {
    const featuredIds = [25, 6, 150, 448, 445]; // No sé si sean los mas populares pero se ven bonitos
    const promises = featuredIds.map(id => apiClient.get(`/pokemon/${id}`));
    const responses = await Promise.all(promises);
    return responses.map(res => res.data);
};

// Estadísticas generales
export const getPokemonStats = async () => {
    const response = await apiClient.get('/pokemon?limit=1');
    return {
        total: response.data.count,
        types: 19, // este valor es estático en la API
        generations: 9, // este tambien
    };
};

// Tabla de efectividad de tipos
export const getTypeChart = async () => {
    const response = await apiClient.get('/type');
    const data = response.data;

    const typePromises = data.results.map(async (type: any) => {
        const typeResponse = await apiClient.get(`/type/${type.name}`);
        return typeResponse.data;
    });

    const types = await Promise.all(typePromises);
    const chart: any = {};

    types.forEach((type) => {
        chart[type.name] = {
            double_damage_to: type.damage_relations.double_damage_to.map((t: any) => t.name),
            half_damage_to: type.damage_relations.half_damage_to.map((t: any) => t.name),
            no_damage_to: type.damage_relations.no_damage_to.map((t: any) => t.name),
            double_damage_from: type.damage_relations.double_damage_from.map((t: any) => t.name),
            half_damage_from: type.damage_relations.half_damage_from.map((t: any) => t.name),
            no_damage_from: type.damage_relations.no_damage_from.map((t: any) => t.name),
        };
    });

    return chart;
};

// Buscar Pokémon por nombre o ID
export const searchPokemonByName = async (searchTerm: string) => {
    if (!searchTerm.trim()) return [];

    // Si el searchTerm es un número, buscar por ID exacto primero
    if (/^\d+$/.test(searchTerm.trim())) {
        try {
            const exactMatch = await apiClient.get(`/pokemon/${searchTerm}`);
            return [exactMatch.data];
        } catch (error) {
            // Si no encuentra el ID exacto, continuar con búsqueda por nombre
        }
    }

    // Búsqueda parcial por nombre
    const response = await apiClient.get('/pokemon?limit=1000');
    const data = response.data;

    const filtered = data.results
        .filter((pokemon: any) =>
            pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 10);

    const detailedResults = await Promise.all(
        filtered.map(async (pokemon: any) => {
            const id = Number.parseInt(pokemon.url.split("/").slice(-2, -1)[0]);
            const response = await apiClient.get(`/pokemon/${id}`);
            return response.data;
        })
    );

    return detailedResults;
};

// Obtener Pokémon por ID
export const getPokemonById = async (id: number) => {
    const response = await apiClient.get(`/pokemon/${id}`);
    return response.data;
};

// obtener lista de pokemon
export const getPokemonList = async (limit = 151) => {
    const response = await apiClient.get(`/pokemon?limit=${limit}`);
    return response.data.results;
};

// Obtener todos los tipos de Pokémon
export const getPokemonTypes = async () => {
    const response = await apiClient.get('/type');
    const data = response.data;
    const typeNames = data.results
        .filter((type: any) => !["unknown", "shadow"].includes(type.name))
        .map((type: any) => type.name);
    return typeNames;
};

// Carga los detalles de un "trozo" de la lista maestra.
export const getPokemonDetailsFromList = async (list: { name: string, url: string }[], offset = 0, limit = 20) => {
    const batch = list.slice(offset, offset + limit);
    const promises = batch.map(p => {
        // Extraer el ID de la URL y usar la ruta relativa
        const id = p.url.split("/").slice(-2, -1)[0];
        return apiClient.get(`/pokemon/${id}`);
    });
    const responses = await Promise.all(promises);
    return responses.map(res => res.data);
};

// Obtener datos de la especie de un Pokémon
export const getPokemonSpecies = async (speciesUrl: string) => {
    // Extraer el ID de la URL de especies
    const speciesId = speciesUrl.split("/").slice(-2, -1)[0];
    const response = await apiClient.get(`/pokemon-species/${speciesId}`);
    return response.data;
};

// Obtener cadena evolutiva
export const getEvolutionChain = async (evolutionChainUrl: string) => {
    // Extraer el ID de la URL de evolución
    const chainId = evolutionChainUrl.split("/").slice(-2, -1)[0];
    const response = await apiClient.get(`/evolution-chain/${chainId}`);
    return response.data;
};

// Obtener detalles de movimientos con información de aprendizaje
export const getMoveDetails = async (pokemonMoves: any[], limit = 20) => {
    const movePromises = pokemonMoves.slice(0, limit).map(async (moveInfo: any) => {
        // Extraer el ID del movimiento de la URL
        const moveId = moveInfo.move.url.split("/").slice(-2, -1)[0];
        const response = await apiClient.get(`/move/${moveId}`);
        const moveData = response.data;

        return {
            ...moveData,
            level_learned_at: moveInfo.version_group_details[0]?.level_learned_at || 0,
            move_learn_method: moveInfo.version_group_details[0]?.move_learn_method || { name: "unknown" },
        };
    });

    const movesData = await Promise.all(movePromises);
    return movesData;
};