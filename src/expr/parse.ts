import type { Condition, Expr, MathState, Rel } from "./types";
import { econst, frac, log, neg, normalize, num, pow, prod, root, sum, variable } from "./build";

/**
 * Parses things like `3x + 2(x - 1) = 10`, `x^2/4`, `-a·b`.
 * Variables are single letters (Latin, and the Greek λ and ρ of physics formulas); juxtaposition means multiplication.
 *
 *   equation := expr (rel expr)?        rel := '=' | '<' | '>' | '<=' | '>=' | '≤' | '≥'
 *   expr     := ('-')? term (('+' | '-') term)*
 *   term     := unary (('*' | '·' | '/' | <juxtaposed>) unary)*
 *   unary    := '-' unary | power
 *   power    := atom ('^' unary)?
 *   atom     := number | letter | '(' expr ')'
 *             | 'ln' '(' expr ')' | 'log' '_' atom '(' expr ')' | 'exp' '(' expr ')'
 *             | '√' atom | 'sqrt' '(' expr ')' | 'root' '_' number '(' expr ')'
 *
 * The letter e is the constant e.
 */
export function parseState(src: string): MathState {
  // Conditions on the letters, after "where": "√(x + 7) = x + 1 where x ≥ -7, x ≥ -1".
  const [main, where] = src.split(/\s+where\s+/);
  if (where !== undefined) return { ...parseState(main), conditions: where.split(",").map(parseCondition) };
  // Rows: "x + y = 5; x - y = 1" (both at once), or "x = 2 or x = -3" (either).
  const rows = src.split(";");
  if (rows.length > 1) return { sides: rows.flatMap((r) => parseRow(r).sides), join: "and" };
  const either = src.split(/\s+or\s+/);
  if (either.length > 1) return { sides: either.flatMap((r) => parseRow(r).sides), join: "or" };
  return parseRow(src);
}

/** One condition: "x ≥ -7", "x ≠ 2" (also "!="). */
function parseCondition(src: string): Condition {
  const ne = src.split(/≠|!=/);
  if (ne.length === 2) return { sides: [parseRow(ne[0]).sides[0], parseRow(ne[1]).sides[0]], rel: "≠" };
  const row = parseRow(src);
  if (row.sides.length !== 2) throw new Error(`A condition needs two sides: ${src}`);
  return { sides: [row.sides[0], row.sides[1]], rel: row.rel ?? "=" };
}

function parseRow(src: string): MathState {
  const p = new Parser(src);
  const sides = [p.expr()];
  const rel = p.rel();
  if (rel) sides.push(p.expr());
  p.end();
  const state: MathState = { sides: sides.map(normalize) };
  return rel && rel !== "=" ? { ...state, rel } : state;
}

const RELS: Record<string, Rel> = { "=": "=", "<": "<", ">": ">", "<=": "≤", ">=": "≥", "≤": "≤", "≥": "≥" };

export function parseExpr(src: string): Expr {
  const s = parseState(src);
  if (s.sides.length !== 1) throw new Error(`Expected an expression, got an equation: ${src}`);
  return s.sides[0];
}

class Parser {
  private tokens: string[];
  private i = 0;

  constructor(private src: string) {
    this.tokens = src.match(/sqrt|root|ln|log|exp|\d+|[a-zA-Zλρ]|<=|>=|[-+*·×/^()=<>≤≥_√]/g) ?? [];
    if (this.tokens.join("") !== src.replace(/\s+/g, "")) {
      throw new Error(`Unexpected character in: ${src}`);
    }
  }

  private peek = () => this.tokens[this.i];

  eat(t: string): boolean {
    if (this.peek() !== t) return false;
    this.i++;
    return true;
  }

  private expect(t: string) {
    if (!this.eat(t)) throw new Error(`Expected '${t}' at token ${this.i} in: ${this.src}`);
  }

  /** A relation sign, if one comes next. */
  rel(): Rel | null {
    const r = RELS[this.peek() ?? ""];
    if (r) this.i++;
    return r ?? null;
  }

  end() {
    if (this.i !== this.tokens.length) throw new Error(`Unexpected '${this.peek()}' in: ${this.src}`);
  }

  expr(): Expr {
    const terms: Expr[] = [];
    terms.push(this.eat("-") ? neg(this.term()) : this.term());
    for (;;) {
      if (this.eat("+")) terms.push(this.term());
      else if (this.eat("-")) terms.push(neg(this.term()));
      else break;
    }
    return terms.length === 1 ? terms[0] : sum(terms);
  }

  private term(): Expr {
    let acc: Expr[] = [this.unary()];
    for (;;) {
      const t = this.peek();
      if (t === "*" || t === "·" || t === "×") {
        this.i++;
        acc.push(this.unary());
      } else if (t === "/") {
        this.i++;
        const n = acc.length === 1 ? acc[0] : prod(acc);
        acc = [frac(n, this.unary())];
      } else if (t !== undefined && (/^[a-zA-Zλρ]+$/.test(t) || t === "(" || t === "√")) {
        acc.push(this.unary());
      } else break;
    }
    // A 1 written as a factor (2·1) is meant to be seen: it stays until simplified.
    const kept = acc.map((f) => (acc.length > 1 && f.kind === "num" && f.value === 1 ? { ...f, explicit: true } : f));
    return kept.length === 1 ? kept[0] : prod(kept);
  }

  private unary(): Expr {
    if (this.eat("-")) return neg(this.unary());
    return this.power();
  }

  private power(): Expr {
    const base = this.atom();
    return this.eat("^") ? pow(base, this.unary()) : base;
  }

  private bracketed(): Expr {
    this.expect("(");
    const e = this.expr();
    this.expect(")");
    return e;
  }

  private atom(): Expr {
    const t = this.peek();
    if (t === undefined) throw new Error(`Unexpected end of: ${this.src}`);
    if (t === "(") return this.bracketed();
    this.i++;
    if (/^\d+$/.test(t)) return num(Number(t));
    if (t === "ln") return log(econst(), this.bracketed());
    if (t === "exp") return pow(econst(), this.bracketed());
    if (t === "log") {
      this.expect("_");
      const base = this.atom();
      return log(base, this.bracketed());
    }
    if (t === "e") return econst();
    if (t === "√") return root(this.atom());
    if (t === "sqrt") return root(this.bracketed());
    if (t === "root") {
      this.expect("_");
      const n = this.atom();
      if (n.kind !== "num") throw new Error(`root_ needs a number in: ${this.src}`);
      return root(this.bracketed(), n.value);
    }
    if (/^[a-zA-Zλρ]$/.test(t)) return variable(t);
    throw new Error(`Unexpected '${t}' in: ${this.src}`);
  }
}
