import type { GameMode } from '../../types/game';

interface GameModeSelectorProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  disabled?: boolean;
}

export function GameModeSelector({
  currentMode,
  onSelectMode,
  disabled = false,
}: GameModeSelectorProps) {
  return (
    <div
      className="inline-flex w-full rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900"
      role="radiogroup"
      aria-label="Game Mode"
    >
      <button
        type="button"
        role="radio"
        aria-checked={currentMode === 'two-player'}
        data-testid="mode-two-player"
        className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition ${
          currentMode === 'two-player'
            ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        onClick={() => onSelectMode('two-player')}
        disabled={disabled}
      >
        👥 Two Player
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={currentMode === 'computer'}
        data-testid="mode-computer"
        className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition ${
          currentMode === 'computer'
            ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        onClick={() => onSelectMode('computer')}
        disabled={disabled}
      >
        🤖 VS Computer
      </button>
    </div>
  );
}
