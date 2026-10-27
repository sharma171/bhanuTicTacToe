# Tic Tac Toe - Things Needed List (Bill of Materials & Specifications)

This document details every required package, component, interface, state variable, design token, and file asset needed to deliver the complete Tic Tac Toe application.

---

## 1. Dependencies & Tooling

### Runtime Dependencies

| Package     | Version   | Purpose                                              |
| :---------- | :-------- | :--------------------------------------------------- |
| `react`     | `^19.2.8` | Core UI library for declarative component rendering. |
| `react-dom` | `^19.2.8` | React DOM renderer.                                  |

### Development Dependencies

| Package                | Version    | Purpose                                           |
| :--------------------- | :--------- | :------------------------------------------------ |
| `typescript`           | `~6.0.2`   | Compile-time type safety.                         |
| `vite`                 | `^8.3.0`   | Ultra-fast local dev server & production bundler. |
| `@vitejs/plugin-react` | `^6.1.1`   | React fast refresh & JSX compiler plugin.         |
| `prettier`             | `^3.9.10`  | Code formatting engine.                           |
| `eslint`               | `^10.10.0` | Static code analysis.                             |
| `typescript-eslint`    | `^8.69.0`  | TypeScript ESLint plugin.                         |
| `@types/react`         | `^19.2.18` | React type declarations.                          |
| `@types/react-dom`     | `^19.2.7`  | React DOM type declarations.                      |

---

## 2. File System Structure

```
c:\My_Repos\assessmentsCompanies\ABB job assessment/
├── .editorconfig                       # Root indentation and line-ending rules
├── .gitignore                          # Root Git ignore
├── docs/                               # Engineering documentation
│   ├── IMPLEMENTATION_PLAN.md          # Phased engineering rollout
│   ├── TODO.md                         # Granular actionable checklist
│   ├── CODE_CONCEPTS.md                # Algorithmic models & deep dives
│   ├── THINGS_NEEDED_LIST.md           # Full asset & component specifications
│   └── ARCHITECTURE.md                 # System diagrams & data flow
└── bhanuTicTacToe/                     # React + Vite application root
    ├── .editorconfig
    ├── .gitignore
    ├── .prettierignore
    ├── .prettierrc
    ├── .vscode/
    │   ├── settings.json               # Auto format on save
    │   └── extensions.json             # Recommended extensions
    ├── index.html                      # Entry HTML
    ├── package.json                    # Scripts & dependencies
    ├── tsconfig.json                   # TS base configuration
    ├── tsconfig.app.json               # TS app configuration
    ├── tsconfig.node.json              # TS Node configuration
    ├── vite.config.ts                  # Vite build settings
    └── src/
        ├── main.tsx                    # React DOM root entry
        ├── App.tsx                     # Main layout shell
        ├── App.css                     # Responsive CSS layout & styling
        ├── index.css                   # Global theme tokens & resets
        ├── types/
        │   └── game.ts                 # Full TypeScript domain contracts
        ├── constants/
        │   └── gameConstants.ts        # Board dimensions, lines, storage keys
        ├── utils/
        │   ├── gameLogic.ts            # Winner/Draw detection & coordinate helpers
        │   ├── aiLogic.ts              # 5-Priority computer opponent AI
        │   └── storage.ts              # Browser sessionStorage adapter
        ├── hooks/
        │   └── useTicTacToe.ts         # Central game state management hook
        └── components/
            ├── Scoreboard.tsx          # Win/Draw counters & Reset Scoreboard
            ├── GameModeSelector.tsx    # Two-Player vs Computer mode toggle
            ├── GameStatus.tsx          # Turn announcement, Win & Draw banner
            ├── GameBoard.tsx           # 3x3 CSS Grid layout
            ├── Cell.tsx                # Clickable 3x3 grid unit with win highlight
            ├── Controls.tsx            # Undo Last Move & Reset Game buttons
            └── MoveHistory.tsx         # Data table of previous moves
```

---

