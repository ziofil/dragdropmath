import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./ui/App";
import { clearTextWidths } from "./render/measure";
import "./ui/pointerGuard";
import "./styles.css";

// Layout measures glyph widths, so wait for the math font (but never hang on it).
const mathFont = Promise.all([
  document.fonts.load(`46px "STIX Two Text"`),
  document.fonts.load(`italic 46px "STIX Two Text"`),
]);
let waited = false;
const fontsReady = Promise.race([mathFont, new Promise((resolve) => setTimeout(() => resolve((waited = true)), 2500))]);

fontsReady.finally(() => {
  const root = createRoot(document.getElementById("root")!);
  const render = (key: string) =>
    root.render(
      <StrictMode>
        <App key={key} />
      </StrictMode>,
    );
  render("first");
  // On a slow connection the font can come after the wait: everything was
  // measured with a fallback font, and pieces would overlap. Measure again.
  mathFont.then(
    () => {
      if (!waited) return;
      clearTextWidths();
      render("font");
    },
    () => {}, // no font at all: the fallback it was measured with stays
  );
});
