import { describe, expect, it } from 'vitest';

import { Position } from '../position.js';

import type { Piece, Square } from '../types.js';

describe('Position constructor', () => {
  it('defaults to starting position with no args', () => {
    const pos = new Position();
    expect(pos.turn).toBe('w');
    expect(pos.halfmoveClock).toBe(0);
    expect(pos.fullmoveNumber).toBe(1);
    expect(pos.castlingRights).toEqual({
      bK: true,
      bQ: true,
      wK: true,
      wQ: true,
    });
    expect(pos.enPassantSquare).toBeUndefined();
  });

  it('starting position has 32 pieces', () => {
    const pos = new Position();
    expect(pos.pieces().size).toBe(32);
  });

  it('accepts a custom board', () => {
    const board = new Map<Square, Piece>([
      ['e1', { color: 'w', type: 'k' }],
      ['e8', { color: 'b', type: 'k' }],
    ]);
    const pos = new Position(board);
    expect(pos.pieces().size).toBe(2);
    expect(pos.turn).toBe('w');
  });

  it('accepts options to override defaults', () => {
    const board = new Map<Square, Piece>([
      ['e1', { color: 'w', type: 'k' }],
      ['e8', { color: 'b', type: 'k' }],
    ]);
    const pos = new Position(board, {
      turn: 'b',
      halfmoveClock: 5,
      fullmoveNumber: 10,
      castlingRights: { bK: false, bQ: false, wK: false, wQ: false },
      enPassantSquare: 'e3',
    });
    expect(pos.turn).toBe('b');
    expect(pos.halfmoveClock).toBe(5);
    expect(pos.fullmoveNumber).toBe(10);
    expect(pos.castlingRights).toEqual({
      bK: false,
      bQ: false,
      wK: false,
      wQ: false,
    });
    expect(pos.enPassantSquare).toBe('e3');
  });
});

describe('piece', () => {
  it('returns piece on occupied square', () => {
    const pos = new Position();
    expect(pos.piece('e1')).toEqual({ color: 'w', type: 'k' });
  });

  it('returns undefined for empty square', () => {
    const pos = new Position();
    expect(pos.piece('e4')).toBeUndefined();
  });
});

describe('pieces', () => {
  it('returns all 32 pieces when no color filter', () => {
    const pos = new Position();
    expect(pos.pieces().size).toBe(32);
  });

  it('returns 16 white pieces', () => {
    const pos = new Position();
    expect(pos.pieces('w').size).toBe(16);
  });

  it('returns 16 black pieces', () => {
    const pos = new Position();
    expect(pos.pieces('b').size).toBe(16);
  });
});

describe('findPiece', () => {
  it('returns squares with matching piece', () => {
    const pos = new Position();
    const squares = pos.findPiece({ color: 'w', type: 'r' });
    expect(squares).toHaveLength(2);
    expect(squares).toContain('a1');
    expect(squares).toContain('h1');
  });

  it('returns empty array when piece not found', () => {
    const board = new Map<Square, Piece>([
      ['e1', { color: 'w', type: 'k' }],
      ['e8', { color: 'b', type: 'k' }],
    ]);
    const pos = new Position(board);
    expect(pos.findPiece({ color: 'w', type: 'q' })).toEqual([]);
  });

  // Ported from chess.js findPiece test suite
  it('returns single square for unique piece (kings)', () => {
    const pos = new Position();
    expect(pos.findPiece({ color: 'w', type: 'k' })).toEqual(['e1']);
    expect(pos.findPiece({ color: 'b', type: 'k' })).toEqual(['e8']);
  });

  it('returns ordered squares for knights', () => {
    const pos = new Position();
    expect(pos.findPiece({ color: 'w', type: 'n' })).toEqual(['b1', 'g1']);
  });

  it('returns all 8 squares for black pawns in order', () => {
    const pos = new Position();
    expect(pos.findPiece({ color: 'b', type: 'p' })).toEqual([
      'a7',
      'b7',
      'c7',
      'd7',
      'e7',
      'f7',
      'g7',
      'h7',
    ]);
  });
});

