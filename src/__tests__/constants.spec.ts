import { describe, expect, it } from 'vitest';

import { STARTING_POSITION } from '../constants.js';

describe('STARTING_POSITION', () => {
  it('has 32 pieces', () => {
    expect(STARTING_POSITION.size).toBe(32);
  });

  it('has white king on e1', () => {
    expect(STARTING_POSITION.get('e1')).toEqual({
      color: 'white',
      type: 'king',
    });
  });

  it('has black king on e8', () => {
    expect(STARTING_POSITION.get('e8')).toEqual({
      color: 'black',
      type: 'king',
    });
  });

  it('has white pawns on rank 2', () => {
    for (const file of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const) {
      expect(STARTING_POSITION.get(`${file}2`)).toEqual({
        color: 'white',
        type: 'pawn',
      });
    }
  });

  it('has black pawns on rank 7', () => {
    for (const file of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const) {
      expect(STARTING_POSITION.get(`${file}7`)).toEqual({
        color: 'black',
        type: 'pawn',
      });
    }
  });
});
