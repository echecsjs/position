import type { Color, File, PieceType, Square } from './types.js';

// Seeded LCG for deterministic random numbers (no Math.random — must be stable across runs)
function lcg(seed: number): () => bigint {
  let s = BigInt(seed);
  return () => {
    s =
      (s * 6_364_136_223_846_793_005n + 1_442_695_040_888_963_407n) &
      0xff_ff_ff_ff_ff_ff_ff_ffn;
    return s;
  };
}

const next = lcg(0xde_ad_be_ef);

// Pre-compute all hash values. The order of next() calls must stay fixed —
// changing it would produce different hashes for the same position.

const pieces = new Map<string, bigint>();
for (const sq of 'abcdefgh') {
  for (const rank of '87654321') {
    for (const type of ['bishop', 'king', 'knight', 'pawn', 'queen', 'rook']) {
      for (const color of ['black', 'white']) {
        pieces.set(`${sq}${rank}.${type}.${color}`, next());
      }
    }
  }
}

const turns = new Map<Color, bigint>([
  ['black', next()],
  ['white', next()],
]);

const castling = new Map<string, bigint>([
  ['black.king', next()],
  ['black.queen', next()],
  ['white.king', next()],
  ['white.queen', next()],
]);

const ep = new Map<File, bigint>();
for (const file of 'abcdefgh') {
  ep.set(file as File, next());
}

function pieceHash(square: Square, type: PieceType, color: Color): bigint {
  return pieces.get(`${square}.${type}.${color}`) ?? 0n;
}

function turnHash(color: Color): bigint {
  return turns.get(color) ?? 0n;
}

function castlingHash(color: Color, side: 'king' | 'queen'): bigint {
  return castling.get(`${color}.${side}`) ?? 0n;
}

function epHash(file: File): bigint {
  return ep.get(file) ?? 0n;
}

export { castlingHash, epHash, pieceHash, turnHash };
