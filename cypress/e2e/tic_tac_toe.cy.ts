describe('Tic Tac Toe Application - Full Core Game Logic Suite', () => {
  beforeEach(() => {
    // Clear session storage before each test to ensure deterministic scores
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    cy.visit('/');
  });

  describe('1. Valid Move, Invalid Move & Turn Switching', () => {
    it('should allow valid moves, lock occupied cells, and alternate turns correctly', () => {
      // Initially, turn is Player X
      cy.get('[data-testid="game-status"]').should(
        'contain.text',
        'Current Turn: Player X'
      );

      // Valid move: Player X clicks cell 0 (Row 1, Column 1)
      cy.get('[data-testid="cell-0"]').click();
      cy.get('[data-testid="cell-0"]')
        .should('contain.text', 'X')
        .and('be.disabled');

      // Turn switches to Player O
      cy.get('[data-testid="game-status"]').should(
        'contain.text',
        'Current Turn: Player O'
      );

      // Move history updates
      cy.get('[data-testid="move-row"]').should('have.length', 1);
      cy.get('[data-testid="move-row"]')
        .first()
        .should('contain.text', '1')
        .and('contain.text', 'X')
        .and('contain.text', 'Row 1, Col 1');

      // Invalid move: clicking occupied cell 0 again should do nothing
      cy.get('[data-testid="cell-0"]').click({ force: true });
      cy.get('[data-testid="move-row"]').should('have.length', 1);
      cy.get('[data-testid="game-status"]').should(
        'contain.text',
        'Current Turn: Player O'
      );

      // Valid move: Player O clicks cell 4 (Row 2, Column 2)
      cy.get('[data-testid="cell-4"]').click();
      cy.get('[data-testid="cell-4"]')
        .should('contain.text', 'O')
        .and('be.disabled');

      // Turn switches back to Player X
      cy.get('[data-testid="game-status"]').should(
        'contain.text',
        'Current Turn: Player X'
      );

      // Move history has 2 entries
      cy.get('[data-testid="move-row"]').should('have.length', 2);
    });
  });

  describe('2. Win Detection (Row, Column, Diagonal)', () => {
    it('should detect a Row Win for Player X, highlight winning cells, and update scoreboard', () => {
      // Row 1: X plays 0, O plays 3, X plays 1, O plays 4, X plays 2
      cy.get('[data-testid="cell-0"]').click(); // X
      cy.get('[data-testid="cell-3"]').click(); // O
      cy.get('[data-testid="cell-1"]').click(); // X
      cy.get('[data-testid="cell-4"]').click(); // O
      cy.get('[data-testid="cell-2"]').click(); // X (Row 1 completed: 0, 1, 2)

      // Winner message
      cy.get('[data-testid="game-status"]').should(
        'contain.text',
        'Winner: Player X'
      );

      // Winning cells highlighted
      cy.get('[data-testid="cell-0"]').should('have.class', 'scale-[1.02]');
      cy.get('[data-testid="cell-1"]').should('have.class', 'scale-[1.02]');
      cy.get('[data-testid="cell-2"]').should('have.class', 'scale-[1.02]');

      // Scoreboard updated once
      cy.get('[data-testid="score-x-val"]').should('contain.text', '1');
      cy.get('[data-testid="score-o-val"]').should('contain.text', '0');
      cy.get('[data-testid="score-draw-val"]').should('contain.text', '0');
    });

    it('should detect a Column Win for Player X', () => {
      // Col 1: X plays 0, O plays 1, X plays 3, O plays 2, X plays 6
      cy.get('[data-testid="cell-0"]').click(); // X
      cy.get('[data-testid="cell-1"]').click(); // O
      cy.get('[data-testid="cell-3"]').click(); // X
      cy.get('[data-testid="cell-2"]').click(); // O
      cy.get('[data-testid="cell-6"]').click(); // X (Column 1 completed: 0, 3, 6)

      cy.get('[data-testid="game-status"]').should(
        'contain.text',
        'Winner: Player X'
      );
      cy.get('[data-testid="score-x-val"]').should('contain.text', '1');
    });

    it('should detect a Diagonal Win for Player X', () => {
      // Diagonal: X plays 0, O plays 1, X plays 4, O plays 2, X plays 8
      cy.get('[data-testid="cell-0"]').click(); // X
      cy.get('[data-testid="cell-1"]').click(); // O
      cy.get('[data-testid="cell-4"]').click(); // X
      cy.get('[data-testid="cell-2"]').click(); // O
      cy.get('[data-testid="cell-8"]').click(); // X (Main diagonal: 0, 4, 8)

      cy.get('[data-testid="game-status"]').should(
        'contain.text',
        'Winner: Player X'
      );
      cy.get('[data-testid="score-x-val"]').should('contain.text', '1');
    });
  });

  describe('3. Draw Detection', () => {
    it('should detect a Draw when all 9 cells are filled with no winner and increment Draw score', () => {
      // Fill board to reach a draw:
      // X: 0, 2, 3, 7, 8
      // O: 1, 4, 5, 6
      // Grid:
      // X O X
      // X O O
      // O X X
      cy.get('[data-testid="cell-0"]').click(); // X
      cy.get('[data-testid="cell-1"]').click(); // O
      cy.get('[data-testid="cell-2"]').click(); // X
      cy.get('[data-testid="cell-4"]').click(); // O
      cy.get('[data-testid="cell-3"]').click(); // X
      cy.get('[data-testid="cell-5"]').click(); // O
      cy.get('[data-testid="cell-7"]').click(); // X
      cy.get('[data-testid="cell-6"]').click(); // O
      cy.get('[data-testid="cell-8"]').click(); // X

      cy.get('[data-testid="game-status"]').should(
        'contain.text',
        "Game Draw! It's a tie!"
      );
      cy.get('[data-testid="score-draw-val"]').should('contain.text', '1');
      cy.get('[data-testid="score-x-val"]').should('contain.text', '0');
      cy.get('[data-testid="score-o-val"]').should('contain.text', '0');
    });
  });

  describe('4. Move After Game Completion Lock', () => {
    it('should prevent additional moves once game is completed by win or draw', () => {
      // Quick row win
      cy.get('[data-testid="cell-0"]').click(); // X
      cy.get('[data-testid="cell-3"]').click(); // O
      cy.get('[data-testid="cell-1"]').click(); // X
      cy.get('[data-testid="cell-4"]').click(); // O
      cy.get('[data-testid="cell-2"]').click(); // X (Row 1 Win)

      cy.get('[data-testid="game-status"]').should(
        'contain.text',
        'Winner: Player X'
      );

      // Attempt to click empty cell 5, 6, 7, 8
      cy.get('[data-testid="cell-5"]').should('be.disabled');
      cy.get('[data-testid="cell-5"]').click({ force: true });

      // Move history should strictly remain at 5 moves
      cy.get('[data-testid="move-row"]').should('have.length', 5);
      cy.get('[data-testid="cell-5"]').should('have.text', '');
    });
  });

  describe('5. Reset Game vs Reset Scoreboard', () => {
    it('should reset game board and history while preserving session scoreboard', () => {
      // Play a game and win
      cy.get('[data-testid="cell-0"]').click(); // X
      cy.get('[data-testid="cell-3"]').click(); // O
      cy.get('[data-testid="cell-1"]').click(); // X
      cy.get('[data-testid="cell-4"]').click(); // O
      cy.get('[data-testid="cell-2"]').click(); // X (Win)

      cy.get('[data-testid="score-x-val"]').should('contain.text', '1');

      // Click "Reset" game button
      cy.get('[data-testid="reset-game-btn"]').click();

      // Board is cleared
      cy.get('[data-testid="cell-0"]').should('have.text', '');
      cy.get('[data-testid="cell-1"]').should('have.text', '');
      cy.get('[data-testid="cell-2"]').should('have.text', '');

      // History cleared
      cy.get('[data-testid="move-history-empty"]').should('be.visible');

      // Turn reset to Player X
      cy.get('[data-testid="game-status"]').should(
        'contain.text',
        'Current Turn: Player X'
      );

      // Scoreboard remains unchanged at 1
      cy.get('[data-testid="score-x-val"]').should('contain.text', '1');

      // Now click "Reset Scores" button
      cy.get('[data-testid="reset-scoreboard-btn"]').click();
      cy.get('[data-testid="score-x-val"]').should('contain.text', '0');
    });
  });

  describe('6. Undo in Two-Player Mode', () => {
    it('should undo only the most recent move and restore the previous player turn', () => {
      // Undo button should initially be disabled
      cy.get('[data-testid="undo-btn"]').should('be.disabled');

      // Move 1: X plays cell 0
      cy.get('[data-testid="cell-0"]').click();
      // Move 2: O plays cell 4
      cy.get('[data-testid="cell-4"]').click();

      cy.get('[data-testid="move-row"]').should('have.length', 2);
      cy.get('[data-testid="game-status"]').should(
        'contain.text',
        'Current Turn: Player X'
      );

      // Click Undo
      cy.get('[data-testid="undo-btn"]').click();

      // Only O's move (cell 4) should be removed
      cy.get('[data-testid="cell-4"]')
        .should('have.text', '')
        .and('not.be.disabled');
      cy.get('[data-testid="cell-0"]').should('contain.text', 'X');

      // Turn is restored to Player O
      cy.get('[data-testid="game-status"]').should(
        'contain.text',
        'Current Turn: Player O'
      );

      // Move history has 1 move
      cy.get('[data-testid="move-row"]').should('have.length', 1);
    });
  });

  describe('7. Basic Computer Mode & Priority Move Selection', () => {
    beforeEach(() => {
      // Switch to Computer Mode
      cy.get('[data-testid="mode-computer"]').click();
    });

    it('should trigger automatic computer move and take Center (Priority 3) when available', () => {
      // Human X plays corner cell 0
      cy.get('[data-testid="cell-0"]').click();

      // Computer is thinking indicator
      cy.get('[data-testid="game-status"]').should(
        'contain.text',
        'Computer is thinking'
      );

      // Wait for computer move (350ms delay)
      // Since center (cell 4) is available and no immediate win/block exists,
      // Computer should take Center (Priority 3)
      cy.get('[data-testid="cell-4"]', { timeout: 2000 }).should(
        'contain.text',
        'O'
      );

      // Turn returns to Human (Player X)
      cy.get('[data-testid="game-status"]').should(
        'contain.text',
        'Your Turn (Player X)'
      );
      cy.get('[data-testid="move-row"]').should('have.length', 2);
    });

    it('should Block Human X from winning (Priority 2)', () => {
      // Human X plays cell 0
      cy.get('[data-testid="cell-0"]').click();
      // Computer takes center 4
      cy.get('[data-testid="cell-4"]', { timeout: 2000 }).should(
        'contain.text',
        'O'
      );

      // Human X plays cell 1 -> threat to win row 1 (0, 1 -> 2)
      cy.get('[data-testid="cell-1"]').click();

      // Computer must block X by taking cell 2 (Priority 2: Block)
      cy.get('[data-testid="cell-2"]', { timeout: 2000 }).should(
        'contain.text',
        'O'
      );
    });

    it('should Take Winning Move for Computer O (Priority 1)', () => {
      // Setup a board where Computer O has 2 in a line:
      // Human plays 1 (top edge)
      cy.get('[data-testid="cell-1"]').click();
      // Computer takes center 4
      cy.get('[data-testid="cell-4"]', { timeout: 2000 }).should(
        'contain.text',
        'O'
      );

      // Human plays 0
      cy.get('[data-testid="cell-0"]').click();
      // Computer takes corner (e.g. 2, 6, 8)
      cy.get('[data-testid="cell-2"]', { timeout: 2000 }).should(
        'contain.text',
        'O'
      );

      // Now Computer has cell 4 and cell 2 (diagonal 2, 4, 6) or (row 0, 1, 2)
      // Human plays cell 5
      cy.get('[data-testid="cell-5"]').click();

      // Computer can win along diagonal [2, 4, 6] by taking cell 6!
      cy.get('[data-testid="cell-6"]', { timeout: 2000 }).should(
        'contain.text',
        'O'
      );
      cy.get('[data-testid="game-status"]').should(
        'contain.text',
        'Computer Wins'
      );
    });
  });

  describe('8. Undo in Computer Mode', () => {
    it('should atomically undo both the Computer move and Human move together, restoring Human turn', () => {
      cy.get('[data-testid="mode-computer"]').click();

      // Human X plays cell 0
      cy.get('[data-testid="cell-0"]').click();

      // Wait for computer O to respond (takes center 4)
      cy.get('[data-testid="cell-4"]', { timeout: 2000 }).should(
        'contain.text',
        'O'
      );
      cy.get('[data-testid="move-row"]').should('have.length', 2);

      // Click Undo
      cy.get('[data-testid="undo-btn"]').click();

      // Both cell 4 (Computer O) and cell 0 (Human X) must be cleared
      cy.get('[data-testid="cell-4"]').should('have.text', '');
      cy.get('[data-testid="cell-0"]').should('have.text', '');

      // Turn is restored to Human (Player X)
      cy.get('[data-testid="game-status"]').should(
        'contain.text',
        'Your Turn (Player X)'
      );

      // History is back to 0
      cy.get('[data-testid="move-history-empty"]').should('be.visible');
    });
  });
});
