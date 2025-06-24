
import { useCallback } from 'react';

interface UseMovementProps {
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
  onInteraction?: () => void;
}

export const useMovement = ({ position, setPosition, onInteraction }: UseMovementProps) => {
  const MOVE_SPEED = 10;
  const MAP_BOUNDS = {
    minX: 50,
    maxX: 750,
    minY: 100,
    maxY: 550
  };

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    let newX = position.x;
    let newY = position.y;

    switch (event.key) {
      case 'ArrowUp':
        newY = Math.max(MAP_BOUNDS.minY, position.y - MOVE_SPEED);
        break;
      case 'ArrowDown':
        newY = Math.min(MAP_BOUNDS.maxY, position.y + MOVE_SPEED);
        break;
      case 'ArrowLeft':
        newX = Math.max(MAP_BOUNDS.minX, position.x - MOVE_SPEED);
        break;
      case 'ArrowRight':
        newX = Math.min(MAP_BOUNDS.maxX, position.x + MOVE_SPEED);
        break;
      case ' ':
        event.preventDefault();
        if (onInteraction) {
          onInteraction();
        }
        return;
      default:
        return;
    }

    if (newX !== position.x || newY !== position.y) {
      setPosition({ x: newX, y: newY });
    }
  }, [position, setPosition, onInteraction]);

  return { handleKeyPress };
};
