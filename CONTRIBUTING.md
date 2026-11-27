# Contributing to DragDropMath

Thanks for helping. Bug reports, ideas and pull requests are all welcome.

## Reporting a bug

Open an issue with what you did, what you expected and what happened. For a drag that went wrong, a recording helps most: turn on debug mode (`?debug` in the address, or Shift+D), do the drag again, and attach the recording the debug panel lets you download. Mention your browser and device; a phone or tablet behaves differently from a mouse.

## Making a change

1. Fork the repository and make a branch.
2. Get it running:
   ```sh
   npm install
   npm run dev        # http://localhost:5173
   ```
3. Make your change. The [README](README.md) explains how the code fits together and how to add a move, a chapter's exercises, or words on screen.
4. Check it:
   ```sh
   npm run typecheck
   npm run test:quick # about 20 s, while you work
   npm test           # the full suite (a few minutes): every exercise must still be solvable
   ```
   A new move gets an example in `src/rules/rules.test.ts`; a fixed bug gets a test that would have caught it.
5. Open a pull request against `main`. Say what it changes and why, and add a screenshot or a short screen recording for anything you can see. CI runs the typecheck, the build and the full test suite on it.

## Things to keep in mind

- **Every language.** The app is in English, Italian, Spanish, German, French, Portuguese, Dutch, Polish, Greek and Turkish. A change to words on screen or in a lesson needs every language. Write each one the way a teacher in that country would, with the terms used in school there, not word for word. If you don't speak one of them, say so in the pull request and someone will fill it in.
- **Moves work everywhere.** If a step can be done by hand, the move must work in every shape it applies to (a side with several terms, a term on its own, …), not only in the exercise that prompted it.
- **Nothing leaves the browser.** No analytics, no tracking, no accounts: progress is stored only on the learner's device.
- **Dependencies.** Only packages under licenses that let the whole stay MIT (MIT, BSD, ISC, Apache). No GPL or AGPL.

## Previews (for maintainers)

Merging doesn't change the live site; only a deploy does. To see a pull request online without touching dragdropmath.com, read its diff first (installing and building runs its code), then:

```sh
gh pr checkout <number>
npm ci
npm run build
npx wrangler versions upload --preview-alias pr-<number>
```

Wrangler prints the preview address (`pr-<number>-dragdropmath.<account>.workers.dev`), which can be shared in the pull request. After merging, `npm run deploy` from `main` puts it live.

## License

By contributing, you agree that your contribution is licensed under the [MIT License](LICENSE), like the rest of the project.
