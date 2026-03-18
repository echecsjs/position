import { describe, expect, it } from 'vitest';

import {
  COLORS,
  EMPTY_BOARD,
  FILES,
  PIECE_TYPES,
  RANKS,
  SQUARES,
  STARTING_POSITION,
} from '../constants.js';

describe('STARTING_POSITION', () => {
  it('has 32 pieces', () => {
    expect(STARTING_POSITION.pieces().size).toBe(32);
  });

  it('has white king on e1', () => {
    expect(STARTING_POSITION.piece('e1')).toEqual({
      color: 'w',
      type: 'k',
    });
  });

  it('has black king on e8', () => {
    expect(STARTING_POSITION.piece('e8')).toEqual({
      color: 'b',
      type: 'k',
    });
  });

  it('has white to move', () => {
    expect(STARTING_POSITION.turn).toBe('w');
  });

  it('has all castling rights', () => {
    expect(STARTING_POSITION.castlingRights).toEqual({
      bK: true,
      bQ: true,
      wK: true,
      wQ: true,
    });
  });

  it('has no en passant square', () => {
    expect(STARTING_POSITION.enPassantSquare).toBeUndefined();
  });

  it('has fullmove number 1', () => {
    expect(STARTING_POSITION.fullmoveNumber).toBe(1);
  });

  it('has halfmove clock 0', () => {
    expect(STARTING_POSITION.halfmoveClock).toBe(0);
  });
});

describe('EMPTY_BOARD', () => {
  it('has no pieces', () => {
    expect(EMPTY_BOARD.size).toBe(0);
  });
});

describe('COLORS', () => {
  it('contains both colors', () => {
    expect(COLORS).toEqual(['b', 'w']);
  });
});

describe('FILES', () => {
  it('contains all 8 files in order', () => {
    expect(FILES).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
  });
});

describe('RANKS', () => {
  it('contains all 8 ranks in order', () => {
    expect(RANKS).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);
  });
});

describe('PIECE_TYPES', () => {
  it('contains all 6 piece types', () => {
    expect(PIECE_TYPES).toEqual(['b', 'k', 'n', 'p', 'q', 'r']);
  });
});

describe('SQUARES', () => {
  it('contains all 64 squares', () => {
    expect(SQUARES).toHaveLength(64);
  });

  it('starts with a8 and ends with h1', () => {
    expect(SQUARES[0]).toBe('a8');
    expect(SQUARES[63]).toBe('h1');
  });
});
