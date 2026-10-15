// Builds every photo in public/images/work from its ORIGINAL with one shared
// grade, cuts the close-ups in lib/details.ts, and cuts the gallery's
// squares. Run by hand, not by the build - the files it writes are committed
// like every other photo.
//
//   node scripts/build-photo-grade.mjs            grade everything, cut the close-ups and squares
//   node scripts/build-photo-grade.mjs --squares  cut the squares only
//   node scripts/build-photo-grade.mjs --check    report only, write nothing
//   ... --from <folder>                           where the originals are (default ../photos)
//
// SWAPPING IN A CLIENT'S PHOTOS (the kit ships grey placeholders):
//   1. Put the camera originals in ../photos (the site folder, beside
//      website/), or pass --from.
//   2. Name each one in ORIGINALS below: web slug -> original file name. The
//      slug is the file stem the site will serve: say what the photo shows,
//      trade and city first ("<trade>-<city>-<what-it-shows>").
//   3. Run this script. A slug with no web files yet gets them made: widths
//      400/600/800/1200/1600 (stopping at the original's own width) at the
//      original's aspect, plus any ratios named in CUTS, plus its squares.
//      The script prints each new photo's widths and size: copy them into
//      its entry in lib/photos.ts.
//   4. Register each photo in lib/photos.ts (alt, tag, shows), point the
//      pages' keys at the real entries, delete the placeholder-* files and
//      their lib/squares.json entries.
// A slug that already has web files is regraded at its existing sizes, so
// running it twice gives identical files: it only ever reads the originals.
//
// WHY ONE GRADE
// Photos shot on phones across several years carry several years of white
// balance: grey winter skies next to orange timber next to blue tiles. A
// reference site that gives fifty images one tone reads as one shoot. This is
// the same idea kept deliberately small, and identical on every file:
//   saturation   8 percent less
//   warmth       a touch more red and less blue in the MIDTONES only, so a
//                white render stays white and a black fence stays black
//   shadows      the darkest tones lifted about nine levels, falling to
//                nothing by the midtones, so blacks stop clipping
// It is a tone, not an edit. Nothing is added, removed, retouched or swapped
// (no sky replacement), so every photograph still shows the job as built.
//
// WHY FROM THE ORIGINALS
// Every web file is generated from the camera original, never from another
// web file, so the grade costs no second round of WebP loss. Settings: sharp,
// fit cover, position centre, quality 80. An existing file is rebuilt at its
// own exact size, so lib/photos.ts and every width/height on the site stay
// true. Before a file is overwritten its framing is compared with the file it
// replaces, and any mismatch is skipped and reported rather than written.
//
// THE CLOSE-UPS
// Square detail crops cut at full resolution from the same originals. The
// boxes are in ORIGINAL pixels after EXIF rotation, and every one should be at
// least 1200 square, so the 1200 file is never an upscale. Slugs, alts and
// widths live in lib/details.ts; the boxes live here. The two lists are
// checked against each other on every run (placeholder-* entries excepted).
//
// THE SQUARES
// /gallery hangs every photograph as a square. Each is cut once here, from
// the graded original at full resolution, rather than by every browser
// cropping a whole 4:3 or 3:4 file it downloaded. The square is the
// original's short side, moved along the long side by SQUARE_FOCUS where the
// centre would lose the subject. Widths are SQUARE_WIDTHS up to that size,
// plus the full size when it is under 1200. Files are
// `<slug>-1x1-<width>.webp`; the widths written go to lib/squares.json, which
// lib/photos.ts squareWidths() reads, so the srcSet only names files that
// exist. Any older -1x1- file for the photo outside that list is deleted.
import { readdirSync, readFileSync, writeFileSync, existsSync, renameSync, unlinkSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const WORK = join(process.cwd(), "public", "images", "work");
const fromArg = process.argv.indexOf("--from");
const ORIG = fromArg > 0 ? join(process.cwd(), process.argv[fromArg + 1]) : join(process.cwd(), "..", "photos");
const DETAILS_TS = join(process.cwd(), "lib", "details.ts");
const SQUARES_JSON = join(process.cwd(), "lib", "squares.json");
const check = process.argv.includes("--check");
const squaresOnly = process.argv.includes("--squares");

// slug in public/images/work -> its camera original in ORIG.
//   "decking-your-city-merbau-deck": "IMG_0356.jpeg",
const ORIGINALS = {
};

// Extra pre-cut aspect sets for a slug, for Shot's `variant` and `crop` props
// (`<slug>-<ratio>-<width>.webp`, cover, centre). The kit's pages use 16x9
// for the blog hero and 4x3 for blog strips and side photos.
//   "decking-your-city-merbau-deck": ["4x3", "16x9"],
const CUTS = {
};
const WIDTHS = [400, 600, 800, 1200, 1600];

// Close-up slug -> [original, left, top, size], in original pixels.
//   "decking-your-city-oiled-boards-detail": ["IMG_0356.jpeg", 1300, 675, 1200],
const CROPS = {
};
const DETAIL_WIDTHS = [400, 600, 800, 1200]; // keep in step with lib/details.ts

// Square slug -> where the square sits along the original's long side, as a
// fraction (0 left or top, .5 centre, 1 right or bottom). Unlisted is centre.
//   "paving-your-city-side-path": 0.85, // the path, at the foot
const SQUARE_FOCUS = {
};
// 300 stays for any page that shows a square at 300px.
const SQUARE_WIDTHS = [300, 400, 600, 800, 1200];

// The grade, on 8-bit sRGB. See the header for what each step is for.
const SAT = 0.92, WARM_R = 5, WARM_G = 1.2, WARM_B = 6, LIFT = 9;
const lift = Float32Array.from({ length: 256 }, (_, i) => LIFT * (1 - i / 255) ** 3);
const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);
function grade(px) {
  for (let i = 0; i < px.length; i += 3) {
    let r = px[i], g = px[i + 1], b = px[i + 2];
    const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    r = y + SAT * (r - y);
    g = y + SAT * (g - y);
    b = y + SAT * (b - y);
    const mid = Math.sin((Math.PI * clamp(y)) / 255);
    r = clamp(r + WARM_R * mid);
    g = clamp(g + WARM_G * mid);
    b = clamp(b - WARM_B * mid);
    px[i] = Math.round(r + lift[Math.round(r)]);
    px[i + 1] = Math.round(g + lift[Math.round(g)]);
    px[i + 2] = Math.round(b + lift[Math.round(b)]);
  }
  return px;
}

