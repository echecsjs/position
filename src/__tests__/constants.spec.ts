import { describe, expect, it } from 'vitest';

import { EMPTY_BOARD, STARTING_POSITION } from '../constants.js';

describe('STARTING_POSITION', () => {
  it('has 32 pieces', () => {
    expect(STARTING_POSITION.board.size).toBe(32);
  });

  it('has white king on e1', () => {
    expect(STARTING_POSITION.board.get('e1')).toEqual({
      color: 'w',
      type: 'k',
    });
  });

  it('has black king on e8', () => {
    expect(STARTING_POSITION.board.get('e8')).toEqual({
      color: 'b',
      type: 'k',
    });
  });

  it('has white to move', () => {
    expect(STARTING_POSITION.turn).toBe('w');
  });

  it('has all castling rights', () => {
    expect(STARTING_POSITION.castlingRights).toEqual({
      bK: true,
      bQ: true,
      wK: true,
      wQ: true,
    });
  });

  it('has no en passant square', () => {
    expect(STARTING_POSITION.enPassantSquare).toBeUndefined();
  });

  it('has fullmove number 1', () => {
    expect(STARTING_POSITION.fullmoveNumber).toBe(1);
  });

  it('has halfmove clock 0', () => {
    expect(STARTING_POSITION.halfmoveClock).toBe(0);
  });
});

describe('EMPTY_BOARD', () => {
  it('has no pieces', () => {
    expect(EMPTY_BOARD.size).toBe(0);
  });
});
