import { describe, expect, it } from 'vitest';

import {
  BISHOP_MOVES,
  KING_MOVES,
  KNIGHT_MOVES,
  PAWN_MOVES,
  ROOK_MOVES,
} from '../moves.js';
import { Position } from '../position.js';
import { startingBoard } from '../starting-board.js';

import type { Piece, Square } from '../types.js';

// Minimal board: just two kings
const minBoard = new Map<Square, Piece>([
  ['e1', { color: 'white', type: 'king' }],
  ['e8', { color: 'black', type: 'king' }],
]);

describe('reach', () => {
  describe('single hop (no slide)', () => {
    it('knight from e4 returns one square per offset', () => {
      const pos = new Position(minBoard);
      const squares = pos.reach('e4', KNIGHT_MOVES[0]!);
      // offset -33: e4 is index 68, 68-33=35 → d6
      expect(squares).toEqual(['d6']);
    });

    it('returns empty array when off-board', () => {
      const pos = new Position(minBoard);
      // knight on a1 with offset -33 goes off-board
      const squares = pos.reach('a1', KNIGHT_MOVES[0]!);
      expect(squares).toEqual([]);
    });

    it('king from e4 returns adjacent square', () => {
      const pos = new Position(minBoard);
      // offset -16: one rank up → e5
      const squares = pos.reach('e4', KING_MOVES[1]!);
      expect(squares).toEqual(['e5']);
    });

    it('returns occupied square (does not filter by occupancy)', () => {
      // Use starting position where e2 has a pawn
      const start = new Position(startingBoard);
      const squares = start.reach('e1', KING_MOVES[1]!);
      // offset -16: e1 (index 112) - 16 = 96 → e2 (has white pawn)
      expect(squares).toEqual(['e2']);
    });
  });

  describe('slide', () => {
    it('rook from e4 slides along file until board edge', () => {
      const pos = new Position(minBoard);
      // offset -16 (slide): e4 → e5, e6, e7, e8 (occupied by king — included)
      const squares = pos.reach('e4', ROOK_MOVES[0]!);
      expect(squares).toEqual(['e5', 'e6', 'e7', 'e8']);
    });

    it('bishop from c1 slides diagonally', () => {
      const pos = new Position(minBoard);
      // offset -15 (slide) from c1: d2, e3, f4, g5, h6
      const squares = pos.reach('c1', BISHOP_MOVES[1]!);
      expect(squares).toEqual(['d2', 'e3', 'f4', 'g5', 'h6']);
    });

    it('stops at first occupied square (includes it)', () => {
      const board = new Map<Square, Piece>([
        ['e1', { color: 'white', type: 'king' }],
        ['e8', { color: 'black', type: 'king' }],
        ['e5', { color: 'black', type: 'pawn' }],
      ]);
      const pos = new Position(board);
      // rook slide from e1 up: e2, e3, e4, e5 (occupied — included, then stop)
      const squares = pos.reach('e1', ROOK_MOVES[0]!);
      expect(squares).toEqual(['e2', 'e3', 'e4', 'e5']);
    });

    it('returns empty array when first square is off-board', () => {
      const pos = new Position(minBoard);
      // rook on a4, offset -1 (slide left): a4 index=64, 64-1=63 → off-board
      const squares = pos.reach('a4', ROOK_MOVES[1]!);
      expect(squares).toEqual([]);
    });
  });

  describe('pawn moves', () => {
    it('white pawn push from e2', () => {
      const pos = new Position(minBoard);
      const squares = pos.reach('e2', PAWN_MOVES.white.push);
      expect(squares).toEqual(['e3']);
    });

    it('white pawn capture from d4', () => {
      const pos = new Position(minBoard);
      const squares = pos.reach('d4', PAWN_MOVES.white.captures[0]!);
      // offset -17 from d4: c5
      expect(squares).toEqual(['c5']);
    });

    it('black pawn push from e7', () => {
      const pos = new Position(minBoard);
      const squares = pos.reach('e7', PAWN_MOVES.black.push);
      expect(squares).toEqual(['e6']);
    });
  });

  describe('edge cases', () => {
    it('works from corner square a1', () => {
      const pos = new Position(minBoard);
      // king move offset 1 from a1 → b1
      const squares = pos.reach('a1', KING_MOVES[4]!);
      expect(squares).toEqual(['b1']);
    });

    it('works from corner square h8', () => {
      const pos = new Position(minBoard);
      // king move offset -1 from h8 → g8
      const squares = pos.reach('h8', KING_MOVES[3]!);
      expect(squares).toEqual(['g8']);
    });

    it('slide from edge stops at edge', () => {
      const pos = new Position(minBoard);
      // rook slide right from e1: f1, g1, h1
      const squares = pos.reach('e1', ROOK_MOVES[2]!);
      expect(squares).toEqual(['f1', 'g1', 'h1']);
    });
  });
});
