interface ControlsProps {
  canUndo: boolean;
  onUndo: () => void;
  onResetGame: () => void;
}

export function Controls({ canUndo, onUndo, onResetGame }: ControlsProps) {
  return (
    <div className="flex w-full max-w-[280px] gap-2">
      <button
        type="button"
        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        onClick={onUndo}
        disabled={!canUndo}
        data-testid="undo-btn"
        title={canUndo ? 'Undo the previous move' : 'No moves to undo'}
      >
        <span aria-hidden="true">↩️</span> Undo
      </button>

      <button
        type="button"
        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700 active:scale-98 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        onClick={onResetGame}
        data-testid="reset-game-btn"
        title="Clear the board and start a fresh game"
      >
        <span aria-hidden="true">🔄</span> Reset
      </button>
    </div>
  );
}
