import {
  ATTACKS,
  DIFF_OFFSET,
  OFF_BOARD,
  PIECE_MASKS,
  RAYS,
  boardFromMap,
  squareToIndex,
} from './internal/index.js';

import type { Color, Piece, Position, Square } from './types.js';

function piece(position: Position, square: Square): Piece | undefined {
  return position.board.get(square);
}

function pieces(position: Position, color?: Color): Map<Square, Piece> {
  if (color === undefined) {
    return new Map(position.board);
  }

  const result = new Map<Square, Piece>();
  for (const [square, p] of position.board) {
    if (p.color === color) {
      result.set(square, p);
    }
  }

  return result;
}

function isAttacked(position: Position, square: Square, by: Color): boolean {
  const board = boardFromMap(position.board);
  const targetIndex = squareToIndex(square);

  for (const [sq, p] of position.board) {
    if (p.color !== by) {
      continue;
    }

    const fromIndex = squareToIndex(sq);
    const diff = targetIndex - fromIndex;
    const tableIndex = diff + DIFF_OFFSET;

    if (tableIndex < 0 || tableIndex >= 240) {
      continue;
    }

    const attackMask = ATTACKS[tableIndex] ?? 0;
    const pieceMask = PIECE_MASKS[p.type] ?? 0;

    if ((attackMask & pieceMask) === 0) {
      continue;
    }

    // Pawn attacks are directional — verify the direction matches the color
    if (p.type === 'p') {
      // White pawns attack upward (negative diff = toward rank 8)
      // Black pawns attack downward (positive diff = toward rank 1)
      if (by === 'w' && diff > 0) {
        continue;
      }
      if (by === 'b' && diff < 0) {
        continue;
      }
    }

    const ray = RAYS[tableIndex] ?? 0;

    // Non-sliding piece — attack confirmed directly
    if (ray === 0) {
      return true;
    }

    // Sliding piece — walk the ray checking for blockers
    let index = fromIndex + ray;
    let blocked = false;
    while (index !== targetIndex) {
      if ((index & OFF_BOARD) !== 0) {
        blocked = true;
        break;
      }

      if (board[index] !== undefined) {
        blocked = true;
        break;
      }

      index += ray;
    }

    if (!blocked) {
      return true;
    }
  }

  return false;
}

function isCheck(position: Position): boolean {
  for (const [square, p] of position.board) {
    if (p.type === 'k' && p.color === position.turn) {
      const opponent: Color = position.turn === 'w' ? 'b' : 'w';
      return isAttacked(position, square, opponent);
    }
  }

  return false;
}

export { isAttacked, isCheck, piece, pieces };
