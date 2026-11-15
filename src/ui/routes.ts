/**
 * Every page's address, both ways: `parse` reads a location hash, `href`
 * writes one. Links are only ever made with `href`, so the two agree.
 * Links from earlier versions still work: ALIASES rewrite them first.
 *
 *   #/                                  the learning path
 *   #/at/<chapter>                      …with a chapter picked out (coming back from it)
 *   #/c/<chapter>                       a chapter's page: its lesson
 *   #/practice|predict/<chapter>/<level>/<seed>   one of its exercises
 *   #/set/<code>[/<n>]                  a set of one's own, from its link (and its exercise n)
 *   #/sets/new                          making a set
 *   #/sandbox                           any expression, every move
 */
export type Mode = "practice" | "predict";

export type Route =
  | { page: "home"; at?: string }
  | { page: "chapter"; chapter: string }
  | { page: "exercise"; mode: Mode; chapter: string; level: string; seed: number }
  | { page: "set"; code: string; n?: number }
  | { page: "make" }
  | { page: "sandbox" }
  | { page: "missing" };

/** Earlier forms of a link, and what they are now. */
const ALIASES: [RegExp, string][] = [
  [/^#\/moves\/([\w-]+)$/, "#/c/$1"], // the moves had a page of their own
  [/^#\/c\/([\w-]+)\/(?:moves|lesson)$/, "#/c/$1"], // the chapter page is its lesson
  [/^#\/c\/([\w-]+)\/(?:practice|predict|test)$/, "#/at/$1"], // practice and the mind's eye start from the chapter's node
  [/^#\/(?:test|ex)\/([\w-]+\/\w+\/\d+)$/, "#/predict/$1"],
];

const ID = /^[\w-]+$/;
const NUM = /^\d+$/;

export function parse(hash: string): Route {
  let h = hash;
  for (const [from, to] of ALIASES) h = h.replace(from, to);
  const [first, ...rest] = h.replace(/^#?\/?/, "").split("/");
  const ids = rest.every((p) => ID.test(p));
  switch (rest.length === 0 ? first : ids ? first : "?") {
    case "":
      return { page: "home" };
    case "at":
      if (rest.length === 1) return { page: "home", at: rest[0] };
      break;
    case "c":
      if (rest.length === 1) return { page: "chapter", chapter: rest[0] };
      break;
    case "practice":
    case "predict":
      if (rest.length === 3 && NUM.test(rest[2])) return { page: "exercise", mode: first as Mode, chapter: rest[0], level: rest[1], seed: Number(rest[2]) };
      break;
    case "set":
      if (rest.length === 1) return { page: "set", code: rest[0] };
      if (rest.length === 2 && NUM.test(rest[1])) return { page: "set", code: rest[0], n: Number(rest[1]) };
      break;
    case "sets":
      if (rest.length === 1 && rest[0] === "new") return { page: "make" };
      break;
    case "sandbox":
      if (rest.length === 0) return { page: "sandbox" };
  }
  return { page: "missing" };
}

export function href(r: Route): string {
  switch (r.page) {
    case "home":
      return r.at ? `#/at/${r.at}` : "#/";
    case "chapter":
      return `#/c/${r.chapter}`;
    case "exercise":
      return `#/${r.mode}/${r.chapter}/${r.level}/${r.seed}`;
    case "set":
      return `#/set/${r.code}${r.n !== undefined ? `/${r.n}` : ""}`;
    case "make":
      return "#/sets/new";
    case "sandbox":
      return "#/sandbox";
    case "missing":
      return "#/missing";
  }
}

/** Where on its page a route points: an element's id, or the top. */
export function anchorOf(r: Route): string | null {
  if (r.page === "home" && r.at) return "path";
  return null;
}