describe('isAttacked', () => {
  it('returns true when a white pawn attacks the square diagonally', () => {
    const board = new Map<Square, Piece>([
      ['e1', { color: 'w', type: 'k' }],
      ['d3', { color: 'w', type: 'p' }],
    ]);
    const pos = new Position(board);
    expect(pos.isAttacked('e4', 'w')).toBe(true);
  });

  it('returns false when no piece attacks the square', () => {
    const board = new Map<Square, Piece>([['e1', { color: 'w', type: 'k' }]]);
    const pos = new Position(board);
    expect(pos.isAttacked('e4', 'b')).toBe(false);
  });

  it('returns true when a knight attacks the square', () => {
    const board = new Map<Square, Piece>([
      ['e1', { color: 'w', type: 'k' }],
      ['f6', { color: 'b', type: 'n' }],
    ]);
    const pos = new Position(board);
    expect(pos.isAttacked('e4', 'b')).toBe(true);
    expect(pos.isAttacked('g4', 'b')).toBe(true);
    expect(pos.isAttacked('a1', 'b')).toBe(false);
  });

  // Ported from chess.js isAttacked test suite
  it('white pawn attacks diagonally but not forward', () => {
    // 4k3/4p3/8/8/8/8/4P3/4K3 w - - 0 1
    const board = new Map<Square, Piece>([
      ['e8', { color: 'b', type: 'k' }],
      ['e7', { color: 'b', type: 'p' }],
      ['e2', { color: 'w', type: 'p' }],
      ['e1', { color: 'w', type: 'k' }],
    ]);
    const pos = new Position(board);
    expect(pos.isAttacked('d3', 'w')).toBe(true);
    expect(pos.isAttacked('f3', 'w')).toBe(true);
    expect(pos.isAttacked('d3', 'b')).toBe(false);
    expect(pos.isAttacked('f3', 'b')).toBe(false);
    // pawn forward moves are not attacks
    expect(pos.isAttacked('e3', 'w')).toBe(false);
    expect(pos.isAttacked('e4', 'w')).toBe(false);
  });

  it('black pawn attacks diagonally but not forward', () => {
    // 4k3/4p3/8/8/8/8/4P3/4K3 w - - 0 1
    const board = new Map<Square, Piece>([
      ['e8', { color: 'b', type: 'k' }],
      ['e7', { color: 'b', type: 'p' }],
      ['e2', { color: 'w', type: 'p' }],
      ['e1', { color: 'w', type: 'k' }],
    ]);
    const pos = new Position(board);
    expect(pos.isAttacked('f6', 'b')).toBe(true);
    expect(pos.isAttacked('d6', 'b')).toBe(true);
    expect(pos.isAttacked('f6', 'w')).toBe(false);
    expect(pos.isAttacked('d6', 'w')).toBe(false);
    // pawn forward moves are not attacks
    expect(pos.isAttacked('e6', 'b')).toBe(false);
    expect(pos.isAttacked('e5', 'b')).toBe(false);
  });

  it('knight attacks all 8 squares and not its own square', () => {
    // 4k3/4p3/8/8/4N3/8/8/4K3 w - - 0 1
    const board = new Map<Square, Piece>([
      ['e8', { color: 'b', type: 'k' }],
      ['e4', { color: 'w', type: 'n' }],
      ['e1', { color: 'w', type: 'k' }],
    ]);
    const pos = new Position(board);
    for (const sq of [
      'd2',
      'f2',
      'c3',
      'g3',
      'd6',
      'f6',
      'c5',
      'g5',
    ] as Square[]) {
      expect(pos.isAttacked(sq, 'w')).toBe(true);
    }
    expect(pos.isAttacked('e4', 'w')).toBe(false); // same square
  });

  it('bishop attacks all diagonals and not its own square', () => {
    // 4k3/4p3/8/8/4b3/8/8/4K3 — black bishop on e4
    const board = new Map<Square, Piece>([
      ['e8', { color: 'b', type: 'k' }],
      ['e4', { color: 'b', type: 'b' }],
      ['e1', { color: 'w', type: 'k' }],
    ]);
    const pos = new Position(board);
    for (const sq of [
      'b1',
      'c2',
      'd3',
      'f5',
      'g6',
      'h7',
      'a8',
      'b7',
      'c6',
      'd5',
      'f3',
      'g2',
      'h1',
    ] as Square[]) {
      expect(pos.isAttacked(sq, 'b')).toBe(true);
    }
    expect(pos.isAttacked('e4', 'b')).toBe(false); // same square
  });

  it('rook attacks rank and file, can attack own color, not its own square', () => {
    // 4k3/4n3/8/8/8/4R3/8/4K3 — white rook on e3, black knight on e7
    const board = new Map<Square, Piece>([
      ['e8', { color: 'b', type: 'k' }],
      ['e7', { color: 'b', type: 'n' }],
      ['e3', { color: 'w', type: 'r' }],
      ['e1', { color: 'w', type: 'k' }],
    ]);
    const pos = new Position(board);
    for (const sq of [
      'e1',
      'e2',
      'e4',
      'e5',
      'e6',
      'e7',
      'a3',
      'b3',
      'c3',
      'd3',
      'f3',
      'g3',
      'h3',
    ] as Square[]) {
      expect(pos.isAttacked(sq, 'w')).toBe(true);
    }
    expect(pos.isAttacked('e3', 'w')).toBe(false); // same square
    expect(pos.isAttacked('e8', 'w')).toBe(false); // blocked by e7
  });

  it('queen attacks rank, file, and diagonals', () => {
    // 4k3/4n3/8/8/8/4q3/4P3/4K3 — black queen on e3
    const board = new Map<Square, Piece>([
      ['e8', { color: 'b', type: 'k' }],
      ['e7', { color: 'b', type: 'n' }],
      ['e3', { color: 'b', type: 'q' }],
      ['e2', { color: 'w', type: 'p' }],
      ['e1', { color: 'w', type: 'k' }],
    ]);
    const pos = new Position(board);
    for (const sq of [
      'e2',
      'e4',
      'e5',
      'e6',
      'e7',
      'a3',
      'b3',
      'c3',
      'd3',
      'f3',
      'g3',
      'h3',
      'c1',
      'd2',
      'f4',
      'g5',
      'h6',
      'g1',
      'f2',
      'd4',
      'c5',
      'b6',
      'a7',
    ] as Square[]) {
      expect(pos.isAttacked(sq, 'b')).toBe(true);
    }
    expect(pos.isAttacked('e3', 'b')).toBe(false); // same square
    expect(pos.isAttacked('e1', 'b')).toBe(false); // blocked by e2
  });

  it('king attacks all adjacent squares and not its own square', () => {
    // 4k3/4n3/8/8/8/4q3/4P3/4K3 — white king on e1
    const board = new Map<Square, Piece>([
      ['e8', { color: 'b', type: 'k' }],
      ['e1', { color: 'w', type: 'k' }],
      ['e2', { color: 'w', type: 'p' }],
    ]);
    const pos = new Position(board);
    for (const sq of ['e2', 'd1', 'd2', 'f1', 'f2'] as Square[]) {
      expect(pos.isAttacked(sq, 'w')).toBe(true);
    }
    expect(pos.isAttacked('e1', 'w')).toBe(false); // same square
  });

  it('pinned pieces still attack squares', () => {
    // 4k3/4r3/8/8/8/8/4P3/4K3 — white pawn on e2, pinned by black rook on e7
    const board = new Map<Square, Piece>([
      ['e8', { color: 'b', type: 'k' }],
      ['e7', { color: 'b', type: 'r' }],
      ['e2', { color: 'w', type: 'p' }],
      ['e1', { color: 'w', type: 'k' }],
    ]);
    const pos = new Position(board);
    expect(pos.isAttacked('d3', 'w')).toBe(true);
    expect(pos.isAttacked('f3', 'w')).toBe(true);
  });

  it('no x-ray through blocking piece', () => {
    // 4k3/4n3/8/8/8/4q3/4P3/4K3 — black queen on e3 blocked by white pawn e2
    const board = new Map<Square, Piece>([
      ['e8', { color: 'b', type: 'k' }],
      ['e7', { color: 'b', type: 'n' }],
      ['e3', { color: 'b', type: 'q' }],
      ['e2', { color: 'w', type: 'p' }],
      ['e1', { color: 'w', type: 'k' }],
    ]);
    const pos = new Position(board);
    expect(pos.isAttacked('e1', 'b')).toBe(false);
  });

  it('empty squares can be attacked', () => {
    const pos = new Position();
    expect(pos.isAttacked('f3', 'w')).toBe(true);
    expect(pos.isAttacked('f6', 'b')).toBe(true);
  });

  it('can attack own color pieces', () => {
    const pos = new Position();
    expect(pos.isAttacked('e2', 'w')).toBe(true);
  });
});

