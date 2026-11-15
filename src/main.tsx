import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./ui/App";
import { startSettings } from "./ui/settings";
import "./ui/pointerGuard";
import "./styles.css";

// Layout measures the maths font's glyphs: the skin's font first (never waiting long for it), then the first draw.
startSettings().finally(() =>
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  ),
);
