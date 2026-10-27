import {
  calculateWinner,
  checkDraw,
  formatPosition,
  getAvailableMoves,
  indexToRowCol,
} from '../../src/utils/gameLogic';
import { getComputerMove } from '../../src/utils/computerLogic';
import type { BoardState } from '../../src/types/game';

describe('Unit & Algorithmic Logic Verification', () => {
  describe('Coordinate Transforms & Position Formatting', () => {
    it('should map flat indices to 1-based Row and Column coordinates', () => {
      expect(indexToRowCol(0)).to.deep.equal({ row: 1, col: 1 });
      expect(indexToRowCol(4)).to.deep.equal({ row: 2, col: 2 });
      expect(indexToRowCol(8)).to.deep.equal({ row: 3, col: 3 });
      expect(formatPosition(0)).to.equal('Row 1, Column 1');
      expect(formatPosition(4)).to.equal('Row 2, Column 2');
      expect(formatPosition(8)).to.equal('Row 3, Column 3');
    });

    it('should return all available empty moves', () => {
      const board: BoardState = [
        'X',
        null,
        'O',
        null,
        'X',
        null,
        'O',
        null,
        'X',
      ];
      expect(getAvailableMoves(board)).to.deep.equal([1, 3, 5, 7]);
    });
  });

  describe('Win & Draw Detection Engine', () => {
    it('should accurately detect row wins', () => {
      const row1Win: BoardState = [
        'X',
        'X',
        'X',
        null,
        'O',
        'O',
        null,
        null,
        null,
      ];
      const win = calculateWinner(row1Win);
      assert.isNotNull(win);
      expect(win?.winner).to.equal('X');
      expect(win?.line).to.deep.equal([0, 1, 2]);
    });

    it('should accurately detect column wins', () => {
      const col2Win: BoardState = [
        'X',
        'O',
        null,
        'X',
        'O',
        null,
        null,
        'O',
        'X',
      ];
      const win = calculateWinner(col2Win);
      assert.isNotNull(win);
      expect(win?.winner).to.equal('O');
      expect(win?.line).to.deep.equal([1, 4, 7]);
    });

    it('should accurately detect diagonal wins', () => {
      const diagWin: BoardState = [
        'O',
        'X',
        null,
        null,
        'O',
        'X',
        null,
        null,
        'O',
      ];
      const win = calculateWinner(diagWin);
      assert.isNotNull(win);
      expect(win?.winner).to.equal('O');
      expect(win?.line).to.deep.equal([0, 4, 8]);
    });

    it('should identify draw condition when all 9 cells are full and no winner', () => {
      const drawBoard: BoardState = [
        'X',
        'O',
        'X',
        'X',
        'O',
        'O',
        'O',
        'X',
        'X',
      ];
      assert.isNull(calculateWinner(drawBoard));
      assert.isTrue(checkDraw(drawBoard, null));
    });

    it('should not mark as draw if game has a winner even if board is full', () => {
      const wonFullBoard: BoardState = [
        'X',
        'X',
        'X',
        'O',
        'O',
        'X',
        'X',
        'O',
        'O',
      ];
      const win = calculateWinner(wonFullBoard);
      assert.isNotNull(win);
      assert.isFalse(checkDraw(wonFullBoard, win));
    });
  });

  describe('Computer AI - 5-Level Priority Decision Rules', () => {
    it('Priority 1: should choose immediate winning move for Computer O', () => {
      // O has indices 0 and 1, index 2 is empty -> O must take 2 to win
      const board: BoardState = [
        'O',
        'O',
        null,
        'X',
        'X',
        null,
        null,
        null,
        null,
      ];
      expect(getComputerMove(board)).to.equal(2);
    });

    it('Priority 2: should block Human X when X is about to win', () => {
      // X has indices 3 and 4, index 5 is empty -> O must block at 5
      const board: BoardState = [
        'O',
        null,
        null,
        'X',
        'X',
        null,
        null,
        null,
        null,
      ];
      expect(getComputerMove(board)).to.equal(5);
    });

    it('Priority 3: should take Center cell (4) if available', () => {
      // X took corner 0, no immediate win or block -> O must take Center (4)
      const board: BoardState = [
        'X',
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ];
      expect(getComputerMove(board)).to.equal(4);
    });

    it('Priority 4: should take a Corner (0, 2, 6, 8) when Center is occupied', () => {
      // Human X took center (4) -> O must take a corner (0, 2, 6, 8)
      const board: BoardState = [
        null,
        null,
        null,
        null,
        'X',
        null,
        null,
        null,
        null,
      ];
      const move = getComputerMove(board);
      expect([0, 2, 6, 8]).to.include(move);
    });

    it('Priority 5: should take any remaining cell when Center and Corners are taken', () => {
      // Corners 0, 2, 6, 8 and Center 4 are occupied
      const board: BoardState = [
        'X',
        null,
        'O',
        null,
        'X',
        null,
        'O',
        null,
        'X',
      ];
      const move = getComputerMove(board);
      // Available are edges: 1, 3, 5, 7
      expect([1, 3, 5, 7]).to.include(move);
    });
  });
});
