import type { Piece, Square } from './types.js';

const BACK_RANK_TYPES = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'] as const;
const BACK_RANK_FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

const startingBoardMap = new Map<Square, Piece>();
for (const [index, type] of BACK_RANK_TYPES.entries()) {
  const file = BACK_RANK_FILES[index];
  if (file === undefined) {
    continue;
  }
  startingBoardMap.set(`${file}1` as Square, { color: 'w', type });
  startingBoardMap.set(`${file}2` as Square, { color: 'w', type: 'p' });
  startingBoardMap.set(`${file}7` as Square, { color: 'b', type: 'p' });
  startingBoardMap.set(`${file}8` as Square, { color: 'b', type });
}

export const startingBoard = startingBoardMap;
