import type { ReactNode } from "react";

/** Prose with `backticked` maths set in the maths font. */
export function MathText({ text }: { text: string }) {
  const parts = text.split("`");
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <span key={i} className="m-inline">
            {drawn(p)}
          </span>
        ) : (
          p
        ),
      )}
    </>
  );
}

const ROOT = /[√∛∜]/;

/**
 * Inline maths drawn as by hand: a power's exponent raised (`x^(1/2)`), and
 * each root as its sign with a bar over what it covers — `√(9 + 16)` as √
 * over 9 + 16 (the brackets only say how far the bar goes), `√25` as √ over 25.
 */
function drawn(s: string): ReactNode[] {
  const out: ReactNode[] = [];
  let text = "";
  let i = 0;
  const flush = () => {
    if (text) out.push(text);
    text = "";
  };
  while (i < s.length) {
    const c = s[i];
    // A power written x^(1/2) or x^3: its exponent raised, without the brackets.
    if (c === "^") {
      const [inside, end] = operand(s, i + 1);
      if (inside) {
        flush();
        out.push(<sup key={out.length} className="m-sup">{drawn(inside)}</sup>);
        i = end;
        continue;
      }
    }
    if (!ROOT.test(c)) {
      text += c;
      i++;
      continue;
    }
    // What the root covers: a bracket (to its matching close), else a number or a letter.
    const [inside, end] = operand(s, i + 1);
    if (!inside) {
      text += c;
      i++;
      continue;
    }
    flush();
    out.push(
      <span key={out.length} className="m-inline-root">
        {c}
        <span className="m-radicand">{drawn(inside)}</span>
      </span>,
    );
    i = end;
  }
  flush();
  return out;
}

/** What follows at `i`: a bracket's inside (and where the bracket ends), or a number, or a letter. */
function operand(s: string, i: number): [string, number] {
  if (s[i] === "(") {
    let depth = 0;
    let end = i;
    for (; end < s.length; end++) {
      if (s[end] === "(") depth++;
      else if (s[end] === ")" && --depth === 0) break;
    }
    return [s.slice(i + 1, end), end + 1];
  }
  const m = /^(-?\d+|[a-zA-Zλρ])/.exec(s.slice(i));
  return m ? [m[0], i + m[0].length] : ["", i];
}
