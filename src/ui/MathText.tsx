/** Prose with `backticked` maths set in the maths font. */
export function MathText({ text }: { text: string }) {
  const parts = text.split("`");
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <span key={i} className="m-inline">
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </>
  );
}

