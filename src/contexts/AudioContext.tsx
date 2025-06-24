
import React, { createContext, useContext, useRef, useEffect, ReactNode } from 'react';

interface AudioContextType {
  playMainTitle: () => void;
  stopMainTitle: () => void;
  playIntro: () => void;
  stopIntro: () => void;
  stopAllMusic: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  isMuted: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const mainTitleRef = useRef<HTMLAudioElement>(null);
  const introRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = React.useState(false);

  const playMainTitle = () => {
    stopAllMusic();
    if (mainTitleRef.current) {
      mainTitleRef.current.currentTime = 0;
      mainTitleRef.current.play().catch(console.log);
    }
  };

  const stopMainTitle = () => {
    if (mainTitleRef.current) {
      mainTitleRef.current.pause();
    }
  };

  const playIntro = () => {
    stopAllMusic();
    if (introRef.current) {
      introRef.current.currentTime = 0;
      introRef.current.play().catch(console.log);
    }
  };

  const stopIntro = () => {
    if (introRef.current) {
      introRef.current.pause();
    }
  };

  const stopAllMusic = () => {
    stopMainTitle();
    stopIntro();
  };

  const setVolume = (volume: number) => {
    if (mainTitleRef.current) mainTitleRef.current.volume = volume;
    if (introRef.current) introRef.current.volume = volume;
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (mainTitleRef.current) mainTitleRef.current.muted = newMutedState;
    if (introRef.current) introRef.current.muted = newMutedState;
  };

  useEffect(() => {
    // Configuration initiale des audios
    if (mainTitleRef.current) {
      mainTitleRef.current.volume = 0.7;
      mainTitleRef.current.loop = true;
    }
    if (introRef.current) {
      introRef.current.volume = 0.7;
      introRef.current.loop = false; // Pas de boucle pour l'intro
    }
  }, []);

  return (
    <AudioContext.Provider value={{
      playMainTitle,
      stopMainTitle,
      playIntro,
      stopIntro,
      stopAllMusic,
      setVolume,
      toggleMute,
      isMuted,
    }}>
      {/* Audio Elements */}
      <audio ref={mainTitleRef} preload="auto">
        <source src="/audio/MainTitle.mp3" type="audio/mpeg" />
        <source src="/audio/MainTitle.ogg" type="audio/ogg" />
        <source src="/audio/MainTitle.wav" type="audio/wav" />
      </audio>
      
      <audio ref={introRef} preload="auto">
        <source src="/audio/Intro.mp3" type="audio/mpeg" />
        <source src="/audio/Intro.ogg" type="audio/ogg" />
        <source src="/audio/Intro.wav" type="audio/wav" />
      </audio>
      
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
