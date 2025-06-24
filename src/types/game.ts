
export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
}

export interface Player {
  name: string;
  team: Pokemon[];
  position: {
    x: number;
    y: number;
    zone: string;
  };
}

export interface GameState {
  currentScreen: 'menu' | 'character-creation' | 'cinematic' | 'exploration' | 'combat';
  player: Player | null;
  isLoading: boolean;
  error: string | null;
}

export interface PokemonApiResponse {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    back_default: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
}
