# Tic Tac Toe - Comprehensive Implementation Plan

## 1. Executive Summary & Objectives

This document outlines the step-by-step roadmap to build a robust, responsive, and session-persistent **Tic Tac Toe** web application using **React 19**, **Vite**, and **TypeScript**.

The application features:

- Standard 3x3 clickable grid with cell-locking logic.
- Real-time turn tracking (Player X vs Player O).
- Deterministic win detection with line highlighting and draw detection.
- Move history log displaying `Move #`, `Player`, and `Position (Row X, Column Y)`.
- Reversible state management with mode-aware **Undo Last Move**:
  - **Two-Player Mode**: Undoes 1 move (reverts to previous player's turn).
  - **Computer Mode**: Undoes 2 moves (reverts both Computer's move and Human's move).
- Rule-based **Computer Opponent Mode** following an explicit 5-level priority strategy (Win $\rightarrow$ Block $\rightarrow$ Center $\rightarrow$ Corner $\rightarrow$ Any).
- Session-based browser storage (`sessionStorage`) for persistent score tracking (X wins, O wins, Draws) that updates strictly once per game and supports independent scoreboard reset.

---

## 2. Phased Rollout Schedule

```
Phase 1: Environment & Tooling (COMPLETED)
   ├── Prettier + ESLint + .gitignore + .editorconfig
   └── TypeScript contracts & domain types

Phase 2: Core Algorithmic & Pure Logic Layer
   ├── Win & draw detection utility (`gameLogic.ts`)
   ├── 5-Priority Computer Opponent engine (`aiLogic.ts`)
   └── Browser `sessionStorage` adapter (`storage.ts`)

Phase 3: State Management & Game Engine Hook
   ├── Game State reducer / custom hook (`useTicTacToe.ts`)
   ├── Move history tracking & coordinate calculation
   ├── Mode-aware Undo transaction handling
   └── Single-update scoreboard synchronization guard

Phase 4: Component Architecture & Presentational UI
   ├── Scoreboard banner & reset scoreboard action
   ├── Game Mode toggle (Two-Player vs Against Computer)
   ├── Status indicator (Current Turn, Winner alert, Draw notice)
   ├── 3x3 Game Board & Cell components with winning highlights
   ├── Control bar (Undo Move, Reset Game)
   └── Move History data table with 1-based Row/Column coordinates

Phase 5: Computer Opponent Asynchronous Integration
   ├── Non-blocking automated move trigger via React effect
   ├── Brief human-like cognitive delay (e.g., 400ms)
   └── Board interaction locking while computer is thinking

Phase 6: Styling, Accessibility & Edge Case Hardening
   ├── High-contrast visual styling & responsive CSS grid
   ├── Cell focus & keyboard accessibility
   └── Strict boundary validation (rapid clicks, game completion lock)
```

---

## 3. Detailed Phase Breakdown

### Phase 1: Environment, Tooling & Type Contracts (Completed)

- [x] Initialized Git repository at root.
- [x] Installed `prettier` as a dev dependency.
- [x] Configured `.prettierrc`, `.prettierignore`, and formatting npm scripts (`npm run format`, `npm run format:check`).
- [x] Configured comprehensive `.gitignore` preventing commit of `node_modules`, `dist`, build logs, and OS caches.
- [x] Configured `.editorconfig` and `.vscode/settings.json` for team consistency.
- [x] Established strict TypeScript interfaces in `src/types/game.ts` (`Player`, `BoardState`, `MoveRecord`, `GameMode`, `ScoreboardState`).
- [x] Created `src/constants/gameConstants.ts` defining winning lines, initial states, and storage keys.

---

### Phase 2: Core Pure Logic & Utility Layer

Build isolated, 100% pure utility functions with zero UI dependencies:

1. **`gameLogic.ts`**:
   - `calculateWinner(board: BoardState): WinState | null`: checks all 8 winning combinations (3 rows, 3 columns, 2 diagonals) and returns `{ winner: 'X' | 'O', line: [number, number, number] }`.
   - `checkDraw(board: BoardState, winner: WinState | null): boolean`: returns `true` if all 9 cells are non-null and `winner === null`.
   - `indexToRowCol(index: number): { row: number; col: number }`: maps flat indices `0..8` to 1-indexed coordinates:
     $$\text{row} = \lfloor \text{index} / 3 \rfloor + 1, \quad \text{col} = (\text{index} \pmod 3) + 1$$
   - `getAvailableMoves(board: BoardState): number[]`: returns array of open indices.

2. **`aiLogic.ts`**:
   - Implements the exact 5-level priority rule engine for Computer Player ('O'):
     - **Priority 1 (Win)**: Find an open cell where placing 'O' wins the game immediately.
     - **Priority 2 (Block)**: Find an open cell where placing 'X' would win the game on the next turn, and take that cell to block.
     - **Priority 3 (Center)**: Check if index `4` (Row 2, Column 2) is empty; if so, return `4`.
     - **Priority 4 (Corner)**: Inspect corners `[0, 2, 6, 8]` in deterministic order; return the first empty corner.
     - **Priority 5 (Any available cell)**: Return the first available open cell.

3. **`storage.ts`**:
   - Safe `sessionStorage` wrapper with JSON serialization, deserialization, and schema validation.
   - Graceful fallback to in-memory state if `sessionStorage` is disabled or blocked.

---

### Phase 3: State Management & Game Engine Hook (`useTicTacToe`)

Encapsulate all game rules, state transitions, and undo actions inside a single cohesive hook:

- **Core State Variables**:
  - `board`: `BoardState` (array of length 9).
  - `currentPlayer`: `'X' | 'O'`.
  - `history`: `MoveRecord[]`.
  - `gameMode`: `'two-player' | 'computer'`.
  - `scoreboard`: `ScoreboardState` (synced with `sessionStorage`).
  - `hasScoreBeenUpdated`: `boolean` (guard ensuring completed game increments score exactly once).
  - `isComputerThinking`: `boolean` (disables board click during AI turn delay).
- **Core Actions**:
  - `makeMove(index: number)`: Validates cell is empty, game is active, and it is the human turn (in computer mode).
  - `undoMove()`:
    - _Two-Player Mode_: Pops 1 move. Board cell restored to `null`. Current player swapped back. Status recalculated.
    - _Computer Mode_: Pops 2 moves (Computer move + Human move). Board cells restored to `null`. Current player resets to `'X'`.
    - Recalculates win/draw status upon undoing (unlocking the game if undone from an end state).
    - If undone after a win/draw was recorded, maintains scoreboard consistency (or prevents duplicate score updates).
  - `resetGame()`: Clears board, clears move history, resets player to `'X'`, keeps scoreboard intact.
  - `resetScoreboard()`: Resets scoreboard to `{ xWins: 0, oWins: 0, draws: 0 }` and updates `sessionStorage`.
  - `setGameMode(mode: GameMode)`: Swaps game mode and resets game to guarantee clean initial state.

---

### Phase 4: Component Architecture & Visual Layout

Build clean, single-responsibility React functional components:

1. `Scoreboard.tsx`: Displays X Wins, O Wins, Draws, with a dedicated "Reset Scoreboard" button.
2. `GameModeSelector.tsx`: Toggle buttons for "Two Player Mode" and "Play Against Computer".
3. `GameStatus.tsx`: Dynamic message showing whose turn it is, celebrating the winner, or declaring a draw.
4. `GameBoard.tsx`: 3x3 CSS grid displaying 9 `Cell` components.
5. `Cell.tsx`: Accessible `<button>` rendering `'X'`, `'O'`, or empty with hover effects and highlight styles for winning cells.
6. `Controls.tsx`: "Undo Move" button (disabled when history is empty or during computer thinking) and "Reset Game" button.
7. `MoveHistory.tsx`: Formatted table showing Move number, Player, and Position (e.g. `Row 1, Column 1`).

---

### Phase 5: Computer Opponent Asynchronous Loop

- Use a `useEffect` triggered when:
  $$\text{gameMode} == \text{'computer'} \land \text{currentPlayer} == \text{'O'} \land \text{outcome} == \text{'in-progress'}$$
- Set `isComputerThinking = true` to lock board inputs.
- Run `aiLogic` inside a `setTimeout` (350ms - 500ms) to provide a polished, responsive feel.
- Execute computer move and unlock the board.

---

### Phase 6: Quality Assurance & Edge Case Verification

- [ ] Cell locking: Clicking already-filled cells causes no state mutation.
- [ ] Completed game locking: Clicking any cell after win or draw causes no action.
- [ ] Computer mode locking: Clicking cells while computer delay is active is prevented.
- [ ] Scoreboard single update: Score increments exactly once upon win or draw, never on subsequent clicks or re-renders.
- [ ] Undo boundaries:
  - Undo disabled at move 0.
  - Two-Player undo single step reverts turn correctly.
  - Computer mode undo double step reverts back to Player X.
  - Computer mode undo when only 1 move exists (if computer hasn't responded yet).
- [ ] Session persistence: Refreshing page preserves scoreboard; closing tab resets session.
