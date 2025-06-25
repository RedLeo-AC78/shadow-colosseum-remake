
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, Player, Pokemon, Zone, DialogueState, GameFlags } from '@/types/game';

interface GameContextType {
  state: GameState;
  setCurrentScreen: (screen: GameState['currentScreen']) => void;
  setCurrentZone: (zone: Zone) => void;
  setPlayer: (player: Player) => void;
  addPokemonToTeam: (pokemon: Pokemon) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setDialogue: (dialogue: DialogueState) => void;
  closeDialogue: () => void;
  updateFlag: (flag: keyof GameFlags, value: boolean) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

type GameAction = 
  | { type: 'SET_CURRENT_SCREEN'; payload: GameState['currentScreen'] }
  | { type: 'SET_CURRENT_ZONE'; payload: Zone }
  | { type: 'SET_PLAYER'; payload: Player }
  | { type: 'ADD_POKEMON_TO_TEAM'; payload: Pokemon }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DIALOGUE'; payload: DialogueState }
  | { type: 'CLOSE_DIALOGUE' }
  | { type: 'UPDATE_FLAG'; payload: { flag: keyof GameFlags; value: boolean } };

const initialState: GameState = {
  currentScreen: 'menu',
  currentZone: 'gas-station-exterior',
  player: null,
  dialogue: {
    isActive: false,
    speaker: '',
    text: ''
  },
  flags: {
    willieFirstMeeting: false,
    willieChallengeAvailable: false,
    gameCompleted: false
  },
  isLoading: false,
  error: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_CURRENT_SCREEN':
      return { ...state, currentScreen: action.payload };
    case 'SET_CURRENT_ZONE':
      return { ...state, currentZone: action.payload };
    case 'SET_PLAYER':
      return { ...state, player: action.payload };
    case 'ADD_POKEMON_TO_TEAM':
      if (!state.player) return state;
      if (state.player.team.length >= 2) return state; // Max 2 Pokémon
      return {
        ...state,
        player: {
          ...state.player,
          team: [...state.player.team, action.payload]
        }
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_DIALOGUE':
      return { ...state, dialogue: action.payload };
    case 'CLOSE_DIALOGUE':
      return { 
        ...state, 
        dialogue: { ...state.dialogue, isActive: false }
      };
    case 'UPDATE_FLAG':
      return {
        ...state,
        flags: {
          ...state.flags,
          [action.payload.flag]: action.payload.value
        }
      };
    default:
      return state;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const setCurrentScreen = (screen: GameState['currentScreen']) => {
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: screen });
  };

  const setCurrentZone = (zone: Zone) => {
    dispatch({ type: 'SET_CURRENT_ZONE', payload: zone });
  };

  const setPlayer = (player: Player) => {
    dispatch({ type: 'SET_PLAYER', payload: player });
  };

  const addPokemonToTeam = (pokemon: Pokemon) => {
    dispatch({ type: 'ADD_POKEMON_TO_TEAM', payload: pokemon });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setDialogue = (dialogue: DialogueState) => {
    dispatch({ type: 'SET_DIALOGUE', payload: dialogue });
  };

  const closeDialogue = () => {
    dispatch({ type: 'CLOSE_DIALOGUE' });
  };

  const updateFlag = (flag: keyof GameFlags, value: boolean) => {
    dispatch({ type: 'UPDATE_FLAG', payload: { flag, value } });
  };

  return (
    <GameContext.Provider value={{
      state,
      setCurrentScreen,
      setCurrentZone,
      setPlayer,
      addPokemonToTeam,
      setLoading,
      setError,
      setDialogue,
      closeDialogue,
      updateFlag,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