describe('attackers', () => {
  it('returns squares of pieces attacking the target', () => {
    const board = new Map<Square, Piece>([
      ['e1', { color: 'w', type: 'k' }],
      ['f6', { color: 'b', type: 'n' }],
      ['f5', { color: 'b', type: 'b' }],
    ]);
    const pos = new Position(board);
    const atk = pos.attackers('e4', 'b');
    expect(atk).toContain('f6');
    expect(atk).toContain('f5');
  });

  it('returns empty array when no attackers', () => {
    const board = new Map<Square, Piece>([['e1', { color: 'w', type: 'k' }]]);
    const pos = new Position(board);
    expect(pos.attackers('e4', 'b')).toEqual([]);
  });
});

describe('isInsufficientMaterial', () => {
  it('returns false for starting position', () => {
    expect(new Position().isInsufficientMaterial).toBe(false);
  });

  it('returns true for K vs K', () => {
    const board = new Map<Square, Piece>([
      ['e1', { color: 'w', type: 'k' }],
      ['e8', { color: 'b', type: 'k' }],
    ]);
    expect(new Position(board).isInsufficientMaterial).toBe(true);
  });

  it('returns true for K vs KB', () => {
    const board = new Map<Square, Piece>([
      ['e1', { color: 'w', type: 'k' }],
      ['e8', { color: 'b', type: 'k' }],
      ['c1', { color: 'w', type: 'b' }],
    ]);
    expect(new Position(board).isInsufficientMaterial).toBe(true);
  });

  it('returns true for K vs KN', () => {
    const board = new Map<Square, Piece>([
      ['e1', { color: 'w', type: 'k' }],
      ['e8', { color: 'b', type: 'k' }],
      ['c1', { color: 'b', type: 'n' }],
    ]);
    expect(new Position(board).isInsufficientMaterial).toBe(true);
  });

  it('returns false for K vs KR', () => {
    const board = new Map<Square, Piece>([
      ['e1', { color: 'w', type: 'k' }],
      ['e8', { color: 'b', type: 'k' }],
      ['a1', { color: 'w', type: 'r' }],
    ]);
    expect(new Position(board).isInsufficientMaterial).toBe(false);
  });

  // Ported from chess.js — same-color bishops cases
  it('returns true for KB vs KB with bishops on same color squares', () => {
    // 8/b7/3B4/8/8/8/8/k6K — white bishop on d6 (dark), black bishop on a7 (dark)
    const board = new Map<Square, Piece>([
      ['h1', { color: 'w', type: 'k' }],
      ['a1', { color: 'b', type: 'k' }],
      ['d6', { color: 'w', type: 'b' }],
      ['a7', { color: 'b', type: 'b' }],
    ]);
    expect(new Position(board).isInsufficientMaterial).toBe(true);
  });

  it('returns true for KB vs KB with many same-color bishops', () => {
    // 8/b1B1b1B1/1b1B1b1B/8/8/8/8/1k5K — all bishops on same color
    const board = new Map<Square, Piece>([
      ['h1', { color: 'w', type: 'k' }],
      ['b1', { color: 'b', type: 'k' }],
      ['a7', { color: 'b', type: 'b' }],
      ['c7', { color: 'w', type: 'b' }],
      ['e7', { color: 'b', type: 'b' }],
      ['g7', { color: 'w', type: 'b' }],
      ['b6', { color: 'b', type: 'b' }],
      ['d6', { color: 'w', type: 'b' }],
      ['f6', { color: 'b', type: 'b' }],
      ['h6', { color: 'w', type: 'b' }],
    ]);
    expect(new Position(board).isInsufficientMaterial).toBe(true);
  });

  it('returns false for KB vs KB with bishops on opposite color squares', () => {
    // 5k1K/7B/8/6b1/8/8/8/8 — white bishop on h7 (light), black bishop on g5 (dark)
    const board = new Map<Square, Piece>([
      ['h8', { color: 'w', type: 'k' }],
      ['f8', { color: 'b', type: 'k' }],
      ['h7', { color: 'w', type: 'b' }],
      ['g5', { color: 'b', type: 'b' }],
    ]);
    expect(new Position(board).isInsufficientMaterial).toBe(false);
  });

  it('returns false for KN vs KB', () => {
    const board = new Map<Square, Piece>([
      ['h8', { color: 'w', type: 'k' }],
      ['f8', { color: 'b', type: 'k' }],
      ['h7', { color: 'w', type: 'n' }],
      ['g5', { color: 'b', type: 'b' }],
    ]);
    expect(new Position(board).isInsufficientMaterial).toBe(false);
  });

  it('returns false for KN vs KN', () => {
    const board = new Map<Square, Piece>([
      ['h8', { color: 'w', type: 'k' }],
      ['f8', { color: 'b', type: 'k' }],
      ['h7', { color: 'w', type: 'n' }],
      ['e5', { color: 'b', type: 'n' }],
    ]);
    expect(new Position(board).isInsufficientMaterial).toBe(false);
  });
});

