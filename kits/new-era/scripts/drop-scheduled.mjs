// Removes the exported files of every page whose publish date has not come.
// Runs after `next build`, as part of `npm run build` (locally and on Vercel).
//
// WHY
// lib/publishing.ts dates a page, and the page calls notFound() until then.
// Under `output: "export"` that still writes out/<route>.html - an empty error
// shell that a static host serves with a 200 - plus out/<route>.txt carrying
// the page's title and description. Neither is a real 404, and the second is
// the page's words before its date. Deleting both leaves nothing at the URL,
// so the host serves 404.html with a genuine 404 status. The next build on or
// after the date writes them and leaves them alone.
//
// The dates are read from lib/publishing.ts with the same pattern
// check_scheduled_links.py uses, and judged by the same rule as isLive(): a
// plain date is midnight local standard time (+10:00), a timestamp is exact.

import { readFileSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const src = readFileSync(join(root, "lib/publishing.ts"), "utf8");
const at = (d) => new Date(/^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T00:00:00+10:00` : d);
const now = new Date();

let held = 0;
for (const [, route, date] of src.matchAll(/"(\/[a-z0-9/-]+)":\s*"([0-9T:Z.+-]+)"/g)) {
  if (at(date) <= now) continue;
  for (const f of [`${route}.html`, `${route}.txt`, route]) {
    const p = join(root, "out", f);
    if (existsSync(p)) rmSync(p, { recursive: true, force: true });
  }
  held++;
  console.log(`drop-scheduled: ${route} held until ${date}`);
}
console.log(`drop-scheduled: ${held} page(s) not due yet`);
