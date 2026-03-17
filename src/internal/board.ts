import type { Piece, Square } from '../types.js';

export const OFF_BOARD = 0x88;

export function squareToIndex(square: Square): number {
  const file = (square.codePointAt(0) ?? 0) - ('a'.codePointAt(0) ?? 0);
  const rank = Number.parseInt(square[1] ?? '1', 10);
  return (8 - rank) * 16 + file;
}

export function indexToSquare(index: number): Square {
  const rank = 8 - Math.floor(index / 16);
  const file = index % 16;
  return `${String.fromCodePoint(('a'.codePointAt(0) ?? 0) + file)}${rank}` as Square;
}

/**
 * Converts a Map<Square, Piece> to the internal 0x88 array representation.
 * The bridge between the public Position type and the 0x88 internal layout.
 */
export function boardFromMap(map: Map<Square, Piece>): (Piece | undefined)[] {
  const board: (Piece | undefined)[] = Array.from({ length: 128 });
  for (const [square, p] of map) {
    board[squareToIndex(square)] = p;
  }
  return board;
}
