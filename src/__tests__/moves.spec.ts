import { describe, expect, it } from 'vitest';

import {
  BISHOP_MOVES,
  KING_MOVES,
  KNIGHT_MOVES,
  ROOK_MOVES,
} from '../moves.js';

describe('KNIGHT_MOVES', () => {
  it('has 8 moves', () => {
    expect(KNIGHT_MOVES).toHaveLength(8);
  });

  it('none are sliding', () => {
    expect(KNIGHT_MOVES.every((m) => !m.slide)).toBe(true);
  });

  it('contains the L-shaped offsets', () => {
    const offsets = KNIGHT_MOVES.map((m) => m.offset).toSorted((a, b) => a - b);
    expect(offsets).toEqual([-33, -31, -18, -14, 14, 18, 31, 33]);
  });
});

describe('BISHOP_MOVES', () => {
  it('has 4 moves', () => {
    expect(BISHOP_MOVES).toHaveLength(4);
  });

  it('all are sliding', () => {
    expect(BISHOP_MOVES.every((m) => m.slide)).toBe(true);
  });

  it('contains the diagonal offsets', () => {
    const offsets = BISHOP_MOVES.map((m) => m.offset).toSorted((a, b) => a - b);
    expect(offsets).toEqual([-17, -15, 15, 17]);
  });
});

describe('ROOK_MOVES', () => {
  it('has 4 moves', () => {
    expect(ROOK_MOVES).toHaveLength(4);
  });

  it('all are sliding', () => {
    expect(ROOK_MOVES.every((m) => m.slide)).toBe(true);
  });

  it('contains the rank/file offsets', () => {
    const offsets = ROOK_MOVES.map((m) => m.offset).toSorted((a, b) => a - b);
    expect(offsets).toEqual([-16, -1, 1, 16]);
  });
});

describe('KING_MOVES', () => {
  it('has 8 moves', () => {
    expect(KING_MOVES).toHaveLength(8);
  });

  it('none are sliding', () => {
    expect(KING_MOVES.every((m) => !m.slide)).toBe(true);
  });

  it('contains all adjacent offsets', () => {
    const offsets = KING_MOVES.map((m) => m.offset).toSorted((a, b) => a - b);
    expect(offsets).toEqual([-17, -16, -15, -1, 1, 15, 16, 17]);
  });
});
