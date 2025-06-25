
import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playMainTitle: () => void;
  playIntro: () => void;
  stopAllMusic: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const mainTitleRef = useRef<HTMLAudioElement | null>(null);
  const introRef = useRef<HTMLAudioElement | null>(null);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (mainTitleRef.current) {
      mainTitleRef.current.muted = !isMuted;
    }
    if (introRef.current) {
      introRef.current.muted = !isMuted;
    }
  };

  const playMainTitle = () => {
    if (!mainTitleRef.current) {
      mainTitleRef.current = new Audio('/audio/main-title.mp3');
      mainTitleRef.current.loop = true;
      mainTitleRef.current.volume = 0.5;
    }
    
    if (!isMuted) {
      mainTitleRef.current.play().catch(console.error);
    }
  };

  const playIntro = () => {
    stopAllMusic();
    
    if (!introRef.current) {
      introRef.current = new Audio('/audio/intro.mp3');
      introRef.current.volume = 0.5;
    }
    
    if (!isMuted) {
      introRef.current.play().catch(console.error);
    }
  };

  const stopAllMusic = () => {
    if (mainTitleRef.current) {
      mainTitleRef.current.pause();
      mainTitleRef.current.currentTime = 0;
    }
    if (introRef.current) {
      introRef.current.pause();
      introRef.current.currentTime = 0;
    }
  };

  const contextValue: AudioContextType = {
    isMuted,
    toggleMute,
    playMainTitle,
    playIntro,
    stopAllMusic
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
