
import React from 'react';

interface PlayerProps {
  position: { row: number; col: number };
  gridSize: number;
}

const Player = ({ position, gridSize }: PlayerProps) => {
  return (
    <div
      className="absolute z-20 transition-all duration-200 flex items-center justify-center"
      style={{
        left: position.col * gridSize,
        top: position.row * gridSize,
        width: gridSize,
        height: gridSize,
      }}
    >
      <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg">
        <div className="w-full h-full bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default Player;
