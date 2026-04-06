# Piece-based `reach` API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change `reach` to accept a `Piece` instead of `PieceMove`, remove move
constants and `PieceMove` from the public API, rewrite `isCheck`/`isValid` to
reuse `reach` with the same-color trick.

**Architecture:** `reach(square, piece)` looks up the move directions for the
piece type internally, walks all directions on the 0x88 board, filters
same-color pieces. `isCheck` calls `reach` from the king square with each piece
type using the king's own color — if it finds a matching enemy piece, it's
check. Move constants stay internal in `src/moves.ts`.

**Tech Stack:** TypeScript, Vitest, ESM-only

---

## File Structure

| File                          | Responsibility                                                                 | Action                                             |
| ----------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------- |
| `src/position.ts`             | Position class — rewrite `reach`, `isCheck`, `isValid`, remove `#isAttackedBy` | Modify                                             |
| `src/index.ts`                | Remove move constant and `PieceMove` exports                                   | Modify                                             |
| `src/types.ts`                | Keep `PieceMove` (internal use), remove from public export                     | No change (type stays, only barrel export changes) |
| `src/__tests__/reach.spec.ts` | Rewrite tests for new `reach(square, piece)` signature                         | Modify                                             |
| `src/__tests__/moves.spec.ts` | Keep as internal tests (move constants still exist)                            | No change                                          |
| `README.md`                   | Update API docs — remove move constants section, update reach docs             | Modify                                             |
| `CHANGELOG.md`                | Update v3.0.0 entries                                                          | Modify                                             |

---

### Task 1: Rewrite `reach` to accept `Piece`

**Files:**

- Modify: `src/position.ts`
- Modify: `src/__tests__/reach.spec.ts`

- [ ] **Step 1: Write new reach tests**

Replace the entire contents of `src/__tests__/reach.spec.ts`:

