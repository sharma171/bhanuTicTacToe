import type { ScoreboardState } from '../../types/game';

interface ScoreboardProps {
  scoreboard: ScoreboardState;
  onResetScoreboard: () => void;
}

export function Scoreboard({ scoreboard, onResetScoreboard }: ScoreboardProps) {
  return (
    <section
      className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900"
      aria-label="Session Scoreboard"
    >
      <div className="mb-2.5 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Scoreboard (Session)
        </h2>
        <button
          type="button"
          onClick={onResetScoreboard}
          data-testid="reset-scoreboard-btn"
          className="text-xs font-medium text-slate-400 transition hover:text-rose-500 dark:hover:text-rose-400"
          title="Reset session scoreboard"
        >
          Reset Scores
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* Player X */}
        <div
          data-testid="score-x"
          className="flex flex-col items-center rounded-lg border border-blue-100 bg-blue-50/60 py-2 text-center dark:border-blue-900/40 dark:bg-blue-950/20"
        >
          <span className="text-[11px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            Player X
          </span>
          <span
            data-testid="score-x-val"
            className="my-0.5 text-xl font-bold tabular-nums text-blue-700 dark:text-blue-300"
          >
            {scoreboard.xWins}
          </span>
          <span className="text-[10px] text-blue-500/80 dark:text-blue-400/70">
            Wins
          </span>
        </div>

        {/* Draws */}
        <div
          data-testid="score-draw"
          className="flex flex-col items-center rounded-lg border border-slate-200 bg-slate-50 py-2 text-center dark:border-slate-800 dark:bg-slate-800/40"
        >
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Ties
          </span>
          <span
            data-testid="score-draw-val"
            className="my-0.5 text-xl font-bold tabular-nums text-slate-700 dark:text-slate-200"
          >
            {scoreboard.draws}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            Draws
          </span>
        </div>

        {/* Player O */}
        <div
          data-testid="score-o"
          className="flex flex-col items-center rounded-lg border border-rose-100 bg-rose-50/60 py-2 text-center dark:border-rose-900/40 dark:bg-rose-950/20"
        >
          <span className="text-[11px] font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400">
            Player O
          </span>
          <span
            data-testid="score-o-val"
            className="my-0.5 text-xl font-bold tabular-nums text-rose-700 dark:text-rose-300"
          >
            {scoreboard.oWins}
          </span>
          <span className="text-[10px] text-rose-500/80 dark:text-rose-400/70">
            Wins
          </span>
        </div>
      </div>
    </section>
  );
}
