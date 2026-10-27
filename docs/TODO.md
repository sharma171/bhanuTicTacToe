# Tic Tac Toe - Implementation Checklist (TODO)

## 1. Project Infrastructure & Configuration

- [x] **Git Repository Initialization**: Initialized Git at workspace root (`.git/`).
- [x] **Prettier Formatting Configuration**:
  - [x] Installed `prettier` in devDependencies.
  - [x] Configured `.prettierrc` (single quotes, 2 spaces, trailing commas).
  - [x] Added `.prettierignore` (ignoring node_modules, dist, logs).
  - [x] Added `format` and `format:check` scripts in `package.json`.
- [x] **Tailwind CSS Integration**:
  - [x] Installed `tailwindcss` and `@tailwindcss/vite`.
  - [x] Configured Vite plugin and `@import "tailwindcss";` with dark mode variant.
- [x] **Git Ignore Configuration**:
  - [x] Configured root `.gitignore` and `bhanuTicTacToe/.gitignore`.
  - [x] Covered `node_modules`, `dist`, `.env*`, editor files, and OS temp files.
- [x] **Editor Consistency**:
  - [x] Created `.editorconfig` across root and app.
  - [x] Created `.vscode/settings.json` and `.vscode/extensions.json`.

---

## 2. Type Contracts & Constants

- [x] **Domain Types (`src/types/game.ts`)**:
  - [x] Define `Player`: `'X' | 'O'`.
  - [x] Define `CellValue`: `Player | null`.
  - [x] Define `BoardState`: `CellValue[]` (length 9).
  - [x] Define `WinningLine`: `[number, number, number]`.
  - [x] Define `MoveRecord`: `{ moveNumber, player, cellIndex, row, col }`.
  - [x] Define `GameMode`: `'two-player' | 'computer'`.
  - [x] Define `GameOutcome`: `'in-progress' | 'won' | 'draw'`.
  - [x] Define `ScoreboardState`: `{ xWins, oWins, draws }`.
  - [x] Define `GameState`: Full aggregated game state interface.
- [x] **Game Constants (`src/constants/gameConstants.ts`)**:
  - [x] Define `BOARD_SIZE` (3) and `TOTAL_CELLS` (9).
  - [x] Define `WINNING_COMBINATIONS` (8 3-tuple lines).
  - [x] Define `CENTER_CELL_INDEX` (4).
  - [x] Define `CORNER_CELL_INDICES` (`[0, 2, 6, 8]`).
  - [x] Define `SESSION_STORAGE_SCOREBOARD_KEY`.
  - [x] Define `INITIAL_BOARD` and `INITIAL_SCOREBOARD`.

---

## 3. Pure Logic & Utility Functions

- [x] **Game Logic (`src/utils/gameLogic.ts`)**:
  - [x] Implement `calculateWinner(board)`: checks all 8 win lines and returns winner + line indices.
  - [x] Implement `checkDraw(board, winner)`: returns true if board is full and no winner.
  - [x] Implement `indexToRowCol(index)`: converts 0-indexed position to 1-indexed `{ row, col }`.
  - [x] Implement `getAvailableMoves(board)`: returns all empty cell indices.
- [x] **Computer AI Engine (`src/utils/computerLogic.ts`)**:
  - [x] Implement `getComputerMove(board)` following exact 5-level priority:
    - [x] **Rule 1**: Win move for Computer ('O') if 2 O's and 1 empty in any win line.
    - [x] **Rule 2**: Block move for Human ('X') if 2 X's and 1 empty in any win line.
    - [x] **Rule 3**: Take Center (index 4) if open.
    - [x] **Rule 4**: Take Corner (indices 0, 2, 6, 8) if open.
    - [x] **Rule 5**: Take any available cell if open.
- [x] **Session Storage Adapter (`src/utils/storage.ts`)**:
  - [x] Implement `loadScoreboard()`: reads and parses from `sessionStorage` safely.
  - [x] Implement `saveScoreboard(scores)`: writes JSON string to `sessionStorage`.
  - [x] Implement `clearScoreboardStorage()`: removes/resets stored scores.

---

## 4. State Management Hook (`useTicTacToe.ts`)

- [x] **Hook State**:
  - [x] Initialize `board` (9 null elements).
  - [x] Initialize `currentPlayer` ('X').
  - [x] Initialize `history` (`MoveRecord[]`).
  - [x] Initialize `gameMode` ('two-player' or 'computer').
  - [x] Initialize `scoreboard` (from `sessionStorage`).
  - [x] Derived `isComputerThinking` flag.
