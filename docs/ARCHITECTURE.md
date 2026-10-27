# Tic Tac Toe - System Architecture & Design Specification

## 1. Architectural Overview

The Tic Tac Toe application is engineered using clean architecture principles, separating user interface, state management, pure algorithmic logic, and browser storage persistence.

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
│     (Win & draw calculation, │ │     (sessionStorage        │
│      coordinate mapper)      │ │      adapter with JSON     │
│   - aiLogic.ts               │ │      validation & schema   │
│     (5-priority decision     │ │      fallback)             │
│      rule engine)            │ └────────────────────────────┘
└──────────────────────────────┘
```

---

## 2. Component Hierarchy & Data Flow

```mermaid
graph TD
    App[App Container] --> ScoreboardComp[Scoreboard]
    App --> ModeSelector[GameModeSelector]
    App --> StatusBanner[GameStatus]
    App --> Board[GameBoard]
    App --> ControlsComp[Controls]
    App --> HistoryTable[MoveHistory]

    Board --> C0[Cell 0]
    Board --> C1[Cell 1]
    Board --> C2[Cell 2]
    Board --> C3[Cell 3]
    Board --> C4[Cell 4]
    Board --> C5[Cell 5]
    Board --> C6[Cell 6]
    Board --> C7[Cell 7]
    Board --> C8[Cell 8]

    Hook[useTicTacToe Hook] -.->|State & Handlers| App
```

### Unidirectional Data Flow

1. **User Action**: The user clicks a cell or control button.
2. **Hook Handler**: `handleCellClick`, `undoMove`, `resetGame`, or `resetScoreboard` is invoked.
3. **Pure Logic Execution**: Game outcome, available moves, or next AI move are computed using deterministic pure functions.
4. **State Transition**: React hook updates its internal state.
5. **Re-render**: Presentational components receive fresh props and update the DOM.
6. **Side Effects**: If game is won or drawn, `useEffect` synchronizes the scoreboard with `sessionStorage` strictly once. If computer mode is active and it's 'O' turn, a timed AI move is triggered.

---

## 3. Game State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle: Init / Reset Game
    Idle --> InProgress: First Valid Move (X)
    InProgress --> InProgress: Valid Move (Turn Flips)
    InProgress --> Won: 3 in a Row Detected
    InProgress --> Draw: 9 Cells Filled (No Winner)

    Won --> ScoreUpdated: Increment Score (Once)
    Draw --> ScoreUpdated: Increment Score (Once)

    ScoreUpdated --> Idle: Reset Game (Board Cleared)
    ScoreUpdated --> InProgress: Undo Last Move (Board Restored)

    InProgress --> Idle: Undo to 0 Moves
    ScoreUpdated --> ScoreUpdated: Reset Scoreboard (Scores zeroed)
```

---

## 4. Sequence Diagrams

### Computer Opponent Turn Execution

```mermaid
sequenceDiagram
    autonumber
    actor Human as Human (Player X)
    participant UI as Board UI
    participant Hook as useTicTacToe Hook
    participant AI as aiLogic (Rule Engine)
    participant Storage as sessionStorage

    Human->>UI: Clicks Cell (e.g., Index 0)
    UI->>Hook: handleCellClick(0)
    Hook->>Hook: Board[0] = 'X', Switch Turn to 'O', History.push(Move 1)
    Hook->>UI: Render Board with X, isComputerThinking = true

    Note over Hook: 400ms Cognitive Delay (setTimeout)
    Hook->>AI: getComputerMove(board)
    AI-->>Hook: Returns Cell (Priority 1 -> 5, e.g. Center 4)
    Hook->>Hook: Board[4] = 'O', Switch Turn to 'X', History.push(Move 2)
    Hook->>Hook: isComputerThinking = false
    Hook->>UI: Render Board with O, Turn back to Player X
```

### Dual-Mode Undo Transaction

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant UI as Controls UI
    participant Hook as useTicTacToe Hook
    participant Logic as gameLogic

    User->>UI: Clicks "Undo Last Move"
    UI->>Hook: undoMove()

    alt Two-Player Mode
        Hook->>Hook: Pop 1 Move from History
        Hook->>Hook: Revert Cell to null
        Hook->>Hook: Revert currentPlayer to undone player
    else Computer Mode
        Hook->>Hook: Pop 2 Moves (Computer 'O' + Human 'X')
        Hook->>Hook: Revert both Cells to null
        Hook->>Hook: Restore currentPlayer to 'X'
    end

    Hook->>Logic: calculateWinner(restoredBoard)
    Logic-->>Hook: WinState or null
    Hook->>Hook: Reset hasScoreBeenUpdated = false (if previously won/drawn)
    Hook->>UI: Re-render restored board and accurate turn
```

---

## 5. Storage Persistence Architecture

```mermaid
flowchart LR
    subgraph Browser Storage
        SS[(sessionStorage)]
    end

    subgraph Storage Adapter
        Read[loadScoreboard]
        Write[saveScoreboard]
        Clear[clearScoreboardStorage]
    end

    subgraph State
        ScoreState[React scoreboard state]
    end

    SS -->|Initial Mount| Read -->|JSON.parse + Validation| ScoreState
    ScoreState -->|Game Won / Drawn| Write -->|JSON.stringify| SS
    Clear -->|Reset Scoreboard Action| SS
```

### Persistence Guarantees

- **Isolation**: Each browser tab maintains its own independent session.
- **Resilience**: Malformed or missing storage values automatically fallback to initial values (`{ xWins: 0, oWins: 0, draws: 0 }`).
- **Separation of Concerns**: Game board state is ephemeral in React memory; only session score tally is committed to `sessionStorage`.
- **Reset Orthogonality**: Resetting the game clears the board without mutating the scoreboard; resetting the scoreboard clears storage without interrupting the current match.

---

## 6. Mathematical Invariants & Testable Properties

1. **Board Cell Invariance**:
   $$\forall i \in [0, 8], \quad \text{board}[i] \in \{ \text{'X'}, \text{'O'}, \text{null} \}$$
2. **Move Count Invariance**:
   $$\text{board.filter}(c \neq \text{null}).\text{length} == \text{history.length}$$
3. **Turn Parity in Two-Player Mode**:
   $$\text{currentPlayer} = (\text{history.length} \pmod 2 == 0) \ ? \ \text{'X'} : \text{'O'}$$
4. **Turn Parity in Computer Mode**:
   $$\text{After human move: Turn is 'O'. After AI response: Turn is 'X'.}$$
5. **Scoreboard Integrity**:
   $$\text{Total Completed Games} = \text{xWins} + \text{oWins} + \text{draws}$$
   A single completed game increases Total Completed Games by exactly 1.
