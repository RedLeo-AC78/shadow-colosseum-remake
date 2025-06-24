
import { Pokemon, PokemonApiResponse } from '@/types/game';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemon(pokemonId: number): Promise<Pokemon> {
  try {
    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${pokemonId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon: ${response.statusText}`);
    }
    
    const data: PokemonApiResponse = await response.json();
    
    return {
      id: data.id,
      name: data.name,
      sprite: data.sprites.front_default,
      types: data.types.map(t => t.type.name),
      stats: {
        hp: data.stats.find(s => s.stat.name === 'hp')?.base_stat || 0,
        attack: data.stats.find(s => s.stat.name === 'attack')?.base_stat || 0,
        defense: data.stats.find(s => s.stat.name === 'defense')?.base_stat || 0,
        speed: data.stats.find(s => s.stat.name === 'speed')?.base_stat || 0,
      }
    };
  } catch (error) {
    console.error('Error fetching Pokemon:', error);
    throw error;
  }
}

export async function fetchPokemonList(limit: number = 151): Promise<Array<{ id: number; name: string }>> {
  try {
    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon list: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.results.map((pokemon: any, index: number) => ({
      id: index + 1,
      name: pokemon.name
    }));
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    throw error;
  }
}
