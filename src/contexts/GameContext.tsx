
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, Player, Pokemon } from '@/types/game';

interface GameContextType {
  state: GameState;
  setCurrentScreen: (screen: GameState['currentScreen']) => void;
  setPlayer: (player: Player) => void;
  addPokemonToTeam: (pokemon: Pokemon) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

type GameAction = 
  | { type: 'SET_CURRENT_SCREEN'; payload: GameState['currentScreen'] }
  | { type: 'SET_PLAYER'; payload: Player }
  | { type: 'ADD_POKEMON_TO_TEAM'; payload: Pokemon }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: GameState = {
  currentScreen: 'menu',
  player: null,
  isLoading: false,
  error: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_CURRENT_SCREEN':
      return { ...state, currentScreen: action.payload };
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
    default:
      return state;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const setCurrentScreen = (screen: GameState['currentScreen']) => {
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: screen });
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

  return (
    <GameContext.Provider value={{
      state,
      setCurrentScreen,
      setPlayer,
      addPokemonToTeam,
      setLoading,
      setError,
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