describe('isValid', () => {
  it('returns true for starting position', () => {
    expect(new Position().isValid).toBe(true);
  });

  it('returns false when white king is missing', () => {
    const board = new Map<Square, Piece>([['e8', { color: 'b', type: 'k' }]]);
    expect(new Position(board).isValid).toBe(false);
  });

  it('returns false when black king is missing', () => {
    const board = new Map<Square, Piece>([['e1', { color: 'w', type: 'k' }]]);
    expect(new Position(board).isValid).toBe(false);
  });

  it('returns false when a pawn is on rank 1', () => {
    const board = new Map<Square, Piece>([
      ['e1', { color: 'w', type: 'k' }],
      ['e8', { color: 'b', type: 'k' }],
      ['a1', { color: 'w', type: 'p' }],
    ]);
    expect(new Position(board).isValid).toBe(false);
  });

  it('returns false when a pawn is on rank 8', () => {
    const board = new Map<Square, Piece>([
      ['e1', { color: 'w', type: 'k' }],
      ['e8', { color: 'b', type: 'k' }],
      ['a8', { color: 'b', type: 'p' }],
    ]);
    expect(new Position(board).isValid).toBe(false);
  });

  it('returns false when the side not to move is in check', () => {
    const board = new Map<Square, Piece>([
      ['e1', { color: 'w', type: 'k' }],
      ['e8', { color: 'b', type: 'k' }],
      ['e2', { color: 'w', type: 'r' }],
    ]);
    // It is white's turn, but black king is in check from white rook — invalid
    const pos = new Position(board, { turn: 'w' });
    expect(pos.isValid).toBe(false);
  });
});

