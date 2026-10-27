import type { CellValue } from '../../types/game';
import { formatPosition } from '../../utils/gameLogic';

interface CellProps {
  index: number;
  value: CellValue;
  isWinningCell: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function Cell({
  index,
  value,
  isWinningCell,
  disabled,
  onClick,
}: CellProps) {
  const positionLabel = formatPosition(index);
  const cellStateText = value ? `Marked with ${value}` : 'Empty';
  const ariaLabel = `${positionLabel}, ${cellStateText}`;

  // Minimalist cell state styles
  let colorClasses =
    'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/80 border-slate-200/80 dark:border-slate-700/60';

  if (value === 'X') {
    colorClasses =
      'bg-blue-50/70 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200/70 dark:border-blue-900/50 font-extrabold';
  } else if (value === 'O') {
    colorClasses =
      'bg-rose-50/70 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200/70 dark:border-rose-900/50 font-extrabold';
  }

  const winningClasses = isWinningCell
    ? '!bg-emerald-100 dark:!bg-emerald-950/70 !border-emerald-500 dark:!border-emerald-400 !text-emerald-700 dark:!text-emerald-300 ring-2 ring-emerald-500/60 scale-[1.02]'
    : '';

  return (
    <button
      type="button"
      className={`flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-xl border text-3xl transition-all shadow-xs select-none disabled:cursor-not-allowed ${colorClasses} ${winningClasses}`}
      onClick={onClick}
      disabled={disabled || value !== null}
      aria-label={ariaLabel}
      data-index={index}
      data-testid={`cell-${index}`}
    >
      <span>{value}</span>
    </button>
  );
}
