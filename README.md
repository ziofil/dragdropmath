# Math by Hand

Algebra you can feel. Drag pieces of an expression around. They only go where the maths allows. Each exercise asks you to work an expression into a given shape. There is no move counting: it only matters that it gets solved.

Built on [Dragology](https://declarative-dragging.github.io/) (declarative dragging). For every draggable symbol we list the states it could lead to, and Dragology turns that list into the drag interaction.

```sh
npm install
npm run dev        # http://localhost:5173
npm test           # parser, rule soundness, drag + animation checks, every exercise solvable
npm run typecheck
```

## How it fits together

```
src/expr/     expression trees with stable ids, parser, normalizer, keys, evaluation
src/rules/    one Rule per algebra move: (state, draggedId) → candidate next states
src/render/   typeset.tsx (SVG math layout, each node a <g id>), drag/ (what dragging
              does: carry.ts, merge.tsx, logs.tsx, spec.ts), preview.tsx (editing
              previews), geometry.ts, testing/harness.ts (headless drags, replays)
src/game/     chapters + exercises, BFS solver, best scores
src/ui/       React pages: learning path, chapter, exercise
```

- **A move is a rule.** `Rule.apply(state, draggedId)` returns `Candidate`s. A candidate without `targetId` keeps the dragged node; how the drag reaches it is the rule's `feel` (`reorder` along the row, `landing` where the piece will sit, `pull-out` of a container, `out-in-front`), plus anything the piece `wears` on the way (`grow-log`, `shed-log`). A candidate with `targetId` merges the dragged node into a target: the result forms gradually as the piece approaches where it ends up, and letting go merges once the picture is mostly the result. `dragSpec` in `src/render/drag/spec.ts` combines them; the renderer never looks at rule ids. What a state allows is computed once per piece (`movesFor`).
- **Ids are identity.** A rewrite should keep the id of every node that survives it, so the glyph visibly slides. Use `cloneFresh` for copies, which records `from` so the copy grows out of the original.
- **What a press picks up.** A symbol is grabbable on its own only if it has a real move (`isGrabbable`); otherwise presses fall through to its term. A `+` (or `·`) belongs to the row, not the term after it, so you carry exactly what you grabbed; a `−` is part of its term and travels with it — except that a minus acting on its own (`−x = 6`, `−(x − 4)`) has its own handle (`signId`), so you can carry just the `−`.
- **Drops are decided by the carried symbol's centre** (not the pointer, not boxes with their signs). Over a mergeable symbol → merge. Within the row → the slot given by how many neighbours' middles it has passed (so a target can't jump behind the piece). Off the row → nearest other move (across `=`, …). Factoring out → past the left end. `src/render/drag.test.tsx` checks all of this with the real drag engine.
- **Taps.** Some rewrites are taps rather than drags (e.g. 8 → 2³ inside log₂).
- **Copy marks last one move.** A copy's `from` makes it fly out of its source when it's made; moves are always computed without old marks, so a later move doesn't send it flying back.

## Debugging a drag

Turn on debug mode with `?debug` in the address or Shift+D. Dragology's overlay then shows each option's aim and distance (a merge's aims are magenta rings, with a line to the leading one), and a panel under the board lists every piece of the state with its id, marks and moves. The last drag is recorded: download it into `src/render/recordings/` and `npm test` replays it frame by frame (add `"expect": {"drops": "…"}` to pin what letting go should give). In tests, `harness(src).grab(piece)` drives the real engine headlessly: `.at(point)`, `.path(to)`, and each frame's `drops`, `blend`, `glyphs()`, `keyOpacity()`.

## Adding things

- **A move:** write a `Rule` in `src/rules/` (shared shape helpers are in `shapes.ts`; give it a `feel` if it isn't reached by carrying the piece to where it lands) and register it in `src/rules/index.ts`. Add an example row to `rules.test.ts`. The soundness test then checks it against the corpus with random values.
- **An exercise:** add it to `src/game/puzzles.ts`. `npm test` fails if it can't be solved with the moves unlocked so far.