```typescript
import { describe, expect, it } from 'vitest';

import { Position } from '../position.js';
import { startingBoard } from '../starting-board.js';

import type { Piece, Square } from '../types.js';

const minBoard = new Map<Square, Piece>([
  ['e1', { color: 'white', type: 'king' }],
  ['e8', { color: 'black', type: 'king' }],
]);

describe('reach', () => {
  describe('knight', () => {
    it('returns all 8 squares from center of empty board', () => {
      const pos = new Position(minBoard);
      const squares = pos.reach('e4', { color: 'white', type: 'knight' });
      expect(squares.toSorted()).toEqual(
        ['c3', 'c5', 'd2', 'd6', 'f2', 'f6', 'g3', 'g5'].toSorted(),
      );
    });

    it('returns fewer squares from corner', () => {
      const pos = new Position(minBoard);
      const squares = pos.reach('a1', { color: 'white', type: 'knight' });
      expect(squares.toSorted()).toEqual(['b3', 'c2'].toSorted());
    });

    it('filters out same-color pieces', () => {
      const pos = new Position(startingBoard);
      const squares = pos.reach('g1', { color: 'white', type: 'knight' });
      expect(squares.toSorted()).toEqual(['f3', 'h3'].toSorted());
    });

    it('includes enemy pieces', () => {
      const board = new Map<Square, Piece>([
        ['e1', { color: 'white', type: 'king' }],
        ['e8', { color: 'black', type: 'king' }],
        ['f6', { color: 'black', type: 'pawn' }],
      ]);
      const pos = new Position(board);
      const squares = pos.reach('e4', { color: 'white', type: 'knight' });
      expect(squares).toContain('f6');
    });
  });

  describe('bishop', () => {
    it('slides along diagonals on empty board', () => {
      const pos = new Position(minBoard);
      const squares = pos.reach('c1', { color: 'white', type: 'bishop' });
      expect(squares).toContain('d2');
      expect(squares).toContain('h6');
      expect(squares).toContain('b2');
      expect(squares).toContain('a3');
    });

    it('stops before same-color piece', () => {
      const pos = new Position(startingBoard);
      const squares = pos.reach('c1', { color: 'white', type: 'bishop' });
      expect(squares).toEqual([]);
    });

    it('includes enemy piece and stops', () => {
      const board = new Map<Square, Piece>([
        ['e1', { color: 'white', type: 'king' }],
        ['e8', { color: 'black', type: 'king' }],
        ['e3', { color: 'black', type: 'pawn' }],
      ]);
      const pos = new Position(board);
      const squares = pos.reach('c1', { color: 'white', type: 'bishop' });
      expect(squares).toContain('d2');
      expect(squares).toContain('e3');
      expect(squares).not.toContain('f4');
    });
  });

  describe('rook', () => {
    it('slides along rank and file', () => {
      const pos = new Position(minBoard);
      const squares = pos.reach('e4', { color: 'white', type: 'rook' });
      expect(squares).toContain('e5');
      expect(squares).toContain('e8');
      expect(squares).toContain('a4');
      expect(squares).toContain('h4');
      expect(squares).toContain('e2');
    });

    it('stops before friendly king', () => {
      const pos = new Position(minBoard);
      const squares = pos.reach('e4', { color: 'white', type: 'rook' });
      expect(squares).not.toContain('e1');
      expect(squares).toContain('e2');
    });
  });

  describe('queen', () => {
    it('slides along all 8 directions', () => {
      const pos = new Position(minBoard);
      const squares = pos.reach('d4', { color: 'white', type: 'queen' });
      expect(squares).toContain('d5');
      expect(squares).toContain('e5');
      expect(squares).toContain('e4');
      expect(squares).toContain('e3');
      expect(squares).toContain('d3');
      expect(squares).toContain('c3');
      expect(squares).toContain('c4');
      expect(squares).toContain('c5');
    });
  });

  describe('king', () => {
    it('returns all adjacent squares on empty board', () => {
      const pos = new Position(minBoard);
      const squares = pos.reach('d4', { color: 'white', type: 'king' });
      expect(squares.toSorted()).toEqual(
        ['c3', 'c4', 'c5', 'd3', 'd5', 'e3', 'e4', 'e5'].toSorted(),
      );
    });

    it('filters out same-color pieces', () => {
      const pos = new Position(startingBoard);
      const squares = pos.reach('e1', { color: 'white', type: 'king' });
      expect(squares).toEqual([]);
    });
  });

  describe('pawn', () => {
    it('white pawn returns capture diagonals', () => {
      const pos = new Position(minBoard);
      const squares = pos.reach('e4', { color: 'white', type: 'pawn' });
      expect(squares.toSorted()).toEqual(['d5', 'f5'].toSorted());
    });

    it('black pawn returns capture diagonals in opposite direction', () => {
      const pos = new Position(minBoard);
      const squares = pos.reach('e5', { color: 'black', type: 'pawn' });
      expect(squares.toSorted()).toEqual(['d4', 'f4'].toSorted());
    });

    it('filters out same-color pieces on capture squares', () => {
      const board = new Map<Square, Piece>([
        ['e1', { color: 'white', type: 'king' }],
        ['e8', { color: 'black', type: 'king' }],
        ['d5', { color: 'white', type: 'pawn' }],
      ]);
      const pos = new Position(board);
      const squares = pos.reach('e4', { color: 'white', type: 'pawn' });
      expect(squares).toEqual(['f5']);
    });

    it('pawn on edge has only one capture diagonal', () => {
      const pos = new Position(minBoard);
      const squares = pos.reach('a4', { color: 'white', type: 'pawn' });
      expect(squares).toEqual(['b5']);
    });
  });

  describe('empty square', () => {
    it('works from any square regardless of occupancy', () => {
      const pos = new Position(minBoard);
      const squares = pos.reach('d4', { color: 'white', type: 'knight' });
      expect(squares.length).toBeGreaterThan(0);
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test -- src/__tests__/reach.spec.ts` Expected: FAIL — `reach` still
expects `PieceMove` as second argument.

- [ ] **Step 3: Implement new `reach` method**

In `src/position.ts`, add an import for `QUEEN_MOVES` from `./moves.js`:

```typescript
import {
  BISHOP_MOVES,
  KING_MOVES,
  KNIGHT_MOVES,
  PAWN_MOVES,
  QUEEN_MOVES,
  ROOK_MOVES,
} from './moves.js';
```

Replace the `reach` method with:

```typescript
  reach(square: Square, piece: Piece): Square[] {
    const fromIndex = squareToIndex(square);
    const friendlyColor = piece.color === 'black' ? BLACK : WHITE;
    const moves = this.#movesForType(piece.type, piece.color);
    const result: Square[] = [];

    for (const move of moves) {
      let index = fromIndex + move.offset;

      if (move.slide) {
        while (!(index & OFF_BOARD)) {
          const value = this.#board[index] ?? 0;
          if (value !== 0) {
            if ((value & COLOR_MASK) !== friendlyColor) {
              result.push(indexToSquare(index));
            }
            break;
          }
          result.push(indexToSquare(index));
          index += move.offset;
        }
      } else {
        if (!(index & OFF_BOARD)) {
          const value = this.#board[index] ?? 0;
          if (value === 0 || (value & COLOR_MASK) !== friendlyColor) {
            result.push(indexToSquare(index));
          }
        }
      }
    }

    return result;
  }
```

