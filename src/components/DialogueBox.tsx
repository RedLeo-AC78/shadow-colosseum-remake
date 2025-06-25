
"use client"

import React, { useEffect } from 'react';
import { useGame } from '../contexts/GameContext';

const DialogueBox = () => {
  const { state, closeDialogue } = useGame();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        if (state.dialogue.onComplete) {
          state.dialogue.onComplete();
        }
        closeDialogue();
      }
    };

    if (state.dialogue.isActive) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [state.dialogue.isActive, state.dialogue.onComplete, closeDialogue]);

  if (!state.dialogue.isActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
      <div className="w-full max-w-4xl bg-white border-4 border-black rounded-lg p-6 shadow-lg">
        <div className="mb-2">
          <span className="font-bold text-lg text-blue-600">{state.dialogue.speaker}</span>
        </div>
        <div className="text-black text-xl mb-4">
          {state.dialogue.text}
        </div>
        <div className="text-right text-sm text-gray-500">
          Appuyez sur ESPACE ou ENTRÉE pour continuer
        </div>
      </div>
    </div>
  );
};

export default DialogueBox;