## 3. Component Inventory & Props Specifications

### 1. `Scoreboard.tsx`

- **Purpose**: Displays running tally of Player X wins, Player O wins, and Draws. Provides independent scoreboard reset.
- **Props**:

```typescript
interface ScoreboardProps {
  scoreboard: ScoreboardState;
  onResetScoreboard: () => void;
}
```

### 2. `GameModeSelector.tsx`

- **Purpose**: Allows user to toggle between `two-player` and `computer` modes.
- **Props**:

```typescript
interface GameModeSelectorProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  disabled?: boolean;
}
```

### 3. `GameStatus.tsx`

- **Purpose**: Displays whose turn it is, computer thinking status, or win/draw announcement.
- **Props**:

```typescript
interface GameStatusProps {
  currentPlayer: Player;
  outcome: GameOutcome;
  winner: Player | null;
  gameMode: GameMode;
  isComputerThinking: boolean;
}
```

### 4. `GameBoard.tsx`

- **Purpose**: 3x3 container rendering 9 interactive cell buttons.
- **Props**:

```typescript
interface GameBoardProps {
  board: BoardState;
  onCellClick: (index: number) => void;
  winningIndices: WinningLine | null;
  disabled: boolean;
}
```

### 5. `Cell.tsx`

- **Purpose**: Represents a single cell on the board.
- **Props**:

```typescript
interface CellProps {
  index: number;
  value: CellValue;
  isWinningCell: boolean;
  disabled: boolean;
  onClick: () => void;
}
```

### 6. `Controls.tsx`

- **Purpose**: Host action buttons for game management (Undo Move, Reset Game).
- **Props**:

```typescript
interface ControlsProps {
  onUndo: () => void;
  onResetGame: () => void;
  canUndo: boolean;
}
```

### 7. `MoveHistory.tsx`

- **Purpose**: Renders the table of past moves in the active game.
- **Props**:

```typescript
interface MoveHistoryProps {
  history: MoveRecord[];
}
```

---

## 4. Hook API Specification (`useTicTacToe`)

```typescript
export interface UseTicTacToeReturn {
  // State
  board: BoardState;
  currentPlayer: Player;
  gameMode: GameMode;
  outcome: GameOutcome;
  winner: Player | null;
  winningLine: WinningLine | null;
  history: MoveRecord[];
  scoreboard: ScoreboardState;
  isComputerThinking: boolean;
  canUndo: boolean;

  // Actions
  handleCellClick: (index: number) => void;
  undoMove: () => void;
  resetGame: () => void;
  resetScoreboard: () => void;
  setGameMode: (mode: GameMode) => void;
}
```

---

## 5. Visual Styling & Design System Elements

### Color Palette (CSS Variables)

- Primary Accent: `#4f46e5` (Indigo-600)
- Player X Color: `#2563eb` (Blue-600)
- Player O Color: `#dc2626` (Red-600)
- Winning Cell Glow: `#10b981` (Emerald-500)
- Neutral Dark Surface: `#1e1e24`
- Neutral Light Surface: `#ffffff`
- Board Border: `#e2e8f0` (Light) / `#334155` (Dark)

### Typography & Layout

- Grid: CSS Grid with `repeat(3, 1fr)` and responsive clamp sizes (`min(280px, 90vw)` up to `360px`).
- Fonts: Modern system font stack (`system-ui, -apple-system, sans-serif`).
- Micro-interactions: Scale transforms (`transform: scale(0.96)`) on cell click, smooth fade-in for history rows.

---

## 6. Accessibility & Usability (a11y)

- Semantic `<button>` elements for all interactive controls and board cells.
- Descriptive `aria-label` for each cell (e.g. `aria-label="Row 1, Column 1: Empty"` or `"Row 2, Column 2: X"`).
- Keyboard accessible via `Tab` and `Enter` / `Space`.
- Visual focus ring (`outline: 2px solid var(--accent)`).
- Status changes announced via `role="status"` and `aria-live="polite"`.
