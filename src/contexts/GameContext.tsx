
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, Player, Zone, DialogueState, GameFlags } from '../types/game';

interface GameContextType {
  state: GameState;
  setCurrentScreen: (screen: GameState['currentScreen']) => void;
  setCurrentZone: (zone: Zone) => void;
  setPlayer: (player: Player) => void;
  setDialogue: (dialogue: DialogueState) => void;
  closeDialogue: () => void;
  updateFlag: (flag: keyof GameFlags, value: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

type GameAction =
  | { type: 'SET_SCREEN'; payload: GameState['currentScreen'] }
  | { type: 'SET_ZONE'; payload: Zone }
  | { type: 'SET_PLAYER'; payload: Player }
  | { type: 'SET_DIALOGUE'; payload: DialogueState }
  | { type: 'CLOSE_DIALOGUE' }
  | { type: 'UPDATE_FLAG'; payload: { flag: keyof GameFlags; value: boolean } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

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
  error: null
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, currentScreen: action.payload };
    case 'SET_ZONE':
      return { ...state, currentZone: action.payload };
    case 'SET_PLAYER':
      return { ...state, player: action.payload };
    case 'SET_DIALOGUE':
      return { ...state, dialogue: action.payload };
    case 'CLOSE_DIALOGUE':
      return { ...state, dialogue: { ...state.dialogue, isActive: false } };
    case 'UPDATE_FLAG':
      return {
        ...state,
        flags: { ...state.flags, [action.payload.flag]: action.payload.value }
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

  const contextValue: GameContextType = {
    state,
    setCurrentScreen: (screen) => dispatch({ type: 'SET_SCREEN', payload: screen }),
    setCurrentZone: (zone) => dispatch({ type: 'SET_ZONE', payload: zone }),
    setPlayer: (player) => dispatch({ type: 'SET_PLAYER', payload: player }),
    setDialogue: (dialogue) => dispatch({ type: 'SET_DIALOGUE', payload: dialogue }),
    closeDialogue: () => dispatch({ type: 'CLOSE_DIALOGUE' }),
    updateFlag: (flag, value) => dispatch({ type: 'UPDATE_FLAG', payload: { flag, value } }),
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error })
  };

  return (
    <GameContext.Provider value={contextValue}>
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
