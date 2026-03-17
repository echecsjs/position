import type { CastlingRights, Piece, Position, Square } from './types.js';

export const EMPTY_BOARD = new Map<Square, Piece>();

const BACK_RANK_TYPES = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'] as const;
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

const startingBoard = new Map<Square, Piece>();
for (const [index, type] of BACK_RANK_TYPES.entries()) {
  const file = FILES[index];
  if (file === undefined) {
    continue;
  }
  startingBoard.set(`${file}1` as Square, { color: 'w', type });
  startingBoard.set(`${file}2` as Square, { color: 'w', type: 'p' });
  startingBoard.set(`${file}7` as Square, { color: 'b', type: 'p' });
  startingBoard.set(`${file}8` as Square, { color: 'b', type });
}

const STARTING_CASTLING: CastlingRights = {
  bK: true,
  bQ: true,
  wK: true,
  wQ: true,
};

export const STARTING_POSITION: Position = {
  board: startingBoard,
  castlingRights: STARTING_CASTLING,
  enPassantSquare: undefined,
  fullmoveNumber: 1,
  halfmoveClock: 0,
  turn: 'w',
};
