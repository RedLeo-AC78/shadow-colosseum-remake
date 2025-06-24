
import React, { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import Player from './Player';
import { useGridMovement } from '@/hooks/useGridMovement';

const ExplorationScreen = () => {
  const { state } = useGame();
  // Position de départ au centre approximatif (ligne 10, colonne 15 sur une grille ~20x30)
  const [playerPosition, setPlayerPosition] = useState({ row: 10, col: 15 });
  const [showInteraction, setShowInteraction] = useState(false);

  const GRID_SIZE = 32; // Taille de chaque case en pixels
  const MAP_ROWS = 18; // Hauteur de la carte en cases
  const MAP_COLS = 25; // Largeur de la carte en cases

  // Zones bloquées (obstacles comme pompes à essence, bâtiments, etc.)
  const blockedTiles = new Set([
    // Pompes à essence (approximativement)
    '8,10', '8,11', '9,10', '9,11',
    '8,16', '8,17', '9,16', '9,17',
    // Bâtiment principal (approximativement)
    '6,12', '6,13', '6,14', '6,15',
    '7,12', '7,13', '7,14', '7,15',
    '8,12', '8,13', '8,14', '8,15',
  ]);

  const { handleKeyPress } = useGridMovement({
    position: playerPosition,
    setPosition: setPlayerPosition,
    gridBounds: { rows: MAP_ROWS, cols: MAP_COLS },
    blockedTiles,
    onInteraction: () => {
      // Vérifier si le joueur est devant la porte (approximativement ligne 8, colonne 13-14)
      const doorPositions = ['7,13', '7,14', '8,13', '8,14'];
      const playerKey = `${playerPosition.row},${playerPosition.col}`;
      const nearDoor = doorPositions.some(doorPos => {
        const [doorRow, doorCol] = doorPos.split(',').map(Number);
        const distance = Math.abs(playerPosition.row - doorRow) + Math.abs(playerPosition.col - doorCol);
        return distance <= 1;
      });
      
      if (nearDoor) {
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
    <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
      {/* Conteneur de la carte avec l'image de fond */}
      <div 
        className="relative"
        style={{
          width: MAP_COLS * GRID_SIZE,
          height: MAP_ROWS * GRID_SIZE,
          backgroundImage: 'url(/lovable-uploads/dbb9f264-a939-4a96-aea6-a4e9807a2e39.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Grille de débogage (optionnelle) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: MAP_ROWS + 1 }).map((_, row) => (
              <div
                key={`row-${row}`}
                className="absolute w-full border-t border-red-500/30"
                style={{ top: row * GRID_SIZE }}
              />
            ))}
            {Array.from({ length: MAP_COLS + 1 }).map((_, col) => (
              <div
                key={`col-${col}`}
                className="absolute h-full border-l border-red-500/30"
                style={{ left: col * GRID_SIZE }}
              />
            ))}
          </div>
        )}

        {/* Joueur */}
        <Player 
          position={playerPosition} 
          gridSize={GRID_SIZE}
        />
      </div>
      
      {/* Interface d'interaction */}
      {showInteraction && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded">
          Appuyez sur ESPACE pour entrer dans la station service
        </div>
      )}
      
      {/* Informations de débogage */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 bg-black/80 text-white p-2 rounded text-xs">
          <p>Position: Ligne {playerPosition.row}, Colonne {playerPosition.col}</p>
          <p>Joueur: {state.player?.name}</p>
          <p>Coordonnées pixel: {playerPosition.col * GRID_SIZE}, {playerPosition.row * GRID_SIZE}</p>
        </div>
      )}
    </div>
  );
};

export default ExplorationScreen;
