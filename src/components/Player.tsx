
import React from 'react';

interface PlayerProps {
  position: { x: number; y: number };
}

const Player = ({ position }: PlayerProps) => {
  return (
    <div
      className="absolute z-20 transition-all duration-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Placeholder du joueur - Un cercle coloré pour l'instant */}
      <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg">
        <div className="w-full h-full bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default Player;
