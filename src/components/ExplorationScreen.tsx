
import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import Player from './Player';
import GasStationMap from './GasStationMap';
import { useMovement } from '@/hooks/useMovement';

const ExplorationScreen = () => {
  const { state } = useGame();
  const [playerPosition, setPlayerPosition] = useState({ x: 400, y: 500 }); // Position de départ
  const [showInteraction, setShowInteraction] = useState(false);

  const { handleKeyPress } = useMovement({
    position: playerPosition,
    setPosition: setPlayerPosition,
    onInteraction: () => {
      // Vérifier si le joueur est devant la porte
      const doorX = 400;
      const doorY = 350;
      const distance = Math.sqrt(
        Math.pow(playerPosition.x - doorX, 2) + Math.pow(playerPosition.y - doorY, 2)
      );
      
      if (distance < 50) {
        setShowInteraction(true);
        setTimeout(() => setShowInteraction(false), 2000);
      }
    }
  });

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-green-600">
      {/* Carte de la station service */}
      <GasStationMap />
      
      {/* Joueur */}
      <Player position={playerPosition} />
      
      {/* Interface d'interaction */}
      {showInteraction && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded">
          Appuyez sur ESPACE pour entrer dans la station service
        </div>
      )}
      
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 bg-black/80 text-white p-2 rounded text-xs">
          <p>Position: {playerPosition.x}, {playerPosition.y}</p>
          <p>Joueur: {state.player?.name}</p>
        </div>
      )}
    </div>
  );
};

export default ExplorationScreen;
