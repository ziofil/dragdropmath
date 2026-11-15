import { describe, expect, it } from "vitest";
import { href, parse, type Route } from "./routes";

const ROUTES: Route[] = [
  { page: "home" },
  { page: "home", at: "balance" },
  { page: "chapter", chapter: "balance" },
  { page: "chapter", chapter: "balance" },
  { page: "exercise", mode: "practice", chapter: "roots", level: "hard", seed: 0 },
  { page: "exercise", mode: "predict", chapter: "nested", level: "easy", seed: 123456 },
  { page: "set", code: "abc_DEF-123" },
  { page: "set", code: "abc_DEF-123", n: 4 },
  { page: "make" },
  { page: "sandbox" },
];

describe("routes", () => {
  it.each(ROUTES.map((r) => [href(r), r] as const))("%s reads back as what wrote it", (h, r) => {
    expect(parse(h)).toEqual(r);
    expect(href(parse(h))).toBe(h);
  });

  it("opens the learning path from an empty address", () => {
    for (const h of ["", "#", "#/"]) expect(parse(h)).toEqual({ page: "home" });
  });

  it("still opens links from earlier versions", () => {
    expect(parse("#/moves/fractions")).toEqual({ page: "chapter", chapter: "fractions" });
    expect(parse("#/c/fractions/moves")).toEqual({ page: "chapter", chapter: "fractions" });
    expect(parse("#/c/fractions/lesson")).toEqual({ page: "chapter", chapter: "fractions" });
    // Practice and the mind's eye start from the chapter's node on the path.
    expect(parse("#/c/fractions/test")).toEqual({ page: "home", at: "fractions" });
    expect(parse("#/c/fractions/practice")).toEqual({ page: "home", at: "fractions" });
    expect(parse("#/c/fractions/predict")).toEqual({ page: "home", at: "fractions" });
    expect(parse("#/test/roots/hard/7")).toEqual({ page: "exercise", mode: "predict", chapter: "roots", level: "hard", seed: 7 });
    expect(parse("#/ex/roots/hard/7")).toEqual({ page: "exercise", mode: "predict", chapter: "roots", level: "hard", seed: 7 });
  });

  it("says when an address is nothing it knows", () => {
    for (const h of ["#/whatever", "#/c", "#/c/a/b/c", "#/c/a/nope", "#/practice/a/easy", "#/practice/a/easy/x", "#/set", "#/set/a/b", "#/sets/old", "#/sandbox/1", "#/at/a/b", "#/c/<x>"])
      expect(parse(h), h).toEqual({ page: "missing" });
  });
});
