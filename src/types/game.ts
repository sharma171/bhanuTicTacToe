export type Player = 'X' | 'O';

export type CellValue = Player | null;

/**
 * 3x3 Board represented as a flat array of 9 elements (indices 0 to 8).
 * Mapping:
 * Index 0: Row 1, Column 1 | Index 1: Row 1, Column 2 | Index 2: Row 1, Column 3
 * Index 3: Row 2, Column 1 | Index 4: Row 2, Column 2 | Index 5: Row 2, Column 3
 * Index 6: Row 3, Column 1 | Index 7: Row 3, Column 2 | Index 8: Row 3, Column 3
 */
export type BoardState = CellValue[];

export type WinningLine = [number, number, number];

export interface MoveRecord {
  moveNumber: number;
  player: Player;
  cellIndex: number;
  row: number; // 1-indexed (1, 2, 3)
  col: number; // 1-indexed (1, 2, 3)
  timestamp?: number;
}

export type GameMode = 'two-player' | 'computer';

export type GameOutcome = 'in-progress' | 'won' | 'draw';

export interface WinState {
  winner: Player;
  line: WinningLine;
}

export interface ScoreboardState {
  xWins: number;
  oWins: number;
  draws: number;
}

export interface GameState {
  board: BoardState;
  currentPlayer: Player;
  history: MoveRecord[];
  gameMode: GameMode;
  outcome: GameOutcome;
  winState: WinState | null;
  isComputerThinking: boolean;
  hasScoreBeenUpdated: boolean;
}
