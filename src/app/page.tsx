
"use client"

import GameScreen from '../components/GameScreen';
import { GameProvider } from '../contexts/GameContext';

export default function Home() {
  return (
    <GameProvider>
      <GameScreen />
    </GameProvider>
  );
}
