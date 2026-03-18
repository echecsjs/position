
import { Position } from './position.js';

import type { Color, File, Piece, PieceType, Rank, Square } from './types.js';

const COLORS_LIST: Color[] = ['b', 'w'];
const FILES_LIST: File[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS_LIST: Rank[] = ['1', '2', '3', '4', '5', '6', '7', '8'];
const PIECE_TYPES_LIST: PieceType[] = ['b', 'k', 'n', 'p', 'q', 'r'];
const SQUARES_LIST: Square[] = FILES_LIST.flatMap((f) =>
  RANKS_LIST.toReversed().map((r) => `${f}${r}` as Square),
);

export const COLORS = COLORS_LIST;
export const FILES = FILES_LIST;
export const RANKS = RANKS_LIST;
export const PIECE_TYPES = PIECE_TYPES_LIST;
export const SQUARES = SQUARES_LIST;
export const EMPTY_BOARD = new Map<Square, Piece>();

export const STARTING_POSITION = new Position();

export {startingBoard} from './starting-board.js';