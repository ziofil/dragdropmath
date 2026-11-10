import { CHAPTERS, exerciseLabel } from "../game/puzzles";
import { FeelWord } from "./FeelWord";
import { loadSolved } from "../game/scoring";

export function Home() {
  const solved = loadSolved();
  return (
    <main className="home">
      <section className="hero">
        <h1>
          Algebra you can <FeelWord />.
        </h1>
        <p>
          Grab a piece of an equation and drag it. It only goes where the maths lets it go. Work it into the shape
          each exercise asks for.
        </p>
      </section>

      {CHAPTERS.map((ch, ci) => (
        <section className="chapter" key={ch.id}>
          <div className="chapter-head">
            <span className="chapter-num">{ci + 1}</span>
            <div>
              <h2>{ch.title}</h2>
              <p>{ch.blurb}</p>
            </div>
          </div>
          <ol className="exercises">
            {ch.puzzles.map((p, i) => {
              const done = solved.has(p.id);
              return (
                <li key={p.id}>
                  <a
                    href={`#/p/${p.id}`}
                    className={`ex-card ${done ? "solved" : ""}`}
                    title={`Exercise ${exerciseLabel(ci, i)}${done ? " — solved" : ""}`}
                  >
                    <span className="ex-num">{exerciseLabel(ci, i)}</span>
                    {done && <span className="ex-check" aria-label="solved">✓</span>}
                  </a>
                </li>
              );
            })}
          </ol>
        </section>
      ))}

      <section className="chapter sandbox-link">
        <a href="#/sandbox" className="button">
          Open the sandbox →
        </a>
        <p>Type any expression or equation and play with every move you've learned.</p>
      </section>
    </main>
  );
}
