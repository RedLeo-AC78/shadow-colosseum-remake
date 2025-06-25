
import React from 'react';

interface WillieProps {
  position: { row: number; col: number };
  gridSize: number;
}

const Willie = ({ position, gridSize }: WillieProps) => {
  return (
    <div
      className="absolute z-15 transition-all duration-200 flex items-center justify-center"
      style={{
        left: position.col * gridSize,
        top: position.row * gridSize,
        width: gridSize,
        height: gridSize,
      }}
    >
      {/* Placeholder Willie - cercle vert */}
      <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg">
        <div className="w-full h-full bg-gradient-to-b from-green-400 to-green-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default Willie;
