import type { MoveRecord } from '../../types/game';

interface MoveHistoryProps {
  history: MoveRecord[];
}

export function MoveHistory({ history }: MoveHistoryProps) {
  return (
    <section
      className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900"
      aria-label="Move History"
    >
      <div className="mb-2.5 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Move History
        </h3>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {history.length} {history.length === 1 ? 'Move' : 'Moves'}
        </span>
      </div>

      <div
        className="max-h-[300px] flex-1 overflow-y-auto"
        data-testid="move-history-container"
      >
        {history.length === 0 ? (
          <p
            data-testid="move-history-empty"
            className="py-8 text-center text-xs text-slate-400 dark:text-slate-500"
          >
            No moves yet. Play a move!
          </p>
        ) : (
          <table
            className="w-full text-left text-xs"
            data-testid="move-history-table"
          >
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:text-slate-500">
                <th scope="col" className="pb-1.5 pl-1">
                  #
                </th>
                <th scope="col" className="pb-1.5">
                  Player
                </th>
                <th scope="col" className="pb-1.5 pr-1 text-right">
                  Position
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {history.map((move) => (
                <tr
                  key={`move-${move.moveNumber}-${move.cellIndex}`}
                  data-testid="move-row"
                >
                  <td className="py-1.5 pl-1 font-mono font-medium text-slate-400 dark:text-slate-500">
                    {move.moveNumber}
                  </td>
                  <td className="py-1.5">
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center rounded text-[11px] font-bold ${
                        move.player === 'X'
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                          : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                      }`}
                    >
                      {move.player}
                    </span>
                  </td>
                  <td className="py-1.5 pr-1 text-right font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    Row {move.row}, Col {move.col}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
