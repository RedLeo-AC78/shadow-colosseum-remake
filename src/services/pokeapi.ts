
import { Pokemon, PokemonApiResponse, MoveApiResponse, PokemonMove } from '@/types/game';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemonMove(moveUrl: string): Promise<PokemonMove> {
  try {
    const response = await fetch(moveUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch move: ${response.statusText}`);
    }
    
    const data: MoveApiResponse = await response.json();
    
    return {
      name: data.name,
      power: data.power || 40, // Défaut si pas de puissance
      pp: data.pp,
      maxPp: data.pp,
      type: data.type.name,
      accuracy: data.accuracy || 100
    };
  } catch (error) {
    console.error('Error fetching move:', error);
    // Retourner un mouvement par défaut en cas d'erreur
    return {
      name: 'tackle',
      power: 40,
      pp: 35,
      maxPp: 35,
      type: 'normal',
      accuracy: 100
    };
  }
}

export async function fetchPokemon(pokemonId: number, level: number = 5): Promise<Pokemon> {
  try {
    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${pokemonId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon: ${response.statusText}`);
    }
    
    const data: PokemonApiResponse = await response.json();
    
    // Récupérer les 4 premiers mouvements
    const movePromises = data.moves.slice(0, 4).map(moveData => 
      fetchPokemonMove(moveData.move.url)
    );
    const moves = await Promise.all(movePromises);
    
    // Calculer les stats basées sur le niveau
    const baseHp = data.stats.find(s => s.stat.name === 'hp')?.base_stat || 45;
    const baseAttack = data.stats.find(s => s.stat.name === 'attack')?.base_stat || 50;
    const baseDefense = data.stats.find(s => s.stat.name === 'defense')?.base_stat || 50;
    const baseSpeed = data.stats.find(s => s.stat.name === 'speed')?.base_stat || 50;
    
    // Formule simplifiée de calcul des stats Pokémon
    const hp = Math.floor(((baseHp * 2) * level) / 100) + level + 10;
    const attack = Math.floor(((baseAttack * 2) * level) / 100) + 5;
    const defense = Math.floor(((baseDefense * 2) * level) / 100) + 5;
    const speed = Math.floor(((baseSpeed * 2) * level) / 100) + 5;
    
    return {
      id: data.id,
      name: data.name,
      sprite: data.sprites.front_default,
      types: data.types.map(t => t.type.name),
      level,
      stats: {
        hp,
        maxHp: hp,
        attack,
        defense,
        speed
      },
      moves
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

// Créer l'équipe de Willie (Zigzagoon niveau 5, Linoone niveau 7)
export async function createWillieTeam(): Promise<Pokemon[]> {
  try {
    const zigzagoon = await fetchPokemon(263, 5); // Zigzagoon
    const linoone = await fetchPokemon(264, 7);   // Linoone
    return [zigzagoon, linoone];
  } catch (error) {
    console.error('Error creating Willie team:', error);
    return [];
  }
}
