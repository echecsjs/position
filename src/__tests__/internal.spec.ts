import { describe, expect, it } from 'vitest';

import { indexToSquare, squareToIndex } from '../internal/index.js';

import type { Square } from '../types.js';

describe('squareToIndex', () => {
  it('e4 → 68', () => {
    expect(squareToIndex('e4')).toBe(68);
  });
  it('a1 → 112', () => {
    expect(squareToIndex('a1')).toBe(112);
  });
  it('h8 → 7', () => {
    expect(squareToIndex('h8')).toBe(7);
  });
});

describe('indexToSquare', () => {
  it('68 → e4', () => {
    expect(indexToSquare(68)).toBe('e4');
  });
  it('round-trips all valid squares', () => {
    for (const file of ['a','b','c','d','e','f','g','h']) {
      for (const rank of ['1','2','3','4','5','6','7','8']) {
        const sq = `${file}${rank}` as Square;
        expect(indexToSquare(squareToIndex(sq))).toBe(sq);
      }
    }
  });
});
