// Screenshots of the site's dev server. Run from the site folder; the port is
// DEV_PORT from .env (see site.mjs), or pass --port N / --base URL.
//
// One page at chosen scroll points:
//   node code/design/shoot.mjs <path> <outPrefix> [--w 1440] [--h 900] [--ys 0,400,900] [--rm] [--nojs] [--full]
// Scrolls with the mouse wheel (scenes read real scrolling), waits for the
// scene to settle, saves <outPrefix>-<w>-<y>.png. Each run is its own browser.
//
// Every page in the sitemap:
//   node code/design/shoot.mjs --all [--out shots/all]
// Reads /sitemap.xml from the dev server, then takes a full-page shot of each
// page at 1440, 1024 and 390 wide, with reduced motion and JavaScript off (the
// finished static layout). Saves <out>/<page>-<w>.png, clearing old shots in
// <out> first. Exits 1 if a page does not load or scrolls sideways.
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { baseUrl } from "./site.mjs";

const a = process.argv.slice(2);
const opt = (k, d) => { const i = a.indexOf(k); return i < 0 ? d : a[i + 1]; };
const BASE = baseUrl(a);

if (a.includes("--all")) {
  process.exit(await shootAll());
}

const path_ = a[0], out = a[1];
if (!path_ || !out || path_.startsWith("--")) {
  console.error("usage: node code/design/shoot.mjs <path> <outPrefix> [options]   or   --all");
  process.exit(2);
}
const W = +opt("--w", 1440), H = +opt("--h", 900);
const ys = opt("--ys", "0").split(",").map(Number);
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: W, height: H }, reducedMotion: a.includes("--rm") ? "reduce" : "no-preference", javaScriptEnabled: !a.includes("--nojs") });
const page = await ctx.newPage();
const errs = []; page.on("pageerror", (e) => errs.push(e.message));
await page.goto(BASE + path_, { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
for (const y of ys) {
  const cur = await page.evaluate(() => scrollY);
  if (y !== cur) { await page.mouse.move(W / 2, H / 2); await page.mouse.wheel(0, y - cur); }
  await page.waitForTimeout(1200);
  const f = `${out}-${W}-${y}.png`;
  await page.screenshot({ path: f, fullPage: a.includes("--full") });
  console.log(f);
}
const sw = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.scrollHeight]);
console.log(`scrollWidth ${sw[0]} (viewport ${W}) height ${sw[1]}${errs.length ? "\nPAGE ERRORS: " + errs.join(" | ") : ""}`);
await browser.close();

async function sitemapPaths(url, seen = new Set()) {
  if (seen.has(url)) return [];
  seen.add(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} returned ${res.status}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, "&"));
  const paths = [];
  for (const loc of locs) {
    // The sitemap names the live domain; shoot the same path on the dev server.
    const u = new URL(loc, BASE);
    if (u.pathname.endsWith(".xml")) paths.push(...await sitemapPaths(BASE + u.pathname, seen));
    else paths.push(u.pathname + u.search);
  }
  return paths;
}

async function shootAll() {
  const outDir = path.resolve(opt("--out", "shots/all"));
  let paths;
  try {
    paths = [...new Set(await sitemapPaths(`${BASE}/sitemap.xml`))];
  } catch (e) {
    console.error(`Could not read the sitemap at ${BASE}/sitemap.xml (${e.message}).\n` +
      "Start the dev server first: cd website && npm run dev");
    return 1;
  }
  if (!paths.length) { console.error(`No <loc> entries in ${BASE}/sitemap.xml`); return 1; }
  fs.mkdirSync(outDir, { recursive: true });
  for (const f of fs.readdirSync(outDir)) if (f.endsWith(".png")) fs.unlinkSync(path.join(outDir, f));

  const sizes = [[1440, 900], [1024, 768], [390, 844]];
  const problems = [];
  let count = 0;
  const browser = await chromium.launch();
  for (const [W, H] of sizes) {
    const ctx = await browser.newContext({ viewport: { width: W, height: H }, reducedMotion: "reduce", javaScriptEnabled: false });
    const page = await ctx.newPage();
    for (const p of paths) {
      const slug = p.replace(/^\/+|\/+$/g, "").replace(/[^a-zA-Z0-9-]+/g, "_") || "home";
      const file = path.join(outDir, `${slug}-${W}.png`);
      try {
        const res = await page.goto(BASE + p, { waitUntil: "networkidle", timeout: 90000 });
        if (!res || res.status() !== 200) problems.push(`${p} at ${W}: HTTP ${res ? res.status() : "no response"}`);
        await page.waitForTimeout(300);
        await page.screenshot({ path: file, fullPage: true });
        count++;
        const sw = await page.evaluate(() => document.documentElement.scrollWidth);
        if (sw > W) problems.push(`${p} at ${W}: scrolls sideways (page is ${sw}px wide)`);
        console.log(path.relative(process.cwd(), file));
      } catch (e) {
        problems.push(`${p} at ${W}: ${e.message.split("\n")[0]}`);
      }
    }
    await ctx.close();
  }
  await browser.close();
  console.log(`\n${count} shots of ${paths.length} pages in ${path.relative(process.cwd(), outDir) || "."} (reduced motion, JavaScript off)`);
  if (problems.length) {
    console.log(`\n${problems.length} problem(s):`);
    problems.forEach((x) => console.log("  - " + x));
    return 1;
  }
  return 0;
}
