
export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  level: number;
  stats: {
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  moves: PokemonMove[];
}

export interface PokemonMove {
  name: string;
  power: number;
  pp: number;
  maxPp: number;
  type: string;
  accuracy: number;
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

export type Zone = 'gas-station-exterior' | 'gas-station-interior';

export interface DialogueState {
  isActive: boolean;
  speaker: string;
  text: string;
  onComplete?: () => void;
}

export interface GameFlags {
  willieFirstMeeting: boolean;
  willieChallengeAvailable: boolean;
  gameCompleted: boolean;
}

export interface GameState {
  currentScreen: 'menu' | 'character-creation' | 'cinematic' | 'exploration' | 'combat';
  currentZone: Zone;
  player: Player | null;
  dialogue: DialogueState;
  flags: GameFlags;
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
  moves: Array<{
    move: {
      name: string;
      url: string;
    };
  }>;
}

export interface MoveApiResponse {
  name: string;
  power: number;
  pp: number;
  accuracy: number;
  type: {
    name: string;
  };
}
