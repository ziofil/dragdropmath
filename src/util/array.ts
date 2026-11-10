/** `xs` without the item at `i`. */
export function without<T>(xs: readonly T[], i: number): T[] {
  return xs.filter((_, j) => j !== i);
}

/** `xs` with the item at `from` moved to position `to`. */
export function moveItem<T>(xs: readonly T[], from: number, to: number): T[] {
  const out = without(xs, from);
  out.splice(to, 0, xs[from]);
  return out;
}
