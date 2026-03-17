import type { File, Rank, Square, SquareColor } from './types.js';

function squareFile(square: Square): File {
  return square[0] as File;
}

function squareRank(square: Square): Rank {
  return square[1] as Rank;
}

/**
 * Returns 'd' for dark squares and 'l' for light squares.
 * a1 is dark: file index 0 + rank 1 = 1 (odd) → 'd'.
 * b1 is light: file index 1 + rank 1 = 2 (even) → 'l'.
 */
function squareColor(square: Square): SquareColor {
  const file = (square.codePointAt(0) ?? 0) - ('a'.codePointAt(0) ?? 0);
  const rank = Number.parseInt(square[1] ?? '1', 10);
  return (file + rank) % 2 === 1 ? 'd' : 'l';
}

export { squareColor, squareFile, squareRank };
