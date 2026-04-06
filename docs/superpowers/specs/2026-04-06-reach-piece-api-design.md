# Piece-based `reach` API

## Summary

Change `reach` to accept a `Piece` instead of a `PieceMove`. Move constants and
`PieceMove` type become internal — consumers never import offsets or movement
descriptors. `isCheck` reimplemented to reuse `reach` with the same-color trick
for attack detection.

## Motivation

The current API leaks implementation details. Consumers import `KNIGHT_MOVES`,
`ROOK_MOVES`, etc. and loop over offsets — they have to know how each piece
moves at the 0x88 level. But they already know what piece they're asking about.
The position should handle the movement knowledge internally.

## `reach` — new signature

```typescript
Position.prototype.reach(square: Square, piece: Piece): Square[]
```

From `square`, return all squares the given `piece` can reach on the current
board.

- Looks up the move directions for the piece type internally.
- For single-hop pieces (knight, king): returns each target square that is on
  the board and not occupied by a same-color piece.
- For sliding pieces (bishop, rook, queen): walks each direction, stops before
  same-color pieces, includes enemy pieces (capture targets).
- For pawns: uses the capture directions based on the piece's color. Does not
  include push directions — pushes are game logic (single vs double, empty
  square requirement).
- Returns a flat `Square[]` across all directions.

### Pawn specifics

`reach` only returns pawn **capture** squares, not push squares. Pushes depend
on game rules (single/double push, must land on empty square, promotion rank).
Captures are board geometry — the pawn attacks diagonally regardless of what's
there. Consumers filter based on occupancy.

This matches how `isCheck` uses `reach` — it looks for enemy pawns on capture
diagonals, not push squares.

## `isCheck` — reimplemented with the color trick

From the king square, call `reach` with `{ color: kingColor, type: X }` for each
piece type. Because `reach` filters same-color pieces, it skips the king's own
pieces. If any returned square contains an enemy piece matching type X, the king
is in check.

Example for a white king on e1:

```typescript
reach('e1', { color: 'white', type: 'rook' });
// returns squares a "white rook" on e1 could reach
// skips white pieces, stops at or includes enemy pieces
// if any of those squares has a black rook or black queen → check
```

Queen attacks are covered by both rook and bishop direction checks.

Pawn direction works naturally: `reach('e1', { color: 'white', type: 'pawn' })`
looks in white pawn capture directions (upward). A black pawn attacking the
white king sits on one of those squares.

`#isAttackedBy` is removed. `isCheck` and `isValid` call `reach` directly.

## Removed from public API

- `KNIGHT_MOVES`, `BISHOP_MOVES`, `ROOK_MOVES`, `QUEEN_MOVES`, `KING_MOVES`,
  `PAWN_MOVES` — no longer exported.
- `PieceMove` type — no longer exported.

These stay in `src/moves.ts` as internal constants used by `reach`.

## Kept

- `isCheck`, `isValid`, `isInsufficientMaterial`, `hash` — computed getters,
  behavior unchanged.
- `piece()`, `pieces()`, `derive()` — unchanged.
- `STARTING_POSITION` — unchanged.
- All type exports except `PieceMove`.
- Public readonly fields: `castlingRights`, `enPassantSquare`, `fullmoveNumber`,
  `halfmoveClock`, `turn`.

## Public export surface

```typescript
// Types
(CastlingRights,
  Color,
  DeriveOptions,
  EnPassantSquare,
  File,
  Piece,
  PieceType,
  PositionOptions,
  Rank,
  SideCastlingRights,
  Square,
  SquareColor);

// Constants
STARTING_POSITION;

// Class
Position;
```

## How `@echecs/game` uses this

### Move generation

```typescript
const position = new Position(STARTING_POSITION);

// knight moves from g1
const squares = position.reach('g1', { color: 'white', type: 'knight' });
// ['f3', 'h3'] — friendlies already filtered

// rook moves from a1
const squares = position.reach('a1', { color: 'white', type: 'rook' });
// [] in starting position — blocked by own pieces

// pawn captures from e4
const squares = position.reach('e4', { color: 'white', type: 'pawn' });
// ['d5', 'f5'] — capture diagonals (game checks if enemy is there)
```

### Legality filtering

```typescript
const next = position.derive({
  changes: [
    ['g1', undefined],
    ['f3', { color: 'white', type: 'knight' }],
  ],
  turn: 'black',
});

if (!next.isCheck) {
  // legal — white king is not in check
}
```

## Tests

- Update `reach` tests: replace `PieceMove` arguments with `Piece` arguments.
- Remove `moves.spec.ts` tests for move constants (or keep as internal tests).
- `isCheck` and `isValid` tests stay unchanged — same behavior.
- Add tests for pawn reach (capture directions only, both colors).
- Add tests for friendly-piece filtering in `reach`.

## Breaking changes

This is part of the v3.0.0 release (not yet published).

- `reach` signature changes from `(Square, PieceMove)` to `(Square, Piece)`.
- Move constants and `PieceMove` type removed from exports.
