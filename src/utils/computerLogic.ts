import {
  CENTER_CELL_INDEX,
  CORNER_CELL_INDICES,
  WINNING_COMBINATIONS,
} from '../constants/gameConstants';
import type { BoardState, Player } from '../types/game';

/**
 * Searches for a line where the specified player has 2 cells and the 3rd cell is empty.
 * If found, returns the index of that empty cell; otherwise null.
 */
function findCompletingMove(board: BoardState, player: Player): number | null {
  for (const line of WINNING_COMBINATIONS) {
    const [a, b, c] = line;
    const values = [board[a], board[b], board[c]];
    const indices = [a, b, c];

    const playerCount = values.filter((val) => val === player).length;
    const emptyCount = values.filter((val) => val === null).length;

    if (playerCount === 2 && emptyCount === 1) {
      const emptyIdx = indices.find((idx) => board[idx] === null);
      if (emptyIdx !== undefined) {
        return emptyIdx;
      }
    }
  }
  return null;
}

/**
 * Calculates the next move for the Computer Player ('O') based on the mandatory 5-level priority:
 * 1. If O can win, play the winning move
 * 2. If X can win next, block X
 * 3. Take center (Row 2, Column 2 -> Index 4) if available
 * 4. Take a corner (0, 2, 6, 8) if available
 * 5. Take any available cell
 *
 * Returns the selected cell index (0 to 8), or null if the board is full.
 */
export function getComputerMove(board: BoardState): number | null {
  // Priority 1: If O can win, play the winning move
  const winMove = findCompletingMove(board, 'O');
  if (winMove !== null) {
    return winMove;
  }

  // Priority 2: If X can win next, block X
  const blockMove = findCompletingMove(board, 'X');
  if (blockMove !== null) {
    return blockMove;
  }

  // Priority 3: Take center if available
  if (board[CENTER_CELL_INDEX] === null) {
    return CENTER_CELL_INDEX;
  }

  // Priority 4: Take a corner if available
  for (const cornerIdx of CORNER_CELL_INDICES) {
    if (board[cornerIdx] === null) {
      return cornerIdx;
    }
  }

  // Priority 5: Take any available cell
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      return i;
    }
  }

  return null;
}
