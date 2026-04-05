import { Position } from './position.js';

import type { Piece, Square } from './types.js';

/** An empty board — no pieces. */
const EMPTY_BOARD = new Map<Square, Piece>();

/** The standard chess starting position. */
const STARTING_POSITION = new Position();

export { EMPTY_BOARD, STARTING_POSITION };

export { COLORS, FILES, PIECE_TYPES, RANKS, SQUARES } from './primitives.js';
