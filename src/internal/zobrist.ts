import { COLORS, FILES, PIECE_TYPES, SQUARES } from '../primitives.js';

import type { Color, File, PieceType, Square } from '../types.js';

// Seeded LCG for deterministic random numbers (no Math.random — must be stable across runs)
function lcg(seed: number): () => bigint {
  let s = BigInt(seed);
  return () => {
    s =
      (s * 6_364_136_223_846_793_005n + 1_442_695_040_888_963_407n) &
      0xFF_FF_FF_FF_FF_FF_FF_FFn;
    return s;
  };
}

const next = lcg(0xDE_AD_BE_EF);

// Piece table: PIECE_TABLE[square][pieceType][color]
const PIECE_TABLE: Record<
  Square,
  Partial<Record<PieceType, Record<Color, bigint>>>
> = Object.fromEntries(
  SQUARES.map((sq) => [
    sq,
    Object.fromEntries(
      PIECE_TYPES.map((pt) => [
        pt,
        Object.fromEntries(COLORS.map((c) => [c, next()])),
      ]),
    ),
  ]),
) as Record<Square, Partial<Record<PieceType, Record<Color, bigint>>>>;

const TURN_TABLE: Record<Color, bigint> = {
  b: next(),
  w: next(),
};

const CASTLING_TABLE: Record<string, bigint> = {
  bK: next(),
  bQ: next(),
  wK: next(),
  wQ: next(),
};

const EP_TABLE: Record<File, bigint> = Object.fromEntries(
  FILES.map((f) => [f, next()]),
) as Record<File, bigint>;

export { CASTLING_TABLE, EP_TABLE, PIECE_TABLE, TURN_TABLE };
