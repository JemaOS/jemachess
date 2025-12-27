import { describe, it, expect, beforeEach } from 'vitest';
import { ChessBoard } from '../../src/engine/board';
import { PieceType, PieceColor } from '../../src/types';

describe('ChessBoard', () => {
  let board: ChessBoard;

  beforeEach(() => {
    board = new ChessBoard();
  });

  it('should initialize with an empty board', () => {
    // By default constructor creates empty board, but let's verify a random square is empty
    expect(board.getPiece({ file: 0, rank: 0 })).toBeNull();
  });

  it('should setup initial position correctly', () => {
    board.setupInitialPosition();

    // Check White Rook at a1 (0,0)
    const whiteRook = board.getPiece({ file: 0, rank: 0 });
    expect(whiteRook).toEqual({ type: PieceType.ROOK, color: PieceColor.WHITE });

    // Check White King at e1 (4,0)
    const whiteKing = board.getPiece({ file: 4, rank: 0 });
    expect(whiteKing).toEqual({ type: PieceType.KING, color: PieceColor.WHITE });

    // Check Black Pawn at a7 (0,6)
    const blackPawn = board.getPiece({ file: 0, rank: 6 });
    expect(blackPawn).toEqual({ type: PieceType.PAWN, color: PieceColor.BLACK });

    // Check Black King at e8 (4,7)
    const blackKing = board.getPiece({ file: 4, rank: 7 });
    expect(blackKing).toEqual({ type: PieceType.KING, color: PieceColor.BLACK });

    // Check empty square at e4 (4,3)
    expect(board.getPiece({ file: 4, rank: 3 })).toBeNull();
  });
});
