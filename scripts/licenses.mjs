// The open-source packages bundled into the site, with their copyright and
// license texts (their licenses ask for these to go along with every copy).
// Written to public/third-party-licenses.txt, which the build copies into dist/.
// Run by `npm run build`; the file is generated, not kept in git.
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const dirs = execFileSync("npm", ["ls", "--omit=dev", "--all", "--parseable"], { encoding: "utf8" })
  .split("\n")
  .filter((d) => d && d !== root);

const seen = new Set();
const parts = [];
for (const dir of [...new Set(dirs)].sort()) {
  const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  const id = `${pkg.name}@${pkg.version}`;
  if (seen.has(id)) continue;
  seen.add(id);
  const file = readdirSync(dir).find((f) => /^(licen[cs]e|copying)(\.|$)/i.test(f));
  if (!file) throw new Error(`${id} (${relative(root, dir)}) has no license file: add its notice by hand`);
  const text = readFileSync(join(dir, file), "utf8").trim();
  parts.push(`${id} — ${pkg.license ?? "see below"}\n${pkg.homepage ?? ""}\n\n${text}`);
}

const header = `DragDropMath uses the following open-source software.
Each is the property of its authors and is used under the license shown.

Fonts (loaded from Google Fonts): STIX Two Text, Space Grotesk and Manrope,
under the SIL Open Font License 1.1 (https://openfontlicense.org).`;

mkdirSync("public", { recursive: true });
writeFileSync("public/third-party-licenses.txt", [header, ...parts].join(`\n\n${"=".repeat(72)}\n\n`) + "\n");
console.log(`third-party-licenses.txt: ${parts.length} packages`);
