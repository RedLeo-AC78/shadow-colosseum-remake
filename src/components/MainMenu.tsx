
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { Volume, VolumeX } from 'lucide-react';

const MainMenu = () => {
  const { setCurrentScreen } = useGame();
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  const handleStart = () => {
    setCurrentScreen('character-creation');
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
    // Ici on pourra plus tard déclencher l'activation du son
    console.log('Sound toggled:', !isSoundEnabled);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(/lovable-uploads/f2c8e220-ceea-45f2-838f-237cb4bbf67d.png)',
      }}
    >
      {/* Overlay sombre pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Sound Toggle Button */}
      <button
        onClick={toggleSound}
        className="absolute top-8 right-8 z-20 p-3 bg-black/30 rounded-full hover:bg-black/50 transition-all duration-200"
      >
        {isSoundEnabled ? (
          <Volume className="w-6 h-6 text-white" />
        ) : (
          <VolumeX className="w-6 h-6 text-gray-400" />
        )}
      </button>

      {/* Animated background stars */}
      <div className="absolute inset-0 z-0">
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

      {/* Press Start Button with smooth animation */}
      <div className="z-10">
        <Button
          onClick={handleStart}
          className="text-2xl px-8 py-4 bg-transparent border-2 border-yellow-500 text-yellow-500 font-bold rounded-lg transition-all duration-1000 ease-in-out animate-pulse hover:bg-yellow-500 hover:text-black hover:scale-105"
        >
          PRESS START
        </Button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center z-10">
        <p className="text-gray-400 text-sm">© 2024 - École de Dev Project</p>
      </div>
    </div>
  );
};

export default MainMenu;
