# AGENTS.md

Agent guidance for the `@echecs/position` package — foundational chess position
type and board utilities for the ECHECS monorepo.

See the root `AGENTS.md` for workspace-wide conventions.

---

## Project Overview

The foundational package. Provides the `Position` type (complete chess position
value object with `Map<Square, Piece>` board) and pure query functions. Internal
0x88 board representation lives in `src/internal/` and is exposed via the
`./internal` export condition for use by `@echecs/game`.

No runtime dependencies — keep it that way.

---

## Dependency Graph

```
@echecs/position     ← no runtime dependencies
     ↑
@echecs/fen          (uses Position type + parse/stringify FEN)
@echecs/san          (uses Position type + isAttacked for resolve)
@echecs/game         (reworked — uses Position at public boundary + ./internal for 0x88)
```

---

## Export Conditions

- `.` (main) — public API: types, square utilities, query functions, constants
- `./internal` — 0x88 board utilities for use by @echecs/game ONLY:
  `squareToIndex`, `indexToSquare`, `boardFromMap`, `ATTACKS`, `RAYS`,
  `PIECE_MASKS`, `DIFF_OFFSET`, `OFF_BOARD`

Do NOT use `./internal` in application code — it is an implementation detail.

---

## 0x88 Representation

Index formula: `index = (8 - rank) * 16 + file` where file: a=0..h=7, rank: 1-based.
- a8=0, b8=1, …, h8=7, a7=16, …, a1=112, h1=119
- Off-board check: `index & 0x88 !== 0` (one bitwise AND)
- Array size: 128 (64 valid squares + 64 off-board padding)

---

## Commands

```bash
pnpm build              # compile TypeScript → dist/
pnpm test               # run all tests
pnpm lint               # ESLint + tsc type-check
pnpm format             # Prettier
pnpm lint && pnpm test && pnpm build   # full pre-PR check
```

---

## Architecture Notes

- All interface fields sorted alphabetically (sort-keys ESLint error).
- Use `.js` extensions on all relative imports (NodeNext resolution).
- No null — use undefined everywhere (unicorn/no-null).
- `Position` is immutable by convention — query functions return new objects.
