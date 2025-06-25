
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { AudioProvider } from '@/contexts/AudioContext';
import MainMenu from './MainMenu';
import CharacterCreation from './CharacterCreation';
import CinematicSlideshow from './CinematicSlideshow';
import ExplorationScreen from './ExplorationScreen';
import GasStationInterior from './GasStationInterior';
import CombatScreen from './CombatScreen';
import EndScreen from './EndScreen';

const GameScreen = () => {
  const { state } = useGame();

  const renderCurrentScreen = () => {
    switch (state.currentScreen) {
      case 'menu':
        return <MainMenu />;
      case 'character-creation':
        return <CharacterCreation />;
      case 'cinematic':
        return <CinematicSlideshow />;
      case 'exploration':
        if (state.currentZone === 'gas-station-interior') {
          return <GasStationInterior />;
        }
        return <ExplorationScreen />;
      case 'combat':
        return <CombatScreen />;
      case 'end':
        return <EndScreen />;
      default:
        return <MainMenu />;
    }
  };

  return (
    <AudioProvider>
      <div className="w-full h-screen overflow-hidden">
        {renderCurrentScreen()}
        
        {/* Debug info en mode développement */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-50">
            <p>Screen: {state.currentScreen}</p>
            <p>Zone: {state.currentZone}</p>
            {state.player && (
              <>
                <p>Player: {state.player.name}</p>
                <p>Team: {state.player.team.length} Pokémon</p>
              </>
            )}
          </div>
        )}
      </div>
    </AudioProvider>
  );
};

export default GameScreen;