Add the `#movesForType` private method:

```typescript
  #movesForType(type: PieceType, color: Color): readonly PieceMove[] {
    switch (type) {
      case 'bishop': return BISHOP_MOVES;
      case 'king': return KING_MOVES;
      case 'knight': return KNIGHT_MOVES;
      case 'pawn': return color === 'white' ? PAWN_MOVES.white.captures : PAWN_MOVES.black.captures;
      case 'queen': return QUEEN_MOVES;
      case 'rook': return ROOK_MOVES;
    }
  }
```

Add `PieceType` to the type import from `./types.js`:

```typescript
import type {
  CastlingRights,
  Color,
  DeriveOptions,
  EnPassantSquare,
  File,
  Piece,
  PieceMove,
  PieceType,
  PositionOptions,
  Square,
} from './types.js';
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test -- src/__tests__/reach.spec.ts` Expected: PASS

- [ ] **Step 5: Run full test suite**

Run: `pnpm test` Expected: Some position tests may fail if they import/use old
`reach` signature. Check and fix. The `isCheck` and `isValid` tests should still
pass since `#isAttackedBy` hasn't changed yet.

- [ ] **Step 6: Commit**

```bash
git add src/position.ts src/__tests__/reach.spec.ts
git commit -m "feat!: change reach to accept Piece instead of PieceMove"
```

---

### Task 2: Rewrite `isCheck` and `isValid` to reuse `reach`

**Files:**

- Modify: `src/position.ts`

- [ ] **Step 1: Replace `#isAttackedBy` and `isCheck`/`isValid`**

Remove the entire `#isAttackedBy` method.

Replace the `isCheck` getter with:

```typescript
  get isCheck(): boolean {
    if (this.#isCheck !== undefined) {
      return this.#isCheck;
    }

    const kingColor = this.turn;
    const opponent: Color = kingColor === 'white' ? 'black' : 'white';

    let kingSquare: Square | undefined;
    const kingBitmask = (kingColor === 'white' ? WHITE : BLACK) | KING;
    for (let index = 0; index < 128; index++) {
      if (index & OFF_BOARD) {
        index += 7;
        continue;
      }
      if (this.#board[index] === kingBitmask) {
        kingSquare = indexToSquare(index);
        break;
      }
    }

    if (kingSquare === undefined) {
      this.#isCheck = false;
      return false;
    }

    this.#isCheck = this.#isSquareAttackedBy(kingSquare, kingColor, opponent);
    return this.#isCheck;
  }
```

Add the private `#isSquareAttackedBy` method that uses `reach` with the color
trick:

```typescript
  #isSquareAttackedBy(square: Square, friendlyColor: Color, enemyColor: Color): boolean {
    for (const type of ['knight', 'bishop', 'rook', 'queen', 'king', 'pawn'] as PieceType[]) {
      const squares = this.reach(square, { color: friendlyColor, type });
      for (const sq of squares) {
        const p = this.piece(sq);
        if (p === undefined || p.color !== enemyColor) {
          continue;
        }
        if (type === 'rook' && (p.type === 'rook' || p.type === 'queen')) {
          return true;
        }
        if (type === 'bishop' && (p.type === 'bishop' || p.type === 'queen')) {
          return true;
        }
        if (p.type === type) {
          return true;
        }
      }
    }
    return false;
  }
```

Replace the `isValid` getter — change the attack check block at the end:

```typescript
  get isValid(): boolean {
    let blackKings = 0;
    let whiteKings = 0;

    for (let index = 0; index < 128; index++) {
      if (index & OFF_BOARD) {
        index += 7;
        continue;
      }
      const value = this.#board[index] ?? 0;
      if (value === 0) {
        continue;
      }
      const type = value & TYPE_MASK;

      if (type === KING) {
        if ((value & COLOR_MASK) === 0) {
          whiteKings++;
        } else {
          blackKings++;
        }
      }

      if (type === PAWN) {
        const rank = 8 - ((index >> 4) & 0x07);
        if (rank === 1 || rank === 8) {
          return false;
        }
      }
    }

    if (blackKings !== 1 || whiteKings !== 1) {
      return false;
    }

    const opponentColor: Color = this.turn === 'white' ? 'black' : 'white';
    const opponentKingBitmask = (opponentColor === 'white' ? WHITE : BLACK) | KING;
    let opponentKingSquare: Square | undefined;
    for (let index = 0; index < 128; index++) {
      if (index & OFF_BOARD) {
        index += 7;
        continue;
      }
      if (this.#board[index] === opponentKingBitmask) {
        opponentKingSquare = indexToSquare(index);
        break;
      }
    }

    if (opponentKingSquare === undefined) {
      return false;
    }

    return !this.#isSquareAttackedBy(opponentKingSquare, opponentColor, this.turn);
  }
```

