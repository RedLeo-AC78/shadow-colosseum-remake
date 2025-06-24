
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import MainMenu from './MainMenu';
import CharacterCreation from './CharacterCreation';

const GameScreen = () => {
  const { state } = useGame();

  const renderCurrentScreen = () => {
    switch (state.currentScreen) {
      case 'menu':
        return <MainMenu />;
      case 'character-creation':
        return <CharacterCreation />;
      case 'cinematic':
        return (
          <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-white text-2xl">Cinématique à venir...</div>
          </div>
        );
      case 'exploration':
        return (
          <div className="min-h-screen bg-green-800 flex items-center justify-center">
            <div className="text-white text-2xl">Mode Exploration à venir...</div>
          </div>
        );
      case 'combat':
        return (
          <div className="min-h-screen bg-red-800 flex items-center justify-center">
            <div className="text-white text-2xl">Combat à venir...</div>
          </div>
        );
      default:
        return <MainMenu />;
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      {renderCurrentScreen()}
      
      {/* Debug info en mode développement */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-black/80 text-white p-2 rounded text-xs">
          <p>Screen: {state.currentScreen}</p>
          {state.player && (
            <>
              <p>Player: {state.player.name}</p>
              <p>Team: {state.player.team.length} Pokémon</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GameScreen;
