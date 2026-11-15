import { t } from "../i18n";
import { href } from "./routes";

/** A link that leads nowhere: a page, chapter, exercise or set that isn't there. */
export function NotFound() {
  return (
    <main className="page">
      <h1>{t().brokenLink}</h1>
      <p className="page-intro">{t().brokenLinkText}</p>
      <a className="button primary" href={href({ page: "home" })}>
        {t().learningPathButton}
      </a>
    </main>
  );
}
