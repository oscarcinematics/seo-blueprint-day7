// The close-ups. Square detail crops of the job photos in lib/photos.ts: the
// joints, grain, edges and textures that a wide shot of a finished job shows
// too small to see. Used by components/site/Rhythm.tsx (no kit page places
// that block today; it is kept for pages that want it).
//
// The idea: wide shot, then a row of small close-ups, then wide again. The
// close-ups make the work feel touched rather than photographed from the
// street, and they hide what makes a phone photo look cheap (a grey sky, a
// neighbour's fence, a wheelie bin), so the detail carries the page.
//
// Kept OUT of `photos` on purpose. photosShowing(), galleryGroups() and every
// service page read that list, and a close-up is not a job photograph in its
// own right: it is a second look at one. Here, nothing that reads `photos`
// can pick one up by accident.
//
// KIT STATE: every entry is a grey placeholder. Real crops are cut at full
// resolution from the client's ORIGINAL photos by scripts/build-photo-grade.mjs
// (its CROPS table holds the crop boxes; its slugs must match the ones below),
// never from a web file, so no width here is an upscale. Files sit in
// public/images/work as `<slug>-1x1-<width>.webp`.
//
// The rules lib/photos.ts holds apply here too: `alt` says what the crop
// actually shows and is not a keyword slot, and nothing here is a claim.
import type { PhotoKey } from "@/lib/photos";

export type Detail = {
  /** File stem in public/images/work, before the `-1x1-<width>` label. */
  slug: string;
  /** The job photo this is a close-up OF. */
  parent: PhotoKey;
  /** What the close-up shows. */
  alt: string;
  /** Widths actually generated, ascending. Every crop is square. */
  widths: readonly number[];
  w: number;
  h: number;
};

const WIDTHS = [400, 600, 800, 1200] as const;
const D = (slug: string, parent: PhotoKey, alt: string): Detail => ({ slug, parent, alt, widths: WIDTHS, w: 1200, h: 1200 });
const ph = (n: number) => `DETAIL SHOT ${n}, a placeholder for a close-up of a client photo`;

export const details = {
  detail1: D("placeholder-detail1", "tall5", ph(1)),
  detail2: D("placeholder-detail2", "tall4", ph(2)),
  detail3: D("placeholder-detail3", "tall3", ph(3)),
  detail4: D("placeholder-detail4", "tall2", ph(4)),
  detail5: D("placeholder-detail5", "tall6", ph(5)),
  detail6: D("placeholder-detail6", "wide1", ph(6)),
  detail7: D("placeholder-detail7", "wide12", ph(7)),
  detail8: D("placeholder-detail8", "wide10", ph(8)),
  detail9: D("placeholder-detail9", "wide3", ph(9)),
} as const;

export type DetailKey = keyof typeof details;
