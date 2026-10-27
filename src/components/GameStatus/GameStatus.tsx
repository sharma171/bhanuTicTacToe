import type { GameMode, GameOutcome, Player } from '../../types/game';

interface GameStatusProps {
  currentPlayer: Player;
  outcome: GameOutcome;
  winner: Player | null;
  gameMode: GameMode;
  isComputerThinking: boolean;
}

export function GameStatus({
  currentPlayer,
  outcome,
  winner,
  gameMode,
  isComputerThinking,
}: GameStatusProps) {
  const getStatusDetails = (): {
    message: string;
    containerClass: string;
    dotClass: string;
  } => {
    if (outcome === 'won' && winner) {
      const msg =
        gameMode === 'computer'
          ? winner === 'X'
            ? '🎉 You Win! (Player X)'
            : '🤖 Computer Wins (Player O)'
          : `🎉 Winner: Player ${winner}!`;

      return {
        message: msg,
        containerClass:
          'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300 font-semibold',
        dotClass: 'bg-emerald-500',
      };
    }

    if (outcome === 'draw') {
      return {
        message: "🤝 Game Draw! It's a tie!",
        containerClass:
          'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300 font-semibold',
        dotClass: 'bg-amber-500',
      };
    }

    // In Progress
    if (gameMode === 'computer') {
      if (isComputerThinking) {
        return {
          message: '🤖 Computer is thinking...',
          containerClass:
            'border-amber-200 bg-amber-50/70 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-400',
          dotClass: 'bg-amber-500 animate-ping',
        };
      }
      return {
        message:
          currentPlayer === 'X'
            ? 'Your Turn (Player X)'
            : "Computer's Turn (Player O)",
        containerClass:
          'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300',
        dotClass: currentPlayer === 'X' ? 'bg-blue-500' : 'bg-rose-500',
      };
    }

    return {
      message: `Current Turn: Player ${currentPlayer}`,
      containerClass:
        'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300',
      dotClass: currentPlayer === 'X' ? 'bg-blue-500' : 'bg-rose-500',
    };
  };

  const { message, containerClass, dotClass } = getStatusDetails();

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition-colors ${containerClass}`}
      role="status"
      aria-live="polite"
      data-testid="game-status"
    >
      <span className={`h-2 w-2 rounded-full ${dotClass}`} aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
