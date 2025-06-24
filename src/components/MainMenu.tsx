
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';

const MainMenu = () => {
  const { setCurrentScreen } = useGame();
  const [showPressStart, setShowPressStart] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowPressStart(prev => !prev);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    setCurrentScreen('character-creation');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Game Title */}
      <div className="text-center z-10 mb-16">
        <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-2xl">
          POKEMON
        </h1>
        <h2 className="text-4xl font-bold text-yellow-400 mb-2 drop-shadow-xl">
          SHADOW COLOSSEUM
        </h2>
        <p className="text-xl text-gray-300 drop-shadow-lg">REMAKE</p>
      </div>

      {/* Press Start Button */}
      <div className="z-10">
        {showPressStart && (
          <Button
            onClick={handleStart}
            className="text-2xl px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            PRESS START
          </Button>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center z-10">
        <p className="text-gray-400 text-sm">© 2024 - École de Dev Project</p>
      </div>
    </div>
  );
};

export default MainMenu;
