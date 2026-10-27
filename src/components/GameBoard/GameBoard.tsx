import type { BoardState, WinningLine } from '../../types/game';
import { Cell } from './Cell';

interface GameBoardProps {
  board: BoardState;
  winningIndices: WinningLine | null;
  disabled: boolean;
  onCellClick: (index: number) => void;
}

export function GameBoard({
  board,
  winningIndices,
  disabled,
  onCellClick,
}: GameBoardProps) {
  return (
    <div
      className="inline-block rounded-2xl border border-slate-200/90 bg-slate-100/80 p-2 shadow-xs dark:border-slate-800 dark:bg-slate-900/90"
      role="grid"
      aria-label="Tic Tac Toe 3 by 3 Grid"
      data-testid="game-board"
    >
      <div className="grid grid-cols-3 gap-2">
        {board.map((cellValue, index) => {
          const isWinningCell = winningIndices
            ? winningIndices.includes(index)
            : false;

          return (
            <Cell
              key={`cell-${index}`}
              index={index}
              value={cellValue}
              isWinningCell={isWinningCell}
              disabled={disabled}
              onClick={() => onCellClick(index)}
            />
          );
        })}
      </div>
    </div>
  );
}
