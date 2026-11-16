import { t } from "../i18n";
import { href } from "./routes";

/** Who made the site, why, and what it does with what learners do (nothing leaves the browser). */
export function About() {
  const a = t().about;
  return (
    <main className="page about">
      <h1>{a.title}</h1>
      {a.sections.map((s) => (
        <section key={s.heading}>
          <h2>{s.heading}</h2>
          {s.text.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
      ))}
      <a className="button primary" href={href({ page: "home" })}>
        {t().learningPathButton}
      </a>
    </main>
  );
}
