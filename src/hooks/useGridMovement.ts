
import { useCallback } from 'react';

interface Position {
  row: number;
  col: number;
}

interface GridBounds {
  rows: number;
  cols: number;
}

interface UseGridMovementProps {
  position: Position;
  setPosition: (position: Position) => void;
  gridBounds: GridBounds;
  blockedTiles: Set<string>;
  onInteraction?: () => void;
}

export function useGridMovement({
  position,
  setPosition,
  gridBounds,
  blockedTiles,
  onInteraction
}: UseGridMovementProps) {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    let newRow = position.row;
    let newCol = position.col;

    switch (event.key) {
      case 'ArrowUp':
      case 'z':
      case 'Z':
        newRow = Math.max(0, position.row - 1);
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        newRow = Math.min(gridBounds.rows - 1, position.row + 1);
        break;
      case 'ArrowLeft':
      case 'q':
      case 'Q':
        newCol = Math.max(0, position.col - 1);
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        newCol = Math.min(gridBounds.cols - 1, position.col + 1);
        break;
      case ' ':
      case 'Enter':
        event.preventDefault();
        if (onInteraction) {
          onInteraction();
        }
        return;
      default:
        return;
    }

    const tileKey = `${newRow},${newCol}`;
    if (!blockedTiles.has(tileKey)) {
      setPosition({ row: newRow, col: newCol });
    }
  }, [position, setPosition, gridBounds, blockedTiles, onInteraction]);

  return { handleKeyPress };
}
