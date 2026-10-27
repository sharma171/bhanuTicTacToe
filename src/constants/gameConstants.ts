import type { BoardState, ScoreboardState, WinningLine } from '../types/game';

export const BOARD_SIZE = 3;
export const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE;

export const WINNING_COMBINATIONS: ReadonlyArray<WinningLine> = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

export const CENTER_CELL_INDEX = 4; // Row 2, Col 2

export const CORNER_CELL_INDICES: ReadonlyArray<number> = [0, 2, 6, 8];

export const EDGE_CELL_INDICES: ReadonlyArray<number> = [1, 3, 5, 7];

export const INITIAL_BOARD: BoardState = Array(TOTAL_CELLS).fill(null);

export const INITIAL_SCOREBOARD: ScoreboardState = {
  xWins: 0,
  oWins: 0,
  draws: 0,
};

export const SESSION_STORAGE_SCOREBOARD_KEY = 'tictactoe_session_scoreboard_v1';
export const SESSION_STORAGE_GAME_MODE_KEY = 'tictactoe_session_mode_v1';
