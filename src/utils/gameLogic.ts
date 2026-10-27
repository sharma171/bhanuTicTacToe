import { WINNING_COMBINATIONS } from '../constants/gameConstants';
import type { BoardState, Player, WinState } from '../types/game';

/**
 * Checks all 8 winning combinations across rows, columns, and diagonals.
 * Returns the winning player and the 3 winning indices, or null if no winner yet.
 */
export function calculateWinner(board: BoardState): WinState | null {
  for (const line of WINNING_COMBINATIONS) {
    const [a, b, c] = line;
    const first = board[a];
    if (first && first === board[b] && first === board[c]) {
      return {
        winner: first as Player,
        line,
      };
    }
  }
  return null;
}

/**
 * Checks if the board has reached a draw:
 * All 9 cells are filled and there is no winning combination.
 */
export function checkDraw(board: BoardState, winner: WinState | null): boolean {
  if (winner !== null) {
    return false;
  }
  return board.every((cell) => cell !== null);
}

/**
 * Converts a 0-indexed flat board index (0 to 8) into 1-based Row and Column coordinates.
 * Formula: row = Math.floor(index / 3) + 1, col = (index % 3) + 1
 */
export function indexToRowCol(index: number): { row: number; col: number } {
  return {
    row: Math.floor(index / 3) + 1,
    col: (index % 3) + 1,
  };
}

/**
 * Formats a 0-indexed board position into the human-readable requirement:
 * e.g. "Row 1, Column 1"
 */
export function formatPosition(index: number): string {
  const { row, col } = indexToRowCol(index);
  return `Row ${row}, Column ${col}`;
}

/**
 * Returns an array of all indices (0..8) currently unoccupied (null).
 */
export function getAvailableMoves(board: BoardState): number[] {
  const available: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      available.push(i);
    }
  }
  return available;
}
