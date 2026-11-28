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
            <p key={p}>{withAuthorLink(p)}</p>
          ))}
        </section>
      ))}
      <section>
        <h2>{t().support.heading}</h2>
        <p>{t().support.text}</p>
        <a className="button" href={KOFI} target="_blank" rel="noopener">
          {t().support.button}
        </a>
      </section>
      <a className="button primary" href={href({ page: "home" })}>
        {t().learningPathButton}
      </a>
      <p className="about-rights">{withAuthorLink(t().copyright(new Date().getFullYear()))}</p>
    </main>
  );
}

/** Where donations go. */
const KOFI = "https://ko-fi.com/ziofil";

const AUTHOR = "Filippo Miatto";
const AUTHOR_SITE = "https://filippomiatto.com";

/** The author's name, wherever a text says it (in any language), as a link to the author's website. */
function withAuthorLink(text: string) {
  const parts = text.split(AUTHOR);
  return parts.flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <a key={i} href={AUTHOR_SITE} target="_blank" rel="noopener">
            {AUTHOR}
          </a>,
          part,
        ],
  );
}
