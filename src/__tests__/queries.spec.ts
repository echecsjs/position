import { describe, expect, it } from 'vitest';

import { STARTING_POSITION } from '../constants.js';
import { isAttacked, isCheck, piece, pieces } from '../queries.js';

import type { Position } from '../types.js';

describe('piece', () => {
  it('returns piece on occupied square', () => {
    expect(piece(STARTING_POSITION, 'e1')).toEqual({ color: 'w', type: 'k' });
  });

  it('returns undefined for empty square', () => {
    expect(piece(STARTING_POSITION, 'e4')).toBeUndefined();
  });
});

describe('pieces', () => {
  it('returns all 32 pieces when no color filter', () => {
    expect(pieces(STARTING_POSITION).size).toBe(32);
  });

  it('returns 16 white pieces', () => {
    expect(pieces(STARTING_POSITION, 'w').size).toBe(16);
  });

  it('returns 16 black pieces', () => {
    expect(pieces(STARTING_POSITION, 'b').size).toBe(16);
  });
});

describe('isCheck', () => {
  it('returns false for starting position', () => {
    expect(isCheck(STARTING_POSITION)).toBe(false);
  });

  it('returns true when king is attacked by a rook on same file', () => {
    const board = new Map([
      ['e1', { color: 'w', type: 'k' }],
      ['e8', { color: 'b', type: 'r' }],
    ] as const);
    const pos: Position = { ...STARTING_POSITION, board, turn: 'w' };
    expect(isCheck(pos)).toBe(true);
  });

  it('returns false when sliding attacker is blocked', () => {
    const board = new Map([
      ['e1', { color: 'w', type: 'k' }],
      ['e4', { color: 'w', type: 'p' }],
      ['e8', { color: 'b', type: 'r' }],
    ] as const);
    const pos: Position = { ...STARTING_POSITION, board, turn: 'w' };
    expect(isCheck(pos)).toBe(false);
  });
});

describe('isAttacked', () => {
  it('returns true when a white pawn attacks the square diagonally', () => {
    const board = new Map([
      ['e1', { color: 'w', type: 'k' }],
      ['d3', { color: 'w', type: 'p' }],
    ] as const);
    const pos: Position = { ...STARTING_POSITION, board };
    expect(isAttacked(pos, 'e4', 'w')).toBe(true);
  });

  it('returns false when no piece attacks the square', () => {
    const board = new Map([['e1', { color: 'w', type: 'k' }]] as const);
    const pos: Position = { ...STARTING_POSITION, board };
    expect(isAttacked(pos, 'e4', 'b')).toBe(false);
  });

  it('returns true when a knight attacks the square', () => {
    const board = new Map([
      ['e1', { color: 'w', type: 'k' }],
      ['f6', { color: 'b', type: 'n' }],
    ] as const);
    const pos: Position = { ...STARTING_POSITION, board };
    // Knight on f6 attacks: e4, g4, d5, d7, e8, g8, h5, h7
    expect(isAttacked(pos, 'e4', 'b')).toBe(true);
    expect(isAttacked(pos, 'g4', 'b')).toBe(true);
    expect(isAttacked(pos, 'a1', 'b')).toBe(false);
  });
});
