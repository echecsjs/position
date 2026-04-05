import type { Color, File, PieceType, Rank, Square } from './types.js';

/** All colors: `['b', 'w']`. */
const COLORS: Color[] = ['b', 'w'];

/** All files: `['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']`. */
const FILES: File[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

/** All ranks: `['1', '2', '3', '4', '5', '6', '7', '8']`. */
const RANKS: Rank[] = ['1', '2', '3', '4', '5', '6', '7', '8'];

/** All piece types: `['b', 'k', 'n', 'p', 'q', 'r']`. */
const PIECE_TYPES: PieceType[] = ['b', 'k', 'n', 'p', 'q', 'r'];

/** All 64 squares, ordered a8–h1 (file-major, rank 8 to rank 1). */
const SQUARES: Square[] = FILES.flatMap((f) =>
  RANKS.toReversed().map((r) => `${f}${r}` as Square),
);

export { COLORS, FILES, PIECE_TYPES, RANKS, SQUARES };