describe('isCheck', () => {
  it('returns false for starting position', () => {
    expect(new Position().isCheck).toBe(false);
  });

  it('returns true when king is attacked by a rook on same file', () => {
    const board = new Map<Square, Piece>([
      ['e1', { color: 'w', type: 'k' }],
      ['e8', { color: 'b', type: 'r' }],
    ]);
    const pos = new Position(board, { turn: 'w' });
    expect(pos.isCheck).toBe(true);
  });

  it('returns false when sliding attacker is blocked', () => {
    const board = new Map<Square, Piece>([
      ['e1', { color: 'w', type: 'k' }],
      ['e4', { color: 'w', type: 'p' }],
      ['e8', { color: 'b', type: 'r' }],
    ]);
    const pos = new Position(board, { turn: 'w' });
    expect(pos.isCheck).toBe(false);
  });

  // Ported from chess.js isCheck test suite
  it('returns true when black is giving check via queen', () => {
    // rnb1kbnr/pppp1ppp/8/8/4Pp1q/2N5/PPPP2PP/R1BQKBNR w KQkq - 2 4
    const board = new Map<Square, Piece>([
      ['a8', { color: 'b', type: 'r' }],
      ['b8', { color: 'b', type: 'n' }],
      ['c8', { color: 'b', type: 'b' }],
      ['e8', { color: 'b', type: 'k' }],
      ['f8', { color: 'b', type: 'b' }],
      ['g8', { color: 'b', type: 'n' }],
      ['h8', { color: 'b', type: 'r' }],
      ['a7', { color: 'b', type: 'p' }],
      ['b7', { color: 'b', type: 'p' }],
      ['c7', { color: 'b', type: 'p' }],
      ['d7', { color: 'b', type: 'p' }],
      ['g7', { color: 'b', type: 'p' }],
      ['h7', { color: 'b', type: 'p' }],
      ['h4', { color: 'b', type: 'q' }],
      ['f4', { color: 'b', type: 'p' }],
      ['e4', { color: 'w', type: 'p' }],
      ['c3', { color: 'w', type: 'n' }],
      ['a2', { color: 'w', type: 'p' }],
      ['b2', { color: 'w', type: 'p' }],
      ['c2', { color: 'w', type: 'p' }],
      ['d2', { color: 'w', type: 'p' }],
      ['g2', { color: 'w', type: 'p' }],
      ['h2', { color: 'w', type: 'p' }],
      ['a1', { color: 'w', type: 'r' }],
      ['c1', { color: 'w', type: 'b' }],
      ['d1', { color: 'w', type: 'q' }],
      ['e1', { color: 'w', type: 'k' }],
    ]);
    const pos = new Position(board, { turn: 'w' });
    expect(pos.isCheck).toBe(true);
  });

  it('returns true for checkmate position (checkmate is also check)', () => {
    // R3k3/8/4K3/8/8/8/8/8 b - - 0 1 — black king checkmated by white rook
    const board = new Map<Square, Piece>([
      ['a8', { color: 'w', type: 'r' }],
      ['e8', { color: 'b', type: 'k' }],
      ['e6', { color: 'w', type: 'k' }],
    ]);
    const pos = new Position(board, { turn: 'b' });
    expect(pos.isCheck).toBe(true);
  });

  it('returns false for stalemate position (stalemate is not check)', () => {
    // 4k3/4P3/4K3/8/8/8/8/8 b - - 0 1 — black king stalemated
    const board = new Map<Square, Piece>([
      ['e8', { color: 'b', type: 'k' }],
      ['e7', { color: 'w', type: 'p' }],
      ['e6', { color: 'w', type: 'k' }],
    ]);
    const pos = new Position(board, { turn: 'b' });
    expect(pos.isCheck).toBe(false);
  });
});

describe('hash', () => {
  it('returns a string', () => {
    expect(typeof new Position().hash).toBe('string');
  });

  it('returns the same hash for the same position', () => {
    expect(new Position().hash).toBe(new Position().hash);
  });

  it('returns different hashes for different positions', () => {
    const pos1 = new Position();
    const board = new Map<Square, Piece>([
      ['e1', { color: 'w', type: 'k' }],
      ['e8', { color: 'b', type: 'k' }],
    ]);
    const pos2 = new Position(board);
    expect(pos1.hash).not.toBe(pos2.hash);
  });

  it('returns different hashes for different turns', () => {
    const board = new Map<Square, Piece>([
      ['e1', { color: 'w', type: 'k' }],
      ['e8', { color: 'b', type: 'k' }],
    ]);
    const posW = new Position(board, { turn: 'w' });
    const posB = new Position(board, { turn: 'b' });
    expect(posW.hash).not.toBe(posB.hash);
  });
});
