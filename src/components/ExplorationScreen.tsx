
"use client"

import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import Player from './Player';
import DialogueBox from './DialogueBox';
import { useGridMovement } from '../hooks/useGridMovement';

const ExplorationScreen = () => {
  const { state, setCurrentZone, setDialogue, setCurrentScreen, updateFlag } = useGame();
  const [playerPosition, setPlayerPosition] = useState({ row: 10, col: 15 });
  const [willieChallengePending, setWillieChallengePending] = useState(false);

  const GRID_SIZE = 32;
  const MAP_ROWS = 18;
  const MAP_COLS = 25;

  const blockedTiles = new Set([
    '8,10', '8,11', '9,10', '9,11',
    '8,16', '8,17', '9,16', '9,17',
    '6,12', '6,13', '6,14', '6,15',
    '7,12', '7,13', '7,14', '7,15',
    '8,12', '8,13', '8,14', '8,15',
  ]);

  const handleWillieChallenge = () => {
    setDialogue({
      isActive: true,
      speaker: 'Willie',
      text: 'Maintenant que nous nous connaissons, que dis-tu d\'un combat Pokémon ?',
      onComplete: () => {
        updateFlag('willieChallengeAvailable', false);
        setCurrentScreen('combat');
      }
    });
  };

  const { handleKeyPress } = useGridMovement({
    position: playerPosition,
    setPosition: setPlayerPosition,
    gridBounds: { rows: MAP_ROWS, cols: MAP_COLS },
    blockedTiles,
    onInteraction: () => {
      if ((playerPosition.row === 6 && playerPosition.col === 6) || 
          (playerPosition.row === 6 && playerPosition.col === 7)) {
        setCurrentZone('gas-station-interior');
        return;
      }
    }
  });

  useEffect(() => {
    if (state.flags.willieChallengeAvailable && !willieChallengePending && !state.dialogue.isActive) {
      setWillieChallengePending(true);
      setTimeout(() => {
        handleWillieChallenge();
      }, 500);
    }
  }, [state.flags.willieChallengeAvailable, willieChallengePending, state.dialogue.isActive]);

  useEffect(() => {
    if ((playerPosition.row === 6 && playerPosition.col === 6) || 
        (playerPosition.row === 6 && playerPosition.col === 7)) {
      setCurrentZone('gas-station-interior');
    }
  }, [playerPosition, setCurrentZone]);

  useEffect(() => {
    if (state.dialogue.isActive) return;
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress, state.dialogue.isActive]);

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
        <div 
          className="relative"
          style={{
            width: MAP_COLS * GRID_SIZE,
            height: MAP_ROWS * GRID_SIZE,
            backgroundImage: 'url(/lovable-uploads/47770473-884f-4dae-b810-f32d8fa7d3af.png)',
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

          <Player position={playerPosition} gridSize={GRID_SIZE} />
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-4 left-4 bg-black/80 text-white p-2 rounded text-xs">
            <p>Zone: Station service extérieur</p>
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

export default ExplorationScreen;
