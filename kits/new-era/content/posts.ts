// The blog index, as DATA.
//
// Same hard rule as content/services.ts, and for the same reason: the /blog
// index renders from this list and app/blog/page.tsx is never hand-edited to
// add a post. When an index was hardcoded JSX, each new link got appended
// beside whichever link happened to be last and ended up under the wrong
// heading. One object here renders as its own card, in order.
//
// KIT STATE: empty. While this list is empty /blog is noindex, absent from the
// sitemap and shows its empty state (see lib/unwritten.ts); both lift by
// themselves when /blog-post adds the first post from app/blog/_template.

import type { PhotoKey } from "@/lib/photos";
import { isLive } from "@/lib/publishing";

export type Post = {
  /** The route is /blog/<slug>. Flat - folders never enter a blog URL. */
  slug: string;
  /** The post's own H1. Must differ from the index H1 or the gate fails. */
  title: string;
  /** One or two sentences. What the reader gets, not what the post "explores". */
  excerpt: string;
  /** ISO date. A future date holds the post back - see livePosts(). */
  published: string;
  /** ISO date, set only on a real rewrite. */
  updated?: string;
  /** Short label on the card, e.g. "Costs" or "Guides". */
  tag?: string;
  /**
   * The card photo on /blog. lib/photos.ts key, and it should be the post's
   * OWN hero so the card previews the article rather than decorating it.
   * Optional: a post with no photo renders as a text card and the grid holds.
   */
  photo?: PhotoKey;
};

// One post looks like:
//   { slug: "post-slug", title: "The post's own H1", excerpt: "One or two
//     sentences.", published: "2026-01-01", tag: "Costs", photo: "wide1" },
// `published` matches the route's date in lib/publishing.ts when it is dated.
export const posts: Post[] = [];

/**
 * Posts that are actually live, newest first.
 *
 * The date filter is what makes a drip schedule real rather than decorative: a
 * post dated next Tuesday is absent from this list, from the sitemap and from
 * every internal link until a build runs on or after that date. /scale-map
 * owns the scheduling machinery and may replace this with its own `live()`
 * helper - the shape is deliberately the same so that swap is one import.
 */
export function livePosts(now = new Date()): Post[] {
  // Same rule as every other dated thing on the site (lib/publishing.ts).
  return posts
    .filter((p) => isLive(p.published, now))
    .sort((a, b) => (a.published < b.published ? 1 : -1));
}
