# chess.js Test Cases Reference

**Source Repository**: https://github.com/jhlywa/chess.js  
**Commit**: ca935bf44076e3d1c6e06922c7a9a2f28d959d2a

All test cases extracted from the chess.js test suite and ready to port to
`@echecs/position`.

---

## Test Files

### isCheck() Tests

**Source**:
[**tests**/is-check.test.ts](https://github.com/jhlywa/chess.js/blob/ca935bf44076e3d1c6e06922c7a9a2f28d959d2a/__tests__/is-check.test.ts)

- **True cases**: 2 positions (queen check, checkmate)
- **False cases**: 2 positions (starting position, stalemate)

### isCheckmate() Tests

**Source**:
[**tests**/is-checkmate.test.ts](https://github.com/jhlywa/chess.js/blob/ca935bf44076e3d1c6e06922c7a9a2f28d959d2a/__tests__/is-checkmate.test.ts)

- **True cases**: 4 checkmate positions
- **False cases**: 2 positions (starting position, stalemate)

### isStalemate() Tests

**Source**:
[**tests**/is-stalemate.test.ts](https://github.com/jhlywa/chess.js/blob/ca935bf44076e3d1c6e06922c7a9a2f28d959d2a/__tests__/is-stalemate.test.ts)

- **True cases**: 2 stalemate positions
- **False cases**: 2 positions (starting position, checkmate)

### isInsufficientMaterial() Tests

**Source**:
[**tests**/is-insufficient-material.test.ts](https://github.com/jhlywa/chess.js/blob/ca935bf44076e3d1c6e06922c7a9a2f28d959d2a/__tests__/is-insufficient-material.test.ts)

- **True cases**: 5 positions (K vs K, K+N vs K, K+B vs K, K+B vs K+B same
  color, multiple bishops same color)
- **False cases**: 5 positions (starting position, K+P vs K, K+B vs K+B opposite
  color, K+N vs K+B, K+N vs K+N)

### isAttacked() Tests

**Source**:
[**tests**/is-attacked.test.ts](https://github.com/jhlywa/chess.js/blob/ca935bf44076e3d1c6e06922c7a9a2f28d959d2a/__tests__/is-attacked.test.ts)

- **Pawn attacks**: 4 test cases
- **Knight attacks**: 9 test cases
- **Bishop attacks**: 14 test cases
- **Rook attacks**: 14 test cases
- **Queen attacks**: 24 test cases
- **King attacks**: 6 test cases
- **Special cases**: 6 edge cases (pinned pieces, x-ray, starting position,
  etc.)

---

## Test Data Summary

### Total Test Cases by Function

| Function               | True Cases | False Cases | Total   |
| ---------------------- | ---------- | ----------- | ------- |
| isCheck                | 2          | 2           | 4       |
| isCheckmate            | 4          | 2           | 6       |
| isStalemate            | 2          | 2           | 4       |
| isInsufficientMaterial | 5          | 5           | 10      |
| isAttacked             | 87         | 0           | 87      |
| **TOTAL**              | **100**    | **11**      | **111** |

---

## Key Test Patterns

### 1. FEN-Based Setup

All tests use FEN strings to set up positions. No manual board construction.

```typescript
const chess = new Chess('fen-string-here');
```

### 2. Position Categories Tested

**Check/Checkmate/Stalemate**:

- Starting position (baseline)
- Positions with pieces attacking the king
- Positions where the king has no legal moves
- Positions where the king is not in check but has no legal moves

**Insufficient Material**:

- King vs King (minimal)
- King + minor piece vs King (knight, bishop)
- King + bishop vs King + bishop (same color = draw, opposite color = not draw)
- King + pawn vs King (sufficient material)

**Attack Detection**:

- Each piece type tested individually
- Piece attacking its own square (should be false)
- Pinned pieces (still attack)
- Blocked pieces (no x-ray attacks)
- Starting position attacks (pawn moves)

---

## Porting Checklist

- [ ] Copy `chess-js-test-cases.ts` to test fixtures
- [ ] Create test file for `isCheck()`
- [ ] Create test file for `isCheckmate()`
- [ ] Create test file for `isStalemate()`
- [ ] Create test file for `isInsufficientMaterial()`
- [ ] Create test file for `isAttacked()`
- [ ] Verify all 111 test cases pass
- [ ] Cross-check results with chess.js implementation

---

## Notes

1. **No test data files**: chess.js doesn't use JSON fixtures — all test data is
   inline in test files.
2. **Test setup pattern**: All tests construct a `Chess` instance with FEN, then
   call the query function.
3. **Color representation**: Tests use `'white'` and `'black'` strings (not
   enums).
4. **Square notation**: All squares use algebraic notation (a1-h8).
5. **Starting position**:
   `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`
