# Browser-Based Tic Tac Toe Application

A modern, accessible, and session-persistent **Tic Tac Toe** web application built with **React 19**, **Vite**, **TypeScript**, **Tailwind CSS**, and **Cypress**. The application supports interactive two-player gameplay, move history tracking, mode-aware undo capabilities, session-level score tracking via browser memory/storage, and a rule-based computer opponent driven by a 5-priority decision engine.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Features Implemented](#3-features-implemented)
4. [How to Run the Frontend Locally](#4-how-to-run-the-frontend-locally)
5. [Storage & Client API Interface Summary](#5-storage--client-api-interface-summary)
6. [How to Run Tests](#6-how-to-run-tests)
7. [AI Tools & Prompt Engineering Summary (Gemini 3.1 Pro)](#7-ai-tools--prompt-engineering-summary-gemini-31-pro)
8. [Design Decisions & Architectural Thinking](#8-design-decisions--architectural-thinking)
9. [Clarifications & Assumptions](#9-clarifications--assumptions)
10. [Known Limitations](#10-known-limitations)
11. [Future Improvements & Research Integration](#11-future-improvements--research-integration)

---

## 1. Project Overview

This project delivers a responsive Tic Tac Toe game engineered according to enterprise-grade web standards. Key architectural objectives include:

- Complete decoupling of **domain logic** (pure mathematical win detection and AI algorithms) from **presentation logic** (React UI components).
- **Session-level browser persistence** using `sessionStorage` ensuring player scores survive page reloads within an active browsing tab without polluting persistent client storage.
- A **mode-aware undo transaction engine** capable of cleanly rolling back single moves in Two-Player mode or atomic move pairs (computer + human) in Computer Mode.
- A **minimalist, responsive user interface** styled with Tailwind CSS, supporting dark and light themes via React Context.

---

## 2. Tech Stack

| Category                 | Technology               | Version                | Purpose                                                                     |
| :----------------------- | :----------------------- | :--------------------- | :-------------------------------------------------------------------------- |
| **Core Framework**       | React                    | `^19.2.8`              | Declarative UI rendering, custom hooks, and React Context API.              |
| **Language**             | TypeScript               | `~6.0.2`               | Compile-time static type safety with `verbatimModuleSyntax`.                |
| **Build & Tooling**      | Vite                     | `^8.3.0`               | Next-generation frontend bundler with instant Hot Module Replacement (HMR). |
| **Styling**              | Tailwind CSS v4          | `^4.3.3`               | Utility-first CSS engine using `@tailwindcss/vite` plugin.                  |
| **Formatting & Linting** | Prettier & ESLint 10     | `^3.9.10` / `^10.10.0` | Automated formatting and strict static code analysis (`typescript-eslint`). |
| **Testing**              | Cypress                  | `^16.2.0`              | End-to-end browser testing and core algorithmic unit test validation.       |
| **Storage**              | Browser `sessionStorage` | Native HTML5           | Session-bound client persistence for match scores.                          |

---

## 3. Features Implemented

### Functional Requirements

- **3×3 Game Board**: Interactive grid rendered via accessible `<button>` cells. Empty cells are clickable and lock immediately upon selection, preventing invalid overwrites.
- **Turn Alternation**: Clearly indicates whether Player X or Player O has the active turn. Invalid moves (clicking occupied cells) do not trigger turn changes.
- **Win Detection**: Automatically evaluates all 8 potential win trajectories (3 rows, 3 columns, 2 diagonals). Highlights the winning line with visual ring indicators, announces the winner, and locks further board interactions.
- **Draw Detection**: Detects when all 9 cells are filled without a winner, displays a draw status alert, locks the board, and increments the draw counter.
- **Reset Game**: Clears the board, empties move history, resets the current player back to X, and starts a fresh match while **preserving the cumulative scoreboard**.

### Must-Have Capabilities

1. **Move History Log**:
   - Tracks every valid move in real-time with `Move #`, `Player (X/O)`, and 1-based coordinates (`Row X, Column Y`).
   - Updates immediately upon every valid move.
2. **Mode-Aware "Undo Last Move"**:
   - **Two-Player Mode**: Undoes the single most recent move, clears the cell, and returns the turn to the previous player.
   - **Computer Mode**: Atomically rolls back **both** the computer's move and the human player's previous move together, returning the turn to Player X.
   - Reconstructs the board from history to guarantee zero state drift, recalculates win/draw statuses, and gracefully rolls back recorded scores if undone from a completed game.
3. **Session-Level Scoreboard**:
   - Tracks cumulative **Player X Wins**, **Player O Wins**, and **Draws**.
   - Increments strictly **once** per completed match.
   - Provides an independent **Reset Scores** option that resets storage to zero without interrupting an ongoing match.
4. **Basic Computer Opponent Mode (5-Priority Strategy)**:
   - Human controls Player X; Computer controls Player O.
   - Automated turn execution following a human-like 350ms cognitive delay.
   - Strict priority rule hierarchy:
     1. _Priority 1_: Take winning move for Computer (O) if available.
     2. _Priority 2_: Block Human (X) if they can win on their next turn.
     3. _Priority 3_: Take center cell (Row 2, Column 2 / Index 4) if available.
     4. _Priority 4_: Take a corner cell (`0`, `2`, `6`, `8`) if available.
     5. _Priority 5_: Take any open cell.

---

## 4. How to Run the Frontend Locally

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Execution Steps

1. **Navigate to the Repository Directory**:

   ```bash
   cd "bhanuTicTacToe"
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Start the Local Development Server**:

   ```bash
   npm run dev
   ```

   Open your browser and navigate to `http://localhost:5173`.

4. **Build for Production**:

   ```bash
   npm run build
   ```

   This compiles TypeScript via `tsc -b` and bundles assets with Vite into the `dist/` directory.

5. **Preview Production Build**:

   ```bash
   npm run preview
   ```

6. **Format & Lint Code**:
   ```bash
   npm run format         # Auto-format all files with Prettier
   npm run format:check   # Validate formatting
   npm run lint           # Execute ESLint checks
   ```

---

## 5. Storage & Client API Interface Summary

Because this application is engineered as an in-browser client-only architecture, no remote HTTP/REST endpoints are required. All persistence is managed on the client side using the **Browser Session Storage API** (`window.sessionStorage`).

### Session Storage Contract

- **Storage Key**: `tictactoe_session_scoreboard_v1`
- **Storage Medium**: `sessionStorage` (Isolated to the current browser tab; persists across page reloads/refreshes, automatically clears upon closing the tab).
- **Payload Schema**:
  ```typescript
  interface ScoreboardState {
    xWins: number; // Non-negative integer count of Player X wins
    oWins: number; // Non-negative integer count of Player O wins
    draws: number; // Non-negative integer count of tied games
  }
  ```
- **Serialization**: JSON stringified (`JSON.stringify(scoreboard)`).
- **Defensive Deserialization**: Validates data types upon retrieval via `loadScoreboard()`. If the storage item is missing, malformed, or blocked by browser privacy settings, it falls back to `{ xWins: 0, oWins: 0, draws: 0 }`.

---

## 6. How to Run Tests

The application includes an automated test suite powered by **Cypress** covering end-to-end user flows, game state transitions, and algorithmic decision rules.

### Running Cypress E2E Tests Headlessly

```bash
cd bhanuTicTacToe
npm run cypress:run
# or
npm run test:e2e
```

### Running Cypress Interactively (Cypress Test Runner)

```bash
cd bhanuTicTacToe
npm run cypress:open
```

### What the Test Suite Validates

- **Valid Move & Lock**: Clicking an empty cell marks it and disables further clicks.
- **Invalid Move Handling**: Clicking an occupied cell causes no state changes.
- **Turn Alternation**: Player turns swap from X to O and back to X.
- **Win Detection**: Row win, column win, and diagonal win detection with cell highlights.
- **Draw Detection**: Full board without 3-in-a-row triggers draw banner and increments draw tally.
- **Move After Game Completion**: Board locks upon game completion; further clicks are ignored.
- **Reset Game**: Clears board, resets player turn to X, empties history, and keeps scoreboard intact.
- **Undo in Two-Player Mode**: Pops 1 move and reverts turn.
- **Undo in Computer Mode**: Pops 2 moves (Computer O + Human X) together and restores Human turn.
- **Scoreboard Updating**: Increments strictly once per game; resets via "Reset Scores".
- **Computer AI Priority Rules**: Validates Priority 1 (Win), Priority 2 (Block), Priority 3 (Center), Priority 4 (Corner), and Priority 5 (Any).

---

## 7. AI Tools & Prompt Engineering Summary (Gemini 3.1 Pro)

This project was developed through pair-programming collaboration with **Gemini 3.1 Pro** via the Google DeepMind Antigravity agentic platform.

### Feature-Wise Prompting & Architecture Discussions

#### 1. Theme Context & React 19 Fast Refresh Separation

- **Prompting Strategy**: Designed a theme provider using React Context API to support dynamic switching between light and dark modes.
- **Engineering Challenge**: React Refresh (`eslint-plugin-react-refresh`) flags files exporting both components and non-component constants/contexts.
- **Solution**: Decoupled the context declaration into [`src/context/ThemeContext.ts`](./src/context/ThemeContext.ts), the provider into [`src/context/ThemeProvider.tsx`](./src/context/ThemeProvider.tsx), and the consumption hook into [`src/hooks/useTheme.ts`](./src/hooks/useTheme.ts).

#### 2. Game State Management & React 19 Effect Safety

- **Prompting Strategy**: Implemented the central game loop in [`src/hooks/useTicTacToe.ts`](./src/hooks/useTicTacToe.ts).
- **Engineering Challenge**: React 19 strict linting (`react-hooks/set-state-in-effect`) flags calling `setState` synchronously within `useEffect` hooks as an antipattern that causes cascading renders.
- **Solution**:
  - Replaced effect-based score synchronization with **event-driven updates**: when a move is made, the board state is evaluated immediately in the move handler (`handleCellClick` or computer move callback), and the score is committed atomically.
  - Formulated `isComputerThinking` as a pure **derived state** (`gameMode === 'computer' && currentPlayer === 'O' && outcome === 'in-progress'`), eliminating redundant state variables.

#### 3. Mode-Aware Transactional Undo

- **Prompting Strategy**: Specified distinct rollback semantics for Two-Player mode vs Computer Opponent mode.
- **Solution**:
  - In Two-Player mode, the stack pops 1 move.
  - In Computer mode, the stack pops 2 moves (Computer + Human) so the human is never left waiting on the computer's turn.
  - Reconstructed the board state deterministically from the sliced history array, guaranteeing zero board corruption.

#### 4. Type Safety & TypeScript Strictness

- **Prompting Strategy**: Created comprehensive domain types in [`src/types/game.ts`](./src/types/game.ts) with zero `any` types.
- **Solution**: Enforced `verbatimModuleSyntax` compatibility with explicit type-only imports (`import type { ... }`).

---

## 8. Design Decisions & Architectural Thinking

```
┌─────────────────────────────────────────────────────────────┐
│                       Presentation Layer                    │
│   (App, Scoreboard, GameModeSelector, GameStatus,           │
│    GameBoard, Cell, Controls, MoveHistory)                  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Dispatches Actions / Subscribes
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Application Logic Layer                     │
│                (useTicTacToe Custom Hook)                   │
│   - Game state machine & transitions                        │
│   - Dual-mode Undo transaction coordination                 │
│   - Automated AI turn scheduling & delay orchestration      │
│   - Once-per-game completion synchronization guard          │
└──────────────┬──────────────────────────────┬───────────────┘
               │ Invokes Pure Logic           │ Reads / Writes
               ▼                              ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│      Domain Logic Layer      │ │      Persistence Layer     │
│   - gameLogic.ts             │ │   - storage.ts             │
│   - computerLogic.ts         │ │     (sessionStorage        │
│                              │ │      safe adapter)         │
└──────────────────────────────┘ └────────────────────────────┘
```

1. **Unidirectional Data Flow**: State flows top-down from `useTicTacToe` to presentational components; actions flow upward via explicit callback props.
2. **Deterministic Board Reconstruction**: Rather than mutating board cells on undo, the board is recomputed from the remaining move history. This guarantees mathematical purity and prevents state synchronization bugs.
3. **Session-Level Scope**: Using `sessionStorage` satisfies the requirement for session-bound persistence without retaining stale scores indefinitely across days or different browser users.
4. **Tailwind CSS Utility Design**: Replaced bespoke custom CSS with Tailwind CSS v4 utility classes, providing consistent spacing, responsive typography, and native dark mode support.

---

## 9. Clarifications & Assumptions

- **Computer Mode Player Assignment**: By default, Human is Player X and moves first; Computer is Player O and moves second.
- **Scoreboard Longevity**: The scoreboard represents the current browser tab session (`sessionStorage`). Closing the tab resets the session.
- **Score Update Invariant**: A single finished match increments the tally by exactly +1. Undoing a finished match rolls back the increment, allowing replay.
- **AI Turn Pacing**: Added a 350ms cognitive delay for computer moves so human players perceive a natural, responsive cadence.

---

## 10. Known Limitations

- **Fixed Grid Size**: Designed specifically for standard 3×3 Tic Tac Toe. Dynamic $N \times N$ board sizes are not yet supported.
- **Heuristic Computer AI**: The AI implements a deterministic 5-level priority rule system rather than a full Minimax tree search. While highly competent at winning and blocking, it can be beaten by specialized corner-fork setups.
- **Tab Isolation**: `sessionStorage` is scoped to a single browser tab and is not synchronized across multiple simultaneous browser tabs.

---

## 11. Future Improvements & Research Integration

1. **Minimax AI with Alpha-Beta Pruning**: Implement an unbeatable AI difficulty setting alongside Easy, Medium, and Expert modes.
2. **Dynamic Grid Dimensions**: Expand engine to support $4 \times 4$ and $5 \times 5$ grids with configurable $K$-in-a-row winning conditions.
3. **Real-Time Multiplayer (WebRTC / WebSockets)**: Enable peer-to-peer online play via room invitation codes.
4. **Web Audio Sound Effects**: Incorporate subtle audio chimes on cell clicks, win celebrations, and draw outcomes with a mute toggle.
5. **Progressive Web App (PWA)**: Add service worker caching and web manifest for full offline mobile installation.
