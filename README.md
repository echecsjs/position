# Position

[![npm](https://img.shields.io/npm/v/@echecs/position)](https://www.npmjs.com/package/@echecs/position)
[![Coverage](https://codecov.io/gh/echecsjs/position/branch/main/graph/badge.svg)](https://codecov.io/gh/echecsjs/position)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![API Docs](https://img.shields.io/badge/API-docs-blue.svg)](https://position.echecs.dev/)

**Position** models a complete chess position as an immutable TypeScript object.
It holds the board, turn, castling rights (which sides can still castle), en
passant square (the target square behind a pawn that just advanced two ranks),
halfmove clock (half-moves since the last pawn advance or capture), and fullmove
number. Other `@echecs` packages build on it.

## Installation

```bash
npm install @echecs/position
```

## Quick Start

```typescript
import { Position, STARTING_POSITION } from '@echecs/position';

// Starting position
const pos = new Position({ board: STARTING_POSITION });

console.log(pos.turn); // 'white'
console.log(pos.fullmoveNumber); // 1
console.log(pos.isCheck); // false

// Query the board
const piece = pos.at('e1'); // { color: 'white', type: 'king' }
const whites = pos.pieces('white'); // Map<Square, Piece> of all white pieces

// Board queries
const knightMoves = pos.reach('g1', { color: 'white', type: 'knight' }); // ['f3', 'h3']

// Derive a new position
const next = pos.derive({
  changes: [
    ['e2', undefined],
    ['e4', { color: 'white', type: 'pawn' }],
  ],
  turn: 'black',
  enPassantSquare: 'e3',
});
```

## API

Full API reference is available at https://position.echecs.dev/

### Constructor

```ts
new Position()
new Position(data: PositionData)
```

The no-argument form creates an empty position with default options. Pass
`{ board: STARTING_POSITION }` to place all 32 pieces in their opening squares.
Pass any `PositionData` object to construct an arbitrary position.

```typescript
// From a FEN string (with @echecs/fen)
const pos = new Position(parse(fen));
```

### Properties

| Property          | Type                           | Description                                                     |
| ----------------- | ------------------------------ | --------------------------------------------------------------- |
| `castlingRights`  | `CastlingRights`               | Which castling moves remain available                           |
| `enPassantSquare` | `EnPassantSquare \| undefined` | En passant target square (rank 3 or 6), if any                  |
| `fullmoveNumber`  | `number`                       | Game turn counter — increments after each black move            |
| `halfmoveClock`   | `number`                       | Half-moves since last pawn advance or capture (fifty-move rule) |
| `turn`            | `Color`                        | Side to move (`'white'` or `'black'`)                           |

### Getters

| Getter                   | Type      | Description                                                           |
| ------------------------ | --------- | --------------------------------------------------------------------- |
| `hash`                   | `string`  | Zobrist hash (a fixed-size integer fingerprint) for position identity |
| `isCheck`                | `boolean` | Whether the side to move is in check                                  |
| `isInsufficientMaterial` | `boolean` | Whether the position is a FIDE draw by insufficient material          |
| `isValid`                | `boolean` | Whether the position is legally reachable                             |

### Methods

#### `derive(changes?): Position`

Returns a new `Position` with the given changes applied. The original stays
unchanged. Fields not provided copy forward from the source.

```typescript
// move e2 pawn to e4
const next = pos.derive({
  changes: [
    ['e2', undefined],
    ['e4', { color: 'white', type: 'pawn' }],
  ],
  turn: 'black',
  enPassantSquare: 'e3',
});

// clone
const clone = pos.derive();
```

#### `reach(square, piece): Square[]`

Returns all squares the given `piece` can reach from `square` on the current
board. Filters out same-color pieces.

For sliding pieces (bishops, rooks, queens — pieces that move any number of
squares in a line), stops before friendlies and includes enemy pieces as capture
targets. For pawns, includes single and double pushes from the starting rank
(blocked by any piece), diagonal captures of enemy pieces, and en passant
captures.

```typescript
pos.reach('g1', { color: 'white', type: 'knight' }); // ['f3', 'h3']
pos.reach('e4', { color: 'white', type: 'rook' }); // all rank/file squares until blocked
pos.reach('e2', { color: 'white', type: 'pawn' }); // ['e3', 'e4'] (pushes on empty board)
```

#### `at(square): Piece | undefined`

Returns the piece on `square`, or `undefined` if the square is empty.

```typescript
pos.at('e1'); // { color: 'white', type: 'king' }
pos.at('e5'); // undefined (empty in starting position)
```

#### `pieces(color?): Map<Square, Piece>`

Returns a map of all pieces, optionally filtered by `color`.

```typescript
pos.pieces(); // all 32 pieces in starting position
pos.pieces('white'); // 16 white pieces
```

### Constants

```typescript
import { STARTING_POSITION } from '@echecs/position';
```

`STARTING_POSITION` is a `Map<Square, Piece>` with all 32 pieces on their
opening squares. Pass it to the `Position` constructor:

```typescript
const pos = new Position({ board: STARTING_POSITION });
```

### Types

All types export for use in consuming code and companion packages.

```typescript
import type {
  CastlingRights, // { black: SideCastlingRights; white: SideCastlingRights }
  Color, // 'black' | 'white'
  DeriveOptions, // options accepted by Position.derive()
  EnPassantSquare, // en passant target square (rank 3 or 6 only)
  File, // 'a' | 'b' | ... | 'h'
  Move, // { from: Square; promotion?: PromotionPieceType; to: Square }
  Piece, // { color: Color; type: PieceType }
  PieceType, // 'bishop' | 'king' | 'knight' | 'pawn' | 'queen' | 'rook'
  PositionData, // data accepted by the Position constructor
  PromotionPieceType, // 'bishop' | 'knight' | 'queen' | 'rook'
  Rank, // '1' | '2' | ... | '8'
  SideCastlingRights, // { king: boolean; queen: boolean }
  Square, // 'a1' | 'a2' | ... | 'h8'
} from '@echecs/position';
```
