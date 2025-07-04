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
    types: 18, // este valor es estático en la API
    generations: 8, // este tambien
  };
};