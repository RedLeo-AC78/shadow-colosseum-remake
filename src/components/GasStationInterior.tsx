
"use client"

import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import Player from './Player';
import Willie from './Willie';
import DialogueBox from './DialogueBox';
import { useGridMovement } from '../hooks/useGridMovement';

const GasStationInterior = () => {
  const { state, setCurrentZone, setDialogue, updateFlag } = useGame();
  const [playerPosition, setPlayerPosition] = useState({ row: 12, col: 12 });

  const GRID_SIZE = 32;
  const MAP_ROWS = 16;
  const MAP_COLS = 24;
  const WILLIE_POSITION = { row: 12, col: 16 };

  const blockedTiles = new Set([
    '5,8', '5,9', '5,10', '5,11',
    '12,16',
  ]);

  const handleWillieInteraction = () => {
    if (!state.flags.willieFirstMeeting) {
      setDialogue({
        isActive: true,
        speaker: 'Willie',
        text: 'Toi aussi tu es un dresseur de Pokémon ?',
        onComplete: () => {
          updateFlag('willieFirstMeeting', true);
          updateFlag('willieChallengeAvailable', true);
        }
      });
    }
  };

  const { handleKeyPress } = useGridMovement({
    position: playerPosition,
    setPosition: setPlayerPosition,
    gridBounds: { rows: MAP_ROWS, cols: MAP_COLS },
    blockedTiles,
    onInteraction: () => {
      if (playerPosition.row === 15 && playerPosition.col === 4) {
        setCurrentZone('gas-station-exterior');
        return;
      }
      
      const willieDistance = Math.abs(playerPosition.row - WILLIE_POSITION.row) + 
                            Math.abs(playerPosition.col - WILLIE_POSITION.col);
      
      if (willieDistance === 1) {
        handleWillieInteraction();
      }
    }
  });

  useEffect(() => {
    if (state.dialogue.isActive) return;
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress, state.dialogue.isActive]);

  useEffect(() => {
    if (playerPosition.row === 15 && playerPosition.col === 4) {
      setCurrentZone('gas-station-exterior');
    }
  }, [playerPosition, setCurrentZone]);

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
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

          <Willie position={WILLIE_POSITION} gridSize={GRID_SIZE} />
          <Player position={playerPosition} gridSize={GRID_SIZE} />
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-4 left-4 bg-black/80 text-white p-2 rounded text-xs">
            <p>Zone: Station service intérieur</p>
            <p>Position: Ligne {playerPosition.row}, Colonne {playerPosition.col}</p>
            <p>Willie rencontré: {state.flags.willieFirstMeeting ? 'Oui' : 'Non'}</p>
            <p>Défi disponible: {state.flags.willieChallengeAvailable ? 'Oui' : 'Non'}</p>
          </div>
        )}
      </div>

      <DialogueBox />
    </>
  );
};

export default GasStationInterior;
