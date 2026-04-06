# chess.js Test Cases - Position-Related Functionality

## DEFAULT_POSITION (Starting Position)

```
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```

---

## isCheck() Tests

### True Cases (In Check)

1. **Black giving check (queen on h4)**
   - FEN: `rnb1kbnr/pppp1ppp/8/8/4Pp1q/2N5/PPPP2PP/R1BQKBNR w KQkq - 2 4`
   - Expected: `true`

2. **Checkmate (also in check)**
   - FEN: `R3k3/8/4K3/8/8/8/8/8 b - - 0 1`
   - Expected: `true`

### False Cases (Not in Check)

1. **Starting position**
   - FEN: `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`
   - Expected: `false`

2. **Stalemate (not check)**
   - FEN: `4k3/4P3/4K3/8/8/8/8/8 b - - 0 1`
   - Expected: `false`

---

## isCheckmate() Tests

### True Cases (Checkmate)

1. FEN: `8/5r2/4K1q1/4p3/3k4/8/8/8 w - - 0 7`
   - Expected: `true`

2. FEN: `4r2r/p6p/1pnN2p1/kQp5/3pPq2/3P4/PPP3PP/R5K1 b - - 0 2`
   - Expected: `true`

3. FEN: `r3k2r/ppp2p1p/2n1p1p1/8/2B2P1q/2NPb1n1/PP4PP/R2Q3K w kq - 0 8`
   - Expected: `true`

4. FEN: `8/6R1/pp1r3p/6p1/P3R1Pk/1P4P1/7K/8 b - - 0 4`
   - Expected: `true`

### False Cases (Not Checkmate)

1. **Starting position**
   - FEN: `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`
   - Expected: `false`

2. **Stalemate (not checkmate)**
   - FEN: `1R6/8/8/8/8/8/7R/k6K b - - 0 1`
   - Expected: `false`

---

## isStalemate() Tests

### True Cases (Stalemate)

1. **Stalemate 1**
   - FEN: `1R6/8/8/8/8/8/7R/k6K b - - 0 1`
   - Expected: `true`

2. **Stalemate 2**
   - FEN: `8/8/5k2/p4p1p/P4K1P/1r6/8/8 w - - 0 2`
   - Expected: `true`

### False Cases (Not Stalemate)

1. **Starting position**
   - FEN: `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`
   - Expected: `false`

2. **Checkmate (not stalemate)**
   - FEN: `R3k3/8/4K3/8/8/8/8/8 b - - 0 1`
   - Expected: `false`

---

## isInsufficientMaterial() Tests

### True Cases (Insufficient Material)

1. **King vs King**
   - FEN: `8/8/8/8/8/8/8/k6K w - - 0 1`
   - Expected: `true`

2. **King + Knight vs King**
   - FEN: `8/2N5/8/8/8/8/8/k6K w - - 0 1`
   - Expected: `true`

3. **King + Bishop vs King**
   - FEN: `8/2b5/8/8/8/8/8/k6K w - - 0 1`
   - Expected: `true`

4. **King + Bishop vs King + Bishop (same color bishops)**
   - FEN: `8/b7/3B4/8/8/8/8/k6K w - - 0 1`
   - Expected: `true`

5. **King + Multiple Bishops vs King + Multiple Bishops (all same color)**
   - FEN: `8/b1B1b1B1/1b1B1b1B/8/8/8/8/1k5K w - - 0 1`
   - Expected: `true`

### False Cases (Sufficient Material)

1. **Starting position**
   - FEN: `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`
   - Expected: `false`

2. **King + Pawn vs King**
   - FEN: `8/2p5/8/8/8/8/8/k6K w - - 0 1`
   - Expected: `false`

3. **King + Bishop vs King + Bishop (opposite color bishops)**
   - FEN: `5k1K/7B/8/6b1/8/8/8/8 b - - 0 1`
   - Expected: `false`

4. **King + Knight vs King + Bishop**
   - FEN: `7K/5k1N/8/6b1/8/8/8/8 b - - 0 1`
   - Expected: `false`

5. **King + Knight vs King + Knight**
   - FEN: `7K/5k1N/8/4n3/8/8/8/8 b - - 0 1`
   - Expected: `false`

---

## isAttacked() Tests

### Pawn Attacks

**Position:** `4k3/4p3/8/8/8/8/4P3/4K3 w - - 0 1`

- White pawn on e2 attacks: `d3`, `f3` → Expected: `true`
- Black pawn on e7 attacks: `d6`, `f6` → Expected: `true`

### Knight Attacks

**Position:** `4k3/4p3/8/8/4N3/8/8/4K3 w - - 0 1`

- Knight on e4 attacks: `d2`, `f2`, `c3`, `g3`, `d6`, `f6`, `c5`, `g5` →
  Expected: `true`
- Knight does NOT attack its own square `e4` → Expected: `false`

### Bishop Attacks

**Position:** `4k3/4p3/8/8/4b3/8/8/4K3 w - - 0 1`

- Bishop on e4 attacks: `b1`, `c2`, `d3`, `f5`, `g6`, `h7`, `a8`, `b7`, `c6`,
  `d5`, `f3`, `g2`, `h1` → Expected: `true`
- Bishop does NOT attack its own square `e4` → Expected: `false`

### Rook Attacks

**Position:** `4k3/4n3/8/8/8/4R3/8/4K3 w - - 0 1`

- Rook on e3 attacks: `e1`, `e2`, `e4`, `e5`, `e6`, `e7`, `a3`, `b3`, `c3`,
  `d3`, `f3`, `g3`, `h3` → Expected: `true`
- Rook does NOT attack its own square `e3` → Expected: `false`

### Queen Attacks

**Position:** `4k3/4n3/8/8/8/4q3/4P3/4K3 w - - 0 1`

- Queen on e3 attacks: `e2`, `e4`, `e5`, `e6`, `e7`, `a3`, `b3`, `c3`, `d3`,
  `f3`, `g3`, `h3`, `c1`, `d2`, `f4`, `g5`, `h6`, `g1`, `f2`, `d4`, `c5`, `b6`,
  `a7` → Expected: `true`
- Queen does NOT attack its own square `e3` → Expected: `false`

### King Attacks

**Position:** `4k3/4n3/8/8/8/4q3/4P3/4K3 w - - 0 1`

- King on e1 attacks: `e2`, `d1`, `d2`, `f1`, `f2` → Expected: `true`
- King does NOT attack its own square `e1` → Expected: `false`

### Special Cases

1. **Pinned pieces still attack**
   - Position: `4k3/4r3/8/8/8/8/4P3/4K3 w - - 0 1`
   - Pinned pawn on e2 still attacks `d3`, `f3` → Expected: `true`

2. **No x-ray attacks**
   - Position: `4k3/4n3/8/8/8/4q3/4P3/4K3 w - - 0 1`
   - Queen on e3 does NOT attack e1 (blocked by pawn on e2) → Expected: `false`

3. **Starting position attacks**
   - `f3` is attacked by white → Expected: `true`
   - `f6` is attacked by black → Expected: `true`
   - `e2` is attacked by white → Expected: `true`

4. **Rook attacking through knight**
   - Position: `4k3/4n3/8/8/8/8/4R3/4K3 w - - 0 1`
   - Rook on e2 attacks `c6` (black knight) → Expected: `true`

---

## Test Setup Pattern

All tests use the `Chess` class constructor with FEN strings:

```typescript
const chess = new Chess('fen-string-here');
```

Or load FEN after construction:

```typescript
const chess = new Chess();
chess.load('fen-string-here');
```

No manual board construction — all tests use FEN notation.
