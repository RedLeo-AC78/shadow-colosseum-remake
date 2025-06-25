
import { useCallback } from 'react';

interface UseGridMovementProps {
  position: { row: number; col: number };
  setPosition: (pos: { row: number; col: number }) => void;
  gridBounds: { rows: number; cols: number };
  blockedTiles: Set<string>;
  onInteraction?: () => void;
}

export const useGridMovement = ({ 
  position, 
  setPosition, 
  gridBounds, 
  blockedTiles, 
  onInteraction 
}: UseGridMovementProps) => {
  
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    let newRow = position.row;
    let newCol = position.col;

    switch (event.key) {
      case 'ArrowUp':
        newRow = Math.max(0, position.row - 1);
        break;
      case 'ArrowDown':
        newRow = Math.min(gridBounds.rows - 1, position.row + 1);
        break;
      case 'ArrowLeft':
        newCol = Math.max(0, position.col - 1);
        break;
      case 'ArrowRight':
        newCol = Math.min(gridBounds.cols - 1, position.col + 1);
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

    // Vérifier si la nouvelle position est bloquée
    const newPositionKey = `${newRow},${newCol}`;
    if (!blockedTiles.has(newPositionKey) && (newRow !== position.row || newCol !== position.col)) {
      setPosition({ row: newRow, col: newCol });
    }
  }, [position, setPosition, gridBounds, blockedTiles, onInteraction]);

  return { handleKeyPress };
};
