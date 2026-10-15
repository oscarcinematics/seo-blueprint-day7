// SEO snapshot of a page, to prove a redesign changed no words.
//   node code/design/snapshot.mjs <path> <out.json>                take one
//   node code/design/snapshot.mjs --diff <before.json> <after.json>  compare
// Run from the site folder. The port is DEV_PORT from .env (see site.mjs), or
// pass --port N / --base URL.
// Records: title, meta description, canonical, robots, every h1-h6 (tag +
// text), the visible text of <main> (word list), every link (href + text),
// every image (file + alt), and every JSON-LD block.
import { chromium } from "playwright";
import fs from "fs";
import { baseUrl } from "./site.mjs";
const a = process.argv.slice(2);
if (a[0] === "--diff") {
  const A = JSON.parse(fs.readFileSync(a[1])), B = JSON.parse(fs.readFileSync(a[2]));
  let bad = 0;
  for (const k of Object.keys(A)) {
    const x = JSON.stringify(A[k]), y = JSON.stringify(B[k]);
    if (x === y) { console.log(`same      ${k}`); continue; }
    bad++;
    if (Array.isArray(A[k])) {
      const sa = A[k].map((v) => JSON.stringify(v)), sb = B[k].map((v) => JSON.stringify(v));
      const gone = sa.filter((v) => !sb.includes(v)), added = sb.filter((v) => !sa.includes(v));
      console.log(`CHANGED   ${k}${gone.length || added.length ? "" : " (same items, different order)"}`);
      gone.slice(0, 40).forEach((v) => console.log("   - " + v));
      added.slice(0, 40).forEach((v) => console.log("   + " + v));
    } else console.log(`CHANGED   ${k}\n   - ${x}\n   + ${y}`);
  }
  console.log(bad ? `\n${bad} field(s) differ` : "\nIDENTICAL");
  process.exit(0);
}
const [path, out] = a;
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto(baseUrl(a) + path, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const snap = await page.evaluate(() => {
  const q = (s) => [...document.querySelectorAll(s)];
  const txt = (e) => e.textContent.replace(/\s+/g, " ").trim();
  return {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content ?? null,
    canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
    robots: document.querySelector('meta[name="robots"]')?.content ?? null,
    headings: q("h1,h2,h3,h4,h5,h6").map((h) => h.tagName + " " + txt(h)),
    words: (document.querySelector("main")?.textContent ?? "").replace(/\s+/g, " ").trim().split(" "),
    links: q("main a[href]").map((l) => l.getAttribute("href") + " | " + txt(l)),
    images: q("main img").map((i) => (i.getAttribute("src") || "").split("/").pop().replace(/-\d+\.(webp|jpg|png)$/, "") + " | " + (i.getAttribute("alt") ?? "")),
    jsonld: q('script[type="application/ld+json"]').map((s) => s.textContent),
  };
});
fs.writeFileSync(out, JSON.stringify(snap, null, 1));
console.log(`saved ${out}: ${snap.headings.length} headings, ${snap.words.length} words, ${snap.links.length} links, ${snap.images.length} images, ${snap.jsonld.length} JSON-LD`);
await browser.close();
