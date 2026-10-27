import { Controls } from './components/Controls/Controls';
import { GameBoard } from './components/GameBoard/GameBoard';
import { GameModeSelector } from './components/GameModeSelector/GameModeSelector';
import { GameStatus } from './components/GameStatus/GameStatus';
import { MoveHistory } from './components/MoveHistory/MoveHistory';
import { Scoreboard } from './components/Scoreboard/Scoreboard';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';
import { useTicTacToe } from './hooks/useTicTacToe';

function App() {
  const {
    board,
    currentPlayer,
    gameMode,
    outcome,
    winnerState,
    winningLine,
    history,
    scoreboard,
    isComputerThinking,
    canUndo,
    handleCellClick,
    undoMove,
    resetGame,
    resetScoreboard,
    changeGameMode,
  } = useTicTacToe();

  const isBoardDisabled = outcome !== 'in-progress' || isComputerThinking;

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-4 sm:py-6">
      {/* Compact Top Header */}
      <header className="mb-4 flex items-center justify-between border-b border-slate-200/80 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-black text-white shadow-xs dark:bg-indigo-500">
            #
          </span>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-base">
              Tic Tac Toe
            </h1>
          </div>
        </div>

        <ThemeToggle />
      </header>

      {/* Main Container */}
      <main className="flex flex-1 flex-col gap-4">
        {/* Session Scoreboard */}
        <Scoreboard
          scoreboard={scoreboard}
          onResetScoreboard={resetScoreboard}
        />

        {/* Game Mode Selector */}
        <GameModeSelector
          currentMode={gameMode}
          onSelectMode={changeGameMode}
          disabled={isComputerThinking}
        />

        {/* Game Workspace (Arena + Move History) */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_260px]">
          {/* Playing Arena */}
          <section
            className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
            aria-label="Game Board Arena"
          >
            <GameStatus
              currentPlayer={currentPlayer}
              outcome={outcome}
              winner={winnerState?.winner ?? null}
              gameMode={gameMode}
              isComputerThinking={isComputerThinking}
            />

            <GameBoard
              board={board}
              winningIndices={winningLine}
              disabled={isBoardDisabled}
              onCellClick={handleCellClick}
            />

            <Controls
              canUndo={canUndo}
              onUndo={undoMove}
              onResetGame={resetGame}
            />
          </section>

          {/* Move History */}
          <aside aria-label="Move History Log">
            <MoveHistory history={history} />
          </aside>
        </div>
      </main>

      {/* Compact Minimalist Footer */}
      <footer className="mt-6 border-t border-slate-200/60 pt-3 text-center text-[11px] text-slate-400 dark:border-slate-800 dark:text-slate-500">
        Session storage active • Scores & history persist until tab is closed
      </footer>
    </div>
  );
}

export default App;