- [ ] **Step 2: Run full test suite**

Run: `pnpm test` Expected: ALL tests pass — `isCheck` and `isValid` behavior
unchanged.

- [ ] **Step 3: Run lint**

Run: `pnpm lint` Expected: PASS. Fix any unused imports (e.g., bitmask constants
only used by the removed `#isAttackedBy` may now be unused — check and clean
up).

- [ ] **Step 4: Commit**

```bash
git add src/position.ts
git commit -m "refactor: rewrite isCheck/isValid to reuse reach with color trick"
```

---

### Task 3: Remove move constants and PieceMove from public exports

**Files:**

- Modify: `src/index.ts`

- [ ] **Step 1: Update `src/index.ts`**

Replace with:

```typescript
export type {
  CastlingRights,
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
  SquareColor,
} from './types.js';

export { STARTING_POSITION } from './constants.js';

export { Position } from './position.js';
```

`PieceMove` type and all move constants removed from exports.

- [ ] **Step 2: Run tests and lint**

Run: `pnpm test && pnpm lint` Expected: PASS. No external consumers in the test
suite use the move constants directly from `index.ts` — the reach tests import
from `../moves.js` (internal), and the moves tests import from `../moves.js`
too.

Wait — `src/__tests__/moves.spec.ts` imports from `../moves.js` directly, so it
still works as an internal test. But check if any test imports move constants
from `../index.js`. If so, update them.

- [ ] **Step 3: Commit**

```bash
git add src/index.ts
git commit -m "refactor!: remove move constants and PieceMove from public exports"
```

---

### Task 4: Update README and CHANGELOG

**Files:**

- Modify: `README.md`
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Update README**

1. Replace Quick Start (lines 23-49):

```typescript
import { Position, STARTING_POSITION } from '@echecs/position';

// Starting position
const pos = new Position(STARTING_POSITION);

console.log(pos.turn); // 'white'
console.log(pos.fullmoveNumber); // 1
console.log(pos.isCheck); // false

// Query the board
const piece = pos.piece('e1'); // { color: 'white', type: 'king' }
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

2. Replace the `reach` method documentation. Remove the current
   `reach(square, move)` section and its code example. Replace with:

````markdown
#### `reach(square, piece): Square[]`

From `square`, return all squares the given `piece` can reach on the current
board. Filters out squares occupied by same-color pieces. For sliding pieces,
stops before friendlies and includes enemy pieces (capture targets). For pawns,
returns capture diagonals only (pushes are game logic).

```typescript
pos.reach('g1', { color: 'white', type: 'knight' }); // ['f3', 'h3']
pos.reach('e4', { color: 'white', type: 'rook' }); // all rank/file squares until blocked
pos.reach('e4', { color: 'white', type: 'pawn' }); // ['d5', 'f5'] (capture diagonals)
```
````

````

3. Remove the entire "Move Constants" section.

4. Remove `PieceMove` from the Types section import example.

- [ ] **Step 2: Update CHANGELOG**

Replace the `### Added` section entries about move constants and PieceMove:

```markdown
### Added

- `Position.prototype.reach(square, piece)` method — from a square, return all
  squares the given piece can reach, filtering same-color pieces.
- Lazy `isCheck` cache — computed once per position.
````

Update the `### Removed` section:

```markdown
### Removed

- `Position.prototype.attackers()` method.
- `Position.prototype.isAttacked()` method.
```

- [ ] **Step 3: Run lint and format**

Run: `pnpm lint && pnpm format` Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add README.md CHANGELOG.md
git commit -m "docs: update README and CHANGELOG for piece-based reach API"
```

---

### Task 5: Regenerate TypeDoc and build

**Files:**

- Modify: `docs/` (generated)

- [ ] **Step 1: Build and regenerate docs**

```bash
pnpm build && npx typedoc src/index.ts --out docs --entryPointStrategy expand --plugin ./typedoc-plugin-collapse-square.mjs
```

- [ ] **Step 2: Restore spec and plan files if TypeDoc cleaned them**

```bash
git checkout HEAD~1 -- docs/superpowers/ 2>/dev/null || true
```

- [ ] **Step 3: Final verification**

Run: `pnpm lint && pnpm test && pnpm build` Expected: ALL pass.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "docs: regenerate TypeDoc"
```
