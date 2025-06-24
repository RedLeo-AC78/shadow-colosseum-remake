
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { ChevronLeft, ChevronRight, Play, Pause, SkipForward } from 'lucide-react';

const cinematicImages = [
  '/lovable-uploads/3d5e6ffa-479b-4b1e-b687-923197245594.png',
  '/lovable-uploads/e2e1472b-9167-4c07-ae78-b8e06f3ae187.png',
  '/lovable-uploads/7a06a5d1-d664-4059-963c-e1efa69a395d.png',
  '/lovable-uploads/2325bb4a-da7e-47ad-b187-2492fc18e1c6.png',
  '/lovable-uploads/4dd2bbea-a152-4c68-b887-af58f9d071e0.png',
  '/lovable-uploads/456fb112-8896-41ad-9d1e-d6402d5a6a50.png',
  '/lovable-uploads/f2c8e220-ceea-45f2-838f-237cb4bbf67d.png',
  '/lovable-uploads/dbb9f264-a939-4a96-aea6-a4e9807a2e39.png',
  // Ces images représentent les premières 8 de la cinématique
  // Les 18 autres images viendront s'ajouter ici une fois reçues
];

const CinematicSlideshow = () => {
  const { setCurrentScreen } = useGame();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlay]);

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
    setCurrentScreen('exploration');
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
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
