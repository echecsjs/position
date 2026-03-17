import { describe, expect, it } from 'vitest';

import { squareColor, squareFile, squareRank } from '../squares.js';

describe('squareFile', () => {
  it('returns the file letter', () => {
    expect(squareFile('e4')).toBe('e');
    expect(squareFile('a1')).toBe('a');
    expect(squareFile('h8')).toBe('h');
  });
});

describe('squareRank', () => {
  it('returns the rank digit', () => {
    expect(squareRank('e4')).toBe('4');
    expect(squareRank('a1')).toBe('1');
    expect(squareRank('h8')).toBe('8');
  });
});

describe('squareColor', () => {
  it('returns d for dark squares', () => {
    expect(squareColor('a1')).toBe('d');
    expect(squareColor('c1')).toBe('d');
    expect(squareColor('b2')).toBe('d');
  });

  it('returns l for light squares', () => {
    expect(squareColor('a2')).toBe('l');
    expect(squareColor('b1')).toBe('l');
    expect(squareColor('h1')).toBe('l');
  });
});
