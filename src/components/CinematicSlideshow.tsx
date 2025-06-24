
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { ChevronLeft, ChevronRight, Play, Pause, SkipForward, Volume2, VolumeX } from 'lucide-react';

const cinematicImages = [
  '/lovable-uploads/17e89d28-b912-4ab9-8d8f-3d09423cb3ec.png', // Cinématique 1
  '/lovable-uploads/b00a260b-ee1c-49f3-86f1-b6930509807f.png', // Cinématique 2
  '/lovable-uploads/8ffa368d-27d2-4c5b-9168-659ef0f5c73d.png', // Cinématique 3
  '/lovable-uploads/09628e56-dbcc-4325-bb59-92dda1a279bb.png', // Cinématique 4
  '/lovable-uploads/cf204bae-b277-42fb-8f84-4935497c57c1.png', // Cinématique 5
  '/lovable-uploads/899af90a-c511-4a89-a5c3-5cb302e0e3b0.png', // Cinématique 6
  '/lovable-uploads/5e2d6d4f-4f0c-460a-bd11-64048a9a6b73.png', // Cinématique 7
  '/lovable-uploads/57a30905-6d8c-4e89-9a72-1deddd2cfa23.png', // Cinématique 8
  '/lovable-uploads/ae818686-c115-4b47-b53b-64c7687165fa.png', // Cinématique 9
  '/lovable-uploads/4752cfe9-9a9e-4dcb-aa64-31c2875c01cf.png', // Cinématique 10
  '/lovable-uploads/895ea73b-fbb0-4439-b712-08ebb079e569.png', // Cinématique 11
  '/lovable-uploads/841dcd74-f788-4278-857f-bb81ff5b5cfc.png', // Cinématique 12
  '/lovable-uploads/2dc0d3fd-4470-4ba6-a1af-978ae3f14dac.png', // Cinématique 13
  '/lovable-uploads/f68f52ba-474d-4cf6-ac1a-32c06bea46e4.png', // Cinématique 14
  '/lovable-uploads/0fc7f8cb-65af-4c5e-a581-eaae09e596cb.png', // Cinématique 15
  '/lovable-uploads/e3fe4bbd-8c14-4348-832b-a390ed42ce5a.png', // Cinématique 16
  '/lovable-uploads/a123839b-0c51-4b33-b78c-999c68ea6f47.png', // Cinématique 17
  '/lovable-uploads/8970f53b-a03c-4a9a-9c2b-f48e8c1ff2c3.png', // Cinématique 18
  '/lovable-uploads/4bafecb4-1e2f-4704-b88b-ce649e89e1a0.png', // Cinématique 19
  '/lovable-uploads/b6b86646-30b5-408d-83f1-11edd55bf33f.png', // Cinématique 20
  '/lovable-uploads/ce5aa212-797b-4c3c-bd0d-36aa43b5140f.png', // Cinématique 21
  '/lovable-uploads/dc9057fd-8417-49f9-ae88-83c852c65521.png', // Cinématique 22
  '/lovable-uploads/e78aa8db-29a2-444f-88a2-becbdbc8496a.png', // Cinématique 23
  '/lovable-uploads/ccf998e0-cf65-49d1-8742-9916acc7f30a.png', // Cinématique 24
  '/lovable-uploads/9ec66c9d-35ea-406e-9ffe-27046277f542.png', // Cinématique 25
  '/lovable-uploads/66557c3c-538d-4011-99f4-66ad58a80412.png', // Cinématique 26
  '/lovable-uploads/3f473230-a1df-42b1-81fc-22ebecd23ee6.png', // Cinématique 27
];

const CinematicSlideshow = () => {
  const { setCurrentScreen } = useGame();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlay]);

  // Audio management
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.7; // Volume par défaut à 70%
      audio.loop = true; // Boucle la musique
      
      // Démarrer la musique automatiquement
      const playAudio = async () => {
        try {
          await audio.play();
        } catch (error) {
          console.log('Autoplay bloqué par le navigateur:', error);
        }
      };
      
      playAudio();
    }

    // Cleanup: arrêter la musique quand le composant se démonte
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentSlide((prev) => {
        if (prev >= cinematicImages.length - 1) {
          // Fin de la cinématique, passer à l'exploration
          setCurrentScreen('exploration');
          return prev;
        }
        return prev + 1;
      });
      setIsTransitioning(false);
    }, 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
      setIsTransitioning(false);
    }, 300);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setCurrentSlide(index);
  };

  const skipCinematic = () => {
    // Arrêter la musique
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentScreen('exploration');
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        preload="auto"
        className="hidden"
      >
        <source src="/audio/cinematic-music.mp3" type="audio/mpeg" />
        <source src="/audio/cinematic-music.ogg" type="audio/ogg" />
        <source src="/audio/cinematic-music.wav" type="audio/wav" />
        Votre navigateur ne supporte pas l'élément audio.
      </audio>

      {/* Main Image Display */}
      <div className="flex-1 relative">
        <img
          src={cinematicImages[currentSlide]}
          alt={`Cinématique ${currentSlide + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4">
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <div
            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentSlide + 1) / cinematicImages.length) * 100}%`,
            }}
          ></div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              onClick={prevSlide}
              disabled={currentSlide === 0 || isTransitioning}
              variant="outline"
              size="sm"
              className="bg-black/50 border-white/30 text-white hover:bg-white/10"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={toggleAutoPlay}
              variant="outline"
              size="sm"
              className="bg-black/50 border-white/30 text-white hover:bg-white/10"
            >
              {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <Button
              onClick={nextSlide}
              disabled={currentSlide >= cinematicImages.length - 1 || isTransitioning}
              variant="outline"
              size="sm"
              className="bg-black/50 border-white/30 text-white hover:bg-white/10"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button
              onClick={toggleMute}
              variant="outline"
              size="sm"
              className="bg-black/50 border-white/30 text-white hover:bg-white/10"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>

          {/* Slide Counter */}
          <div className="text-white text-sm">
            {currentSlide + 1} / {cinematicImages.length}
          </div>

          {/* Skip Button */}
          <Button
            onClick={skipCinematic}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Passer
          </Button>
        </div>

        {/* Slide Dots */}
        <div className="flex justify-center space-x-2 mt-4">
          {cinematicImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? 'bg-yellow-500 scale-125'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CinematicSlideshow;
