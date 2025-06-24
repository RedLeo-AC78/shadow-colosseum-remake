
import React, { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import Player from './Player';
import { useGridMovement } from '@/hooks/useGridMovement';

const GasStationInterior = () => {
  const { setCurrentZone } = useGame();
  // Position de départ au centre/bas de la zone intérieure
  const [playerPosition, setPlayerPosition] = useState({ row: 12, col: 12 });
  const [showInteraction, setShowInteraction] = useState(false);

  const GRID_SIZE = 32; // Taille de chaque case en pixels
  const MAP_ROWS = 16; // Hauteur de la carte en cases (ajustable selon l'image)
  const MAP_COLS = 24; // Largeur de la carte en cases (ajustable selon l'image)

  // Zones bloquées (meubles, comptoirs, etc.) - À définir selon vos spécifications
  const blockedTiles = new Set([
    // Exemple de zones bloquées - vous pouvez les ajuster
    '5,8', '5,9', '5,10', '5,11', // Comptoir du haut
  ]);

  const { handleKeyPress } = useGridMovement({
    position: playerPosition,
    setPosition: setPlayerPosition,
    gridBounds: { rows: MAP_ROWS, cols: MAP_COLS },
    blockedTiles,
    onInteraction: () => {
      // Vérifier si le joueur est près de la sortie (position d'entrée)
      if (playerPosition.row >= 14 && playerPosition.col >= 11 && playerPosition.col <= 13) {
        // Retourner à l'extérieur
        setCurrentZone('gas-station-exterior');
      } else {
        // Autres interactions (PNJ, télévision, etc.)
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
          backgroundImage: 'url(/lovable-uploads/8efff867-484c-46b7-b0ee-4c6871422bef.png)',
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
          Interaction détectée - Appuyez sur ESPACE
        </div>
      )}
      
      {/* Informations de coordonnées - à gauche */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black/80 text-white p-2 rounded text-xs">
          <p>Zone: Station service intérieur</p>
          <p>Position: Ligne {playerPosition.row}, Colonne {playerPosition.col}</p>
          <p>Coordonnées pixel: {playerPosition.col * GRID_SIZE}, {playerPosition.row * GRID_SIZE}</p>
        </div>
      )}
    </div>
  );
};

export default GasStationInterior;