- [x] **Game Actions**:
  - [x] `handleCellClick(index)`:
    - [x] Prevent click if cell is already occupied.
    - [x] Prevent click if game is won or drawn.
    - [x] Prevent click if in computer mode and it is computer's turn or AI is thinking.
    - [x] Update board, record move in history, switch turn.
  - [x] `undoMove()`:
    - [x] Disable if `history.length === 0` or `isComputerThinking`.
    - [x] **Two-Player Mode**: Pop 1 move, restore cell to null, switch back turn.
    - [x] **Computer Mode**: Pop 2 moves (Computer + Human), restore both cells, set turn back to 'X'.
    - [x] Handle single-move undo in computer mode if computer hasn't moved yet.
    - [x] Recalculate win/draw state from restored board.
    - [x] Rollback recorded score if undoing from completed match.
  - [x] `resetGame()`:
    - [x] Clear board, empty history, clear winner/draw, reset turn to 'X'.
    - [x] Leave scoreboard and gameMode intact.
  - [x] `resetScoreboard()`:
    - [x] Set scoreboard to `{ xWins: 0, oWins: 0, draws: 0 }`.
    - [x] Persist reset to `sessionStorage`.
  - [x] `changeGameMode(newMode)`:
    - [x] Switch mode and trigger `resetGame()`.
- [x] **Automated Computer Turn Loop**:
  - [x] Trigger `useEffect` on `[gameMode, currentPlayer, outcome]`.
  - [x] Add 350ms delay for human-like pacing.
  - [x] Compute move using `getComputerMove`.
  - [x] Commit computer move to state and history.
- [x] **Scoreboard Once-Per-Game Synchronization**:
  - [x] Trigger on move that produces win or draw.
  - [x] Increment appropriate counter strictly once.
  - [x] Persist updated scoreboard to `sessionStorage`.

---

## 5. UI Components & Theming

- [x] **Theming (`ThemeContext.ts`, `ThemeProvider.tsx`, `useTheme.ts`)**:
  - [x] Dark/Light theme switching via React Context.
  - [x] Synchronized with `.dark` and `data-theme` on `<html>`.
- [x] **`Scoreboard.tsx`**:
  - [x] Display Player X wins, Player O wins, and Draws in styled badge cards.
  - [x] Provide "Reset Scores" button.
- [x] **`GameModeSelector.tsx`**:
  - [x] Segmented pill control: "Two Player" vs "VS Computer".
- [x] **`GameStatus.tsx`**:
  - [x] Display "Current Turn: Player X" or "Current Turn: Player O".
  - [x] Display "Computer is thinking..." indicator with pulse animation.
  - [x] Display "Player X Wins!" / "Player O Wins!" banner with emerald styling.
  - [x] Display "Game Draw!" banner when tied.
- [x] **`GameBoard.tsx` & `Cell.tsx`**:
  - [x] 3x3 CSS grid container.
  - [x] Accessible buttons with `data-testid` and winning highlight rings.
- [x] **`Controls.tsx`**:
  - [x] "Undo" button with disabled state handling.
  - [x] "Reset" button.
- [x] **`MoveHistory.tsx`**:
  - [x] Render data table: `Move`, `Player`, `Position` (`Row X, Col Y`).

---

## 6. Cypress Automated Test Suite

- [x] **Setup & Configuration**:
  - [x] Configured `cypress.config.ts`, `cypress/support/e2e.ts`, and `commands.ts`.
  - [x] Added `test:e2e`, `cypress:run`, and `cypress:open` scripts in `package.json`.
- [x] **Core Game Logic E2E Tests (`cypress/e2e/tic_tac_toe.cy.ts`)**:
  - [x] Valid move
  - [x] Invalid move (occupied cell locking)
  - [x] Turn switching
  - [x] Row win
  - [x] Column win
  - [x] Diagonal win
  - [x] Draw detection
  - [x] Reset game (preserves scoreboard)
  - [x] Undo in two-player mode (1 move popped)
  - [x] Undo in computer mode (2 moves popped together)
  - [x] Scoreboard update & reset scores
  - [x] Computer move selection (Priority 1 Win, Priority 2 Block, Priority 3 Center)
  - [x] Move after game completion (board locking)
- [x] **Unit & Algorithmic Logic Tests (`cypress/e2e/core_logic_unit.cy.ts`)**:
  - [x] Coordinate mapping formula
  - [x] Available moves calculation
  - [x] Win matrix combinatorial checks
  - [x] Full board tie check vs full board win check
  - [x] All 5 priority rules of the computer AI
