// Removes Next's client runtime from the exported HTML. Runs after `next build`.
//
// WHY
// This site is `output: "export"`. Every page is fully rendered HTML on a CDN,
// and since components/HomeReveal.tsx and components/LeadForm.tsx stopped being
// client components there is nothing left on any page for React to hydrate.
// App Router ships the runtime anyway - there is no supported switch for "this
// export needs no JS", and a page with zero client components (/terms) still
// reports 103KB First Load JS in the build table. So it comes out here.
//
// What that was costing, measured on the service template page with
// `npx serve out` and Lighthouse mobile, median of 3:
//   with the runtime     91 performance   LCP 3.2s   TBT 220ms   192KB HTML
//   without the runtime  97 performance   LCP 2.6s   TBT   0ms    80KB HTML
// Most of it is not even the chunks: ~110KB per page is the inline RSC flight
// payload, which exists only to hydrate.
//
// WHAT IS REMOVED - three things, each matched positively so that nothing else
// can be caught by accident:
//   1. <script src="/_next/...">        the chunks, polyfills and webpack
//   2. <script>self.__next_f...</script> the inline RSC flight payload
//   3. <link rel="preload" as="script"> pointing at /_next/
// The JSON-LD blocks and the two inline behaviour scripts are left alone: they
// have no /_next/ src and no __next_f, so no rule here can match them.
//
// The chunk FILES under out/_next/static are deliberately left on disk. Nothing
// references them any more, so nothing downloads them, and this build step has
// no business deleting assets.

import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "out");

const htmlFiles = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? htmlFiles(p) : p.endsWith(".html") ? [p] : [];
  });

const SCRIPT = /<script\b[^>]*>[\s\S]*?<\/script>/gi;
const LINK = /<link\b[^>]*>/gi;

let files = 0;
let saved = 0;

for (const file of htmlFiles(OUT)) {
  const before = readFileSync(file, "utf8");
  const after = before
    .replace(SCRIPT, (tag) => {
      const isNextChunk = /\ssrc=["'][^"']*\/_next\//i.test(tag);
      const isFlightPayload = tag.includes("self.__next_f");
      return isNextChunk || isFlightPayload ? "" : tag;
    })
    .replace(LINK, (tag) =>
      /rel=["']preload["']/i.test(tag) && /as=["']script["']/i.test(tag) && /\/_next\//i.test(tag) ? "" : tag,
    );
  if (after === before) continue;
  writeFileSync(file, after);
  files += 1;
  saved += Buffer.byteLength(before) - Buffer.byteLength(after);
}

// Loud on zero: if Next ever changes its markers, silence here would mean the
// runtime quietly came back and nobody noticed until the Lighthouse score did.
if (files === 0) {
  console.error("strip-next-runtime: matched nothing in out/. Did Next change its script markers?");
  process.exit(1);
}
console.log(`strip-next-runtime: ${files} html files, ${(saved / 1024).toFixed(0)}KB removed`);
