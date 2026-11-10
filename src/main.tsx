import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./ui/App";
import "./styles.css";

// Layout measures glyph widths, so wait for the math font (but never hang on it).
const fontsReady = Promise.race([
  Promise.all([
    document.fonts.load(`46px "STIX Two Text"`),
    document.fonts.load(`italic 46px "STIX Two Text"`),
  ]),
  new Promise((resolve) => setTimeout(resolve, 2500)),
]);

fontsReady.finally(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
