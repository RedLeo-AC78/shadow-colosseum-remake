
import React from 'react';
import { GameProvider } from '@/contexts/GameContext';
import GameScreen from '@/components/GameScreen';

const Index = () => {
  return (
    <GameProvider>
      <div className="w-full h-screen bg-black">
        <GameScreen />
      </div>
    </GameProvider>
  );
};

export default Index;
