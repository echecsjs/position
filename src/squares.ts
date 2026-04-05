import type { File, Rank, Square, SquareColor } from './types.js';

/**
 * Returns the file of a square.
 *
 * @param square - The square to query.
 */
function squareFile(square: Square): File {
  return square[0] as File;
}

/**
 * Returns the rank of a square.
 *
 * @param square - The square to query.
 */
function squareRank(square: Square): Rank {
  return square[1] as Rank;
}

/**
 * Returns the color of a square — `'dark'` or `'light'`.
 *
 * @param square - The square to query.
 */
function squareColor(square: Square): SquareColor {
  const file = (square.codePointAt(0) ?? 0) - ('a'.codePointAt(0) ?? 0);
  const rank = Number.parseInt(square[1] ?? '1', 10);
  return (file + rank) % 2 === 1 ? 'dark' : 'light';
}

export { squareColor, squareFile, squareRank };
