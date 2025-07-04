import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://pokeapi.co/api/v2',
});

// Pokémon o Pokemon, nunca supe :)
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

    const response = await apiClient.get('/pokemon?limit=1000');
    const data = response.data;

    const filtered = data.results
        .filter(
            (pokemon: any) =>
                pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pokemon.url.split("/").slice(-2, -1)[0].includes(searchTerm)
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