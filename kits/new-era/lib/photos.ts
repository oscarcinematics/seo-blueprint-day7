// The photo library. Every photo on the site is registered here once: its
// file stem, alt text, generated widths, capture date and what it shows.
//
// KIT STATE: every entry below is a grey placeholder (public/images/work/
// placeholder-*.webp), one per slot the kit's pages use, at the aspect the
// page was designed around: tall = 3:4 portrait, wide = 4:3, pano = 3:2,
// small = a 600px 4:3 file (the blog's .po-inset). Each alt starts "JOB
// PHOTO", which check_page_done and check_site_complete fail on, so no page
// can pass while a placeholder is still on it. /build-website swaps in the
// client's photos: see kits/README.md in the engine.
//
// Written here rather than inline on the pages for two reasons: every <img>
// gets the same srcSet/width/height treatment (so nothing shifts on load), and
// ONE list makes it checkable which photos are placed and which are still
// spare. Photos earn their place on a page that is about the work they show:
// build a service page's set with photosShowing() below, never by hand.
// /gallery is the one page that shows every photo, grouped by `tag` -
// galleryGroups() at the bottom of this file.
//
// Three rules this file exists to hold:
//  1. `alt` says what the photograph actually shows. It is not a keyword slot.
//  2. `taken` is the capture date off the file's own metadata. The recent,
//     well-lit photos carry the pages people land on; older work fills the
//     gallery and the services that only have older work on record.
//  3. Nothing here is a claim. Captions and alts say what the work is, never
//     who it was for, and never a result that proof-inventory.md does not hold.

import squares from "./squares.json";

export type Photo = {
  /** File stem in public/images/work. */
  slug: string;
  /** What the photograph shows. */
  alt: string;
  /** Widths actually generated, ascending. */
  widths: number[];
  /** Intrinsic size of the LARGEST generated file, for the aspect box. */
  w: number;
  h: number;
  /** Capture date from the file's metadata. */
  taken: string;
  /** The trade this photo is primarily about. Exactly one. */
  tag: Tag;
  /**
   * Every trade actually VISIBLE in the frame, `tag` first.
   *
   * A finished job often shows several services at once: a photo whose `tag`
   * is one service can still be the best shot another service page has.
   * `tag` answers "what is this photo of"; `shows` answers "which service pages
   * may use it", and they are not the same question. Counting `tag` alone
   * undercounts what a service page has to work with.
   */
  shows: Tag[];
};

export type Tag =
  | "Service one"
  | "Service two"
  | "Service three";

const P = (slug: string, alt: string, widths: number[], w: number, h: number, taken: string, tag: Tag, also: Tag[] = []): Photo =>
  ({ slug, alt, widths, w, h, taken, tag, shows: [tag, ...also] });

// Placeholder slots. TALL is 1600x2133 (3:4), WIDE 1600x1200 (4:3), PANO
// 1600x1067 (3:2). The client's real photos replace these entries one for
// one, or the keys are renamed across the pages that use them.
const W = [400, 600, 800, 1200, 1600];
const ph = (key: string, shape: string) => `JOB PHOTO ${key} (${shape}), a placeholder for a client photo`;
const tall = (k: string, tag: Tag, also: Tag[] = []) => P(`placeholder-${k}`, ph(k, "3:4"), W, 1600, 2133, "2026-01", tag, also);
const wide = (k: string, tag: Tag, also: Tag[] = []) => P(`placeholder-${k}`, ph(k, "4:3"), W, 1600, 1200, "2026-01", tag, also);

export const photos = {
  tall1: tall("tall1", "Service two", ["Service one"]),
  tall2: tall("tall2", "Service one", ["Service two"]),
  tall3: tall("tall3", "Service two", ["Service one"]),
  tall4: tall("tall4", "Service one"),
  tall5: tall("tall5", "Service three"),
  tall6: tall("tall6", "Service one", ["Service three"]),
  tall7: tall("tall7", "Service two"),
  tall8: tall("tall8", "Service one"),
  wide1: wide("wide1", "Service one", ["Service two"]),
  wide2: wide("wide2", "Service two"),
  wide3: wide("wide3", "Service three"),
  wide4: wide("wide4", "Service one"),
  wide5: wide("wide5", "Service one", ["Service three"]),
  wide6: wide("wide6", "Service one", ["Service two"]),
  wide7: wide("wide7", "Service three"),
  wide8: wide("wide8", "Service three", ["Service one"]),
  wide9: wide("wide9", "Service three"),
  wide10: wide("wide10", "Service three"),
  wide11: wide("wide11", "Service two", ["Service three"]),
  wide12: wide("wide12", "Service two"),
  wide13: wide("wide13", "Service three"),
  wide14: wide("wide14", "Service two"),
  pano1: P("placeholder-pano1", ph("pano1", "3:2"), W, 1600, 1067, "2026-01", "Service two"),
  small1: P("placeholder-small1", ph("small1", "4:3, 600px"), [400, 600], 600, 450, "2026-01", "Service three", ["Service one"]),
} as const;

export type PhotoKey = keyof typeof photos;

/** Every photo, newest capture first. The tie-break inside photosShowing(). */
export const newestFirst: PhotoKey[] = Object.keys(photos) as PhotoKey[];

/**
 * Every photo showing this trade, best first.
 *
 * "Best" is: the frame where the trade LEADS (it is the photo's `tag`) comes
 * before a frame where it merely appears, and within each group the newer
 * capture wins. That ordering is the whole point - a service page leads with
 * the shot that is about its trade and fills out with the ones it is in.
 *
 * Use this to build a service page's photo set rather than hand-picking keys:
 * hand-picking is how a service ends up looking like it has one photo.
 */
export function photosShowing(tag: Tag): PhotoKey[] {
  const rank = new Map(newestFirst.map((k, i) => [k, i])); // newest first
  return newestFirst
    .filter((k) => (photos[k].shows as readonly Tag[]).includes(tag))
    .sort((a, b) => {
      const lead = Number(photos[b].tag === tag) - Number(photos[a].tag === tag);
      return lead !== 0 ? lead : rank.get(a)! - rank.get(b)!;
    });
}

/**
 * The trade order /gallery runs in.
 *
 * A hand-written order rather than "biggest group first": the page should
 * open on the main service, not reshuffle itself the day a photo is added.
 */
export const galleryOrder: Tag[] = ["Service one", "Service two", "Service three"];

/**
 * Every photo, grouped by the trade it is OF, newest capture first inside each
 * group. Empty trades are dropped, so the page has no empty headings.
 *
 * Grouped on `tag`, not `shows`: `shows` is deliberately generous so a service
 * page can use any frame its trade appears in, which would put the same
 * photograph under four headings here. A gallery shows each job once.
 */
export function galleryGroups(): { tag: Tag; keys: PhotoKey[] }[] {
  return galleryOrder
    .map((tag) => ({ tag, keys: newestFirst.filter((k) => photos[k].tag === tag) }))
    .filter((g) => g.keys.length > 0);
}

/**
 * The 1x1 widths that exist for a photo, for Shot's `variant`.
 *
 * /gallery hangs every photograph as a square. The squares are cut from the graded ORIGINALS by
 * scripts/build-photo-grade.mjs (`--squares`), each moved off centre where the
 * centre would lose the subject, and that script writes the widths it cut to
 * lib/squares.json. Read from there rather than derived here, because only the
 * script knows how big each original is: a small original's list stops at its
 * own size. A width listed here with no
 * file behind it would be a 404 in a srcSet; this way there is never one.
 */
export function squareWidths(name: PhotoKey): number[] {
  return (squares as Record<string, number[]>)[photos[name].slug] ?? [];
}
