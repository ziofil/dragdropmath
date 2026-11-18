# The move system

What a learner can do to the maths, in one place: which piece a press takes, what each gesture does to it, what happens on its own, and the tests that keep it so. Every move in `src/rules` fits here; one that doesn't is a bug in the move or in this page.

## 1. Pieces and handles

Everything on the board nests: a piece sits in a term, a term in a sum. Two presses reach them:

- **A quick press takes the biggest piece around that can move.** The x of 3x + 2 takes 3x.
- **A press held still (≈ 250 ms) takes the piece itself.** Hold the x of 3x + 2 to take just the x.

**An operator is the handle of what it joins.** The + or − between terms, the · between factors and the fraction bar each take the whole sum, product or fraction they join. So a bottom such as x − 4, or a side such as x + 1, can always be picked up, brackets or not.

**The minus sign is the one glyph with two pieces under it.** In 2 − (x + 1) the − joins the sum and also belongs to −(x + 1):

- a quick press on it takes the sum;
- a press held still takes the minus alone (to open the bracket, or to carry it across the =).

This is the same rule as everywhere else: quick press for the bigger piece, hold for the smaller. A minus in front of a whole side (−x = 6) has no sum around it, so a quick press takes it.

**A product with no · drawn is moved by its factors.** 5(x − 9) alone on its side, the bottom 2y, and the 3x of y = 3x have nothing to grab them by as a whole: pressing the 5 takes the 5. So the engine offers no move of the whole product there. A product that is a term among others is taken whole by a quick press on any factor, as every term is. **A move exists only where its piece has a handle.**

## 2. Gestures

There are three gestures, and each one has **one meaning** for a given piece and target.

### Drag and drop onto something (a merge)

Most merges work either way round. A bracket dropped onto an equal bracket multiplies out, like any bracket onto a bracket: (x + 2)(x + 2) → x² + 2x + 2x + 4. Only these are one way:

- an exponent dropped onto its number works it out (4² → 16, 9^(1/2) → 3);
- the letter alone in y = 4x dropped onto a y in the other equation substitutes it.

**Across the fraction bar:**

| Dropped onto | Result |
|---|---|
| an equal factor | both cancel |
| a power of the same base | the exponents subtract: y³ onto y⁵ → y^(5 − 3) |
| anywhere else across the bar | the factor flips its exponent (x² ↔ x⁻²), from top or bottom |

**Across the =:**

- A term flips its sign as it crosses.
- Dropped onto a like term over there, it combines with it in the same move.
- A whole side carried past the far end swaps the sides, and its sign doesn't flip on the way.

### Drag to a place (a landing)

The piece goes where it will sit: across the =, out in front (factoring), out of a log or root, down off a product equal to 0.

### Tap

| Tapped | Does |
|---|---|
| + or − | works out the two terms beside it (like terms, numbers, fractions over the same bottom, logs); if they don't combine, factors: common factor first, then difference of squares (4x² − 4 → 4(x² − 1) → 4(x − 1)(x + 1)) |
| · | works out the numbers in the product (4·x·3 → 12x), multiplies fractions, merges powers of the same base |
| fraction bar | nothing: cancelling is a drag |
| a number | splits it so the useful factor shows: what it shares across the bar (8 of 8x/12 → 4·2) or with the other terms (15 of 15x + 10 → 5·3); under a root, a square; in log₂ or across from 2ˣ, a power of 2 |
| an exponent | writes the power out: x³ → x·x·x, 4³ → 4·4·4; an exponent 0 makes 1 |
| a root | root ↔ power with a fraction exponent (√9 → 9^(1/2); to work it out, drop the ½ onto the 9) |
| log of its own base, or of 1 | works it out |
| the middle term of x² + 5x + 6 (the term, not its number) | splits it in two |

## 3. What happens on its own (tidying)

These are shown for a moment, then done for the learner. They are never moves to learn:

- x·2 → 2x
- 1·x → x
- x¹ → x
- (x + 3)·3 → 3(x + 3)

Times-one and power-one leave the moves and the lessons.

## 4. Tests that keep it so

1. **Reachable.** For every state an exercise or lesson passes through, every step the engine allows can be made on screen with a quick press, a hold or a tap, at a spot that isn't covered by something else. Show and Next step use only such steps.
2. **One meaning.**
   - A tap has one meaning by construction: what the piece is decides it (taps.ts).
   - Dropping a piece onto a given target gives one result.
3. **Taught.** Every move that isn't tidying, and every gesture, has a lesson board, with its words in every language.

Run against the lessons and the generated exercises, these list what's broken today: the bottom x − 4 has no handle, and 4x² − 4 has two taps on one −.

## 5. Where it lives

| What | Where |
|---|---|
| The handles: every node, a minus by itself, the +, − and · between pieces; the bigger piece a quick press takes; what's never a handle; products nothing picks up whole | `src/rules/handles.ts` |
| What a press at a point takes (quick, held) and what a tap there does, on the laid-out board: used by the canvas, Show and the tests | `src/render/press.ts` |
| What a tap does, by what the piece is (one meaning by construction) | `src/rules/taps.ts`; an operator's tap: `operatorMove` in `src/rules/index.ts` |
| What a tapped number shares (across the bar, then with its sum) | `src/rules/numbers.ts` |
| Each move's maths | `src/rules/*.ts` (one `Rule` each) |
| Tidying | `src/game/tidy.ts` (rules marked `tidy`) |
| Moves that go together, for writing and checking exercises | `src/game/generate/families.ts`, the stages in `src/game/generate/way.ts` |
| The promises above, checked over every lesson and exercise | `src/render/moveSystem.test.ts`; every lesson board in every language: `src/i18n/i18n.test.ts` |

## 6. Left as it is for now

- Taking a factor out of only some terms (x² + 4x + 2x + 8 → x(x + 4 + 2) + 8). Factoring out still needs the factor in every term.
