import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { INITIAL_BOARD, TOTAL_CELLS } from '../constants/gameConstants';
import type {
  BoardState,
  GameMode,
  GameOutcome,
  MoveRecord,
  Player,
  ScoreboardState,
  WinningLine,
  WinState,
} from '../types/game';
import { getComputerMove } from '../utils/computerLogic';
import { calculateWinner, checkDraw, indexToRowCol } from '../utils/gameLogic';
import {
  clearScoreboardStorage,
  loadScoreboard,
  saveScoreboard,
} from '../utils/storage';

export interface UseTicTacToeReturn {
  board: BoardState;
  currentPlayer: Player;
  gameMode: GameMode;
  outcome: GameOutcome;
  winnerState: WinState | null;
  isDraw: boolean;
  winningLine: WinningLine | null;
  history: MoveRecord[];
  scoreboard: ScoreboardState;
  isComputerThinking: boolean;
  canUndo: boolean;
  handleCellClick: (index: number) => void;
  undoMove: () => void;
  resetGame: () => void;
  resetScoreboard: () => void;
  changeGameMode: (mode: GameMode) => void;
}

export function useTicTacToe(): UseTicTacToeReturn {
  const [board, setBoard] = useState<BoardState>(() => [...INITIAL_BOARD]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [history, setHistory] = useState<MoveRecord[]>([]);
  const [gameMode, setGameMode] = useState<GameMode>('two-player');
  const [scoreboard, setScoreboard] = useState<ScoreboardState>(() =>
    loadScoreboard()
  );

  // Timer ref to cancel pending computer moves on reset, undo, or mode change
  const computerTimerRef = useRef<number | null>(null);

  // Derived state: outcome and winning lines
  const winnerState = useMemo(() => calculateWinner(board), [board]);
  const isDraw = useMemo(
    () => checkDraw(board, winnerState),
    [board, winnerState]
  );

  const outcome: GameOutcome = useMemo(() => {
    if (winnerState) return 'won';
    if (isDraw) return 'draw';
    return 'in-progress';
  }, [winnerState, isDraw]);

  const winningLine = winnerState?.line ?? null;

  // Derived indicator: computer is thinking when it's O's turn in computer mode and match is in progress
  const isComputerThinking =
    gameMode === 'computer' &&
    currentPlayer === 'O' &&
    outcome === 'in-progress';

  // Helper to cancel any pending timer
  const cancelComputerTimer = useCallback(() => {
    if (computerTimerRef.current !== null) {
      window.clearTimeout(computerTimerRef.current);
      computerTimerRef.current = null;
    }
  }, []);

  // Update Scoreboard helper
  const recordGameCompletion = useCallback(
    (win: WinState | null, draw: boolean) => {
      if (!win && !draw) return;

      setScoreboard((prev) => {
        const next: ScoreboardState = {
          xWins: win?.winner === 'X' ? prev.xWins + 1 : prev.xWins,
          oWins: win?.winner === 'O' ? prev.oWins + 1 : prev.oWins,
          draws: draw ? prev.draws + 1 : prev.draws,
        };
        saveScoreboard(next);
        return next;
      });
    },
    []
  );

  // Handle cell click (Human Player move)
  const handleCellClick = useCallback(
    (index: number) => {
      // 1. Validate boundary & cell is empty
      if (index < 0 || index >= TOTAL_CELLS || board[index] !== null) {
        return;
      }

      // 2. Game must still be active
      if (outcome !== 'in-progress') {
        return;
      }

      // 3. Prevent clicking if it is computer's turn in computer mode
      if (gameMode === 'computer' && currentPlayer === 'O') {
        return;
      }

      const { row, col } = indexToRowCol(index);
      const newMove: MoveRecord = {
        moveNumber: history.length + 1,
        player: currentPlayer,
        cellIndex: index,
        row,
        col,
      };

      const nextBoard = [...board];
      nextBoard[index] = currentPlayer;

      // Check if this move concludes the game
      const win = calculateWinner(nextBoard);
      const draw = checkDraw(nextBoard, win);

      if (win || draw) {
        recordGameCompletion(win, draw);
      }

      setBoard(nextBoard);
      setHistory((prev) => [...prev, newMove]);
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    },
    [
      board,
      currentPlayer,
      gameMode,
      history.length,
      outcome,
      recordGameCompletion,
    ]
  );

  // Automated Computer Player loop
  useEffect(() => {
    if (
      gameMode !== 'computer' ||
      currentPlayer !== 'O' ||
      outcome !== 'in-progress'
    ) {
      return;
    }

    // Cognitive delay (350ms) for natural play feel
    computerTimerRef.current = window.setTimeout(() => {
      const aiMoveIndex = getComputerMove(board);

      if (aiMoveIndex !== null && board[aiMoveIndex] === null) {
        const { row, col } = indexToRowCol(aiMoveIndex);
        const aiMove: MoveRecord = {
          moveNumber: history.length + 1,
          player: 'O',
          cellIndex: aiMoveIndex,
          row,
          col,
        };

        const nextBoard = [...board];
        nextBoard[aiMoveIndex] = 'O';

        const win = calculateWinner(nextBoard);
        const draw = checkDraw(nextBoard, win);

        if (win || draw) {
          recordGameCompletion(win, draw);
        }

        setBoard(nextBoard);
        setHistory((prev) => [...prev, aiMove]);
        setCurrentPlayer('X');
      }

      computerTimerRef.current = null;
    }, 350);

    return () => {
      cancelComputerTimer();
    };
  }, [
    board,
    currentPlayer,
    gameMode,
    history.length,
    outcome,
    recordGameCompletion,
    cancelComputerTimer,
  ]);

  // Mode-aware Undo Last Move
  const undoMove = useCallback(() => {
    if (history.length === 0 || isComputerThinking) {
      return;
    }

    cancelComputerTimer();

    // Mode-aware rollback:
    // Two-Player: Pop 1 move
    // Computer Mode: Pop 2 moves (both Computer O and Human X)
    const movesToPop =
      gameMode === 'computer' ? Math.min(2, history.length) : 1;

    const targetHistory = history.slice(0, history.length - movesToPop);

    // Reconstruct board from target history
    const restoredBoard: BoardState = Array(TOTAL_CELLS).fill(null);
    for (const move of targetHistory) {
      restoredBoard[move.cellIndex] = move.player;
    }

    // Determine correct player turn
    const nextPlayer: Player =
      gameMode === 'two-player'
        ? targetHistory.length % 2 === 0
          ? 'X'
          : 'O'
        : 'X';

    // If undoing from a completed game, roll back the recorded score
    if (outcome === 'won' && winnerState) {
      setScoreboard((prev) => {
        const rolledBack: ScoreboardState = {
          xWins:
            winnerState.winner === 'X'
              ? Math.max(0, prev.xWins - 1)
              : prev.xWins,
          oWins:
            winnerState.winner === 'O'
              ? Math.max(0, prev.oWins - 1)
              : prev.oWins,
          draws: prev.draws,
        };
        saveScoreboard(rolledBack);
        return rolledBack;
      });
    } else if (outcome === 'draw') {
      setScoreboard((prev) => {
        const rolledBack: ScoreboardState = {
          ...prev,
          draws: Math.max(0, prev.draws - 1),
        };
        saveScoreboard(rolledBack);
        return rolledBack;
      });
    }

    setBoard(restoredBoard);
    setHistory(targetHistory);
    setCurrentPlayer(nextPlayer);
  }, [
    cancelComputerTimer,
    gameMode,
    history,
    isComputerThinking,
    outcome,
    winnerState,
  ]);

  // Reset Game: clear board, history, status, set player to X, keep scoreboard unchanged
  const resetGame = useCallback(() => {
    cancelComputerTimer();
    setBoard([...INITIAL_BOARD]);
    setHistory([]);
    setCurrentPlayer('X');
  }, [cancelComputerTimer]);

  // Reset Scoreboard: clear session storage & state, leave board unchanged
  const resetScoreboard = useCallback(() => {
    clearScoreboardStorage();
    setScoreboard({ xWins: 0, oWins: 0, draws: 0 });
  }, []);

  // Mode Switch: clear board and start fresh in the new mode
  const changeGameMode = useCallback(
    (newMode: GameMode) => {
      if (newMode === gameMode) return;
      cancelComputerTimer();
      setGameMode(newMode);
      setBoard([...INITIAL_BOARD]);
      setHistory([]);
      setCurrentPlayer('X');
    },
    [cancelComputerTimer, gameMode]
  );

  const canUndo = history.length > 0 && !isComputerThinking;

  return {
    board,
    currentPlayer,
    gameMode,
    outcome,
    winnerState,
    isDraw,
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
  };
}