/** The original, EXIF-rotated, in sRGB, graded at full resolution. */
async function gradedOriginal(file) {
  const path = join(ORIG, file);
  if (!existsSync(path)) throw new Error(`missing original ${path}`);
  const { data, info } = await sharp(path).rotate().toColourspace("srgb").removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { px: grade(data), width: info.width, height: info.height };
}
const fromRaw = (g) => sharp(g.px, { raw: { width: g.width, height: g.height, channels: 3 } });

// Framing check: a tiny greyscale thumbnail with its mean removed, so a change
// of tone scores near zero and a change of crop scores high.
async function sig(input) {
  const buf = await sharp(input).resize(24, 24, { fit: "fill" }).greyscale().raw().toBuffer();
  const mean = buf.reduce((a, b) => a + b, 0) / buf.length;
  return Array.from(buf, (v) => v - mean);
}
const dist = (a, b) => a.reduce((s, v, i) => s + Math.abs(v - b[i]), 0) / a.length;

function write(webp, out) {
  const tmp = `${out}.tmp`;
  writeFileSync(tmp, webp);
  renameSync(tmp, out); // never serve a half-written file
}

// Cross-check the close-up lists before touching anything.
const declared = new Set([...readFileSync(DETAILS_TS, "utf8").matchAll(/D\("([^"]+)"/g)].map((m) => m[1]).filter((s) => !s.startsWith("placeholder-")));
const boxed = new Set(Object.keys(CROPS));
const problems = [
  ...[...declared].filter((s) => !boxed.has(s)).map((s) => `in lib/details.ts but has no crop box here: ${s}`),
  ...[...boxed].filter((s) => !declared.has(s)).map((s) => `has a crop box here but is not in lib/details.ts: ${s}`),
  ...Object.values(ORIGINALS).filter((f) => !existsSync(join(ORIG, f))).map((f) => `missing original ${join(ORIG, f)}`),
];
if (problems.length) {
  for (const p of problems) console.error(`build-photo-grade: ${p}`);
  process.exit(1);
}

mkdirSync(WORK, { recursive: true });
const files = readdirSync(WORK).filter((f) => f.endsWith(".webp"));
let written = 0;
const skipped = [];
const made = [];
for (const [slug, original] of squaresOnly ? [] : Object.entries(ORIGINALS)) {
  // Every file of this photo: the plain widths and every -<n>x<n>- variant
  // except the squares, which are cut below.
  const mine = files.filter((f) => f.startsWith(`${slug}-`) && /^((?!1x1-)\d+x\d+-)?\d+\.webp$/.test(f.slice(slug.length + 1)));
  const g = await gradedOriginal(original);
  if (mine.length === 0) {
    // A new photo: make its widths at the original's own aspect.
    const widths = WIDTHS.filter((w) => w <= g.width);
    if (g.width < WIDTHS[WIDTHS.length - 1] && !widths.includes(g.width)) widths.push(g.width);
    const top = widths[widths.length - 1];
    for (const w of widths) {
      const h = Math.round((w * g.height) / g.width);
      if (!check) write(await fromRaw(g).resize(w, h).webp({ quality: 80 }).toBuffer(), join(WORK, `${slug}-${w}.webp`));
      written += 1;
    }
    made.push(`  + ${slug}: widths [${widths.join(", ")}], w ${top}, h ${Math.round((top * g.height) / g.width)}`);
  }
  for (const ratio of CUTS[slug] ?? []) {
    const [rw, rh] = ratio.split("x").map(Number);
    for (const w of WIDTHS.filter((w) => w <= g.width && Math.round((w * rh) / rw) <= g.height)) {
      const out = join(WORK, `${slug}-${ratio}-${w}.webp`);
      if (existsSync(out)) continue; // existing cuts are regraded below
      if (!check) write(await fromRaw(g).resize(w, Math.round((w * rh) / rw), { fit: "cover", position: "centre" }).webp({ quality: 80 }).toBuffer(), out);
      written += 1;
    }
  }
  for (const f of mine) {
    const out = join(WORK, f);
    const { width, height } = await sharp(out).metadata();
    const next = await fromRaw(g).resize(width, height, { fit: "cover", position: "centre" }).webp({ quality: 80 }).toBuffer();
    const d = dist(await sig(out), await sig(next));
    if (d > 4) {
      skipped.push(`${f} (framing differs by ${d.toFixed(1)})`);
      continue;
    }
    if (!check) write(next, out);
    written += 1;
  }
}
for (const [slug, [original, left, top, size]] of squaresOnly ? [] : Object.entries(CROPS)) {
  const g = await gradedOriginal(original);
  if (left + size > g.width || top + size > g.height) throw new Error(`crop box outside ${original}: ${slug}`);
  const cut = await fromRaw(g).extract({ left, top, width: size, height: size }).png().toBuffer();
  for (const w of DETAIL_WIDTHS) {
    if (w > size) throw new Error(`${slug} would upscale to ${w}`);
    if (!check) write(await sharp(cut).resize(w, w).webp({ quality: 80 }).toBuffer(), join(WORK, `${slug}-1x1-${w}.webp`));
    written += 1;
  }
}
const squares = existsSync(SQUARES_JSON) ? JSON.parse(readFileSync(SQUARES_JSON, "utf8")) : {};
for (const [slug, original] of Object.entries(ORIGINALS)) {
  const g = await gradedOriginal(original);
  const size = Math.min(g.width, g.height);
  const f = SQUARE_FOCUS[slug] ?? 0.5;
  const left = Math.round((g.width - size) * f), top = Math.round((g.height - size) * f);
  const cut = await fromRaw(g).extract({ left, top, width: size, height: size }).png().toBuffer();
  const widths = SQUARE_WIDTHS.filter((w) => w <= size);
  if (size < SQUARE_WIDTHS[SQUARE_WIDTHS.length - 1] && !widths.includes(size)) widths.push(size);
  for (const w of widths) {
    if (!check) write(await sharp(cut).resize(w, w).webp({ quality: 80 }).toBuffer(), join(WORK, `${slug}-1x1-${w}.webp`));
    written += 1;
  }
  for (const old of files.filter((x) => x.startsWith(`${slug}-1x1-`) && !widths.includes(+x.slice(slug.length + 5, -5)))) {
    if (!check) unlinkSync(join(WORK, old));
    console.log(`  - removed ${old}`);
  }
  squares[slug] = widths;
}
if (!check) writeFileSync(SQUARES_JSON, JSON.stringify(squares, null, 2) + "\n");
for (const m of made) console.log(m);
for (const s of skipped) console.warn(`  ! skipped, left ungraded: ${s}`);
console.log(`build-photo-grade: ${written} files ${check ? "would be written" : "written"}, ${skipped.length} skipped`);
