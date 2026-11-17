/**
 * Tools for working on the app, not for learners: debug mode (move details,
 * drag recordings) and the sandbox (any expression, every move). Only on the
 * dev server (`npm run dev`, which the QA script drives): a build for the site
 * leaves them out entirely, code and all.
 */
export const TOOLS = import.meta.env.DEV;
