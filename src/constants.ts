import { Position } from './position.js';

import type { Color, File, Piece, PieceType, Rank, Square } from './types.js';

const COLORS: Color[] = ['b', 'w'];
const FILES: File[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS: Rank[] = ['1', '2', '3', '4', '5', '6', '7', '8'];
const PIECE_TYPES: PieceType[] = ['b', 'k', 'n', 'p', 'q', 'r'];
const SQUARES: Square[] = FILES.flatMap((f) =>
  RANKS.toReversed().map((r) => `${f}${r}` as Square),
);
const EMPTY_BOARD = new Map<Square, Piece>();

const STARTING_POSITION = new Position();

export {
  COLORS,
  EMPTY_BOARD,
  FILES,
  PIECE_TYPES,
  RANKS,
  SQUARES,
  STARTING_POSITION,
};
