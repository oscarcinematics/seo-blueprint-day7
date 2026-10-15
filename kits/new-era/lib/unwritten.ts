// The publish gate for pages that are scaffolded but not written yet.
//
// A scaffolded page already has its real H1, title, meta, breadcrumbs and
// wiring, but its BODY is still template prose. Shipping those to Google on
// launch day is thin, near-duplicate content across the domain, so they are
// held back: noindex, and absent from the sitemap. The page still renders, so
// no internal link to it breaks.
//
// THE POINT: the check reads the page's own source, so the gate lifts BY
// ITSELF the moment real copy lands. Nobody has to remember to strip a
// noindex, which is the usual way a finished page stays invisible for months.
//
// /blog is gated while it has no posts. The rest is wired so /scale-map's
// service, suburb and blog pages are covered from the moment they land.

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { livePosts } from "@/content/posts";
import { site } from "@/lib/site.config";

const TEMPLATE_MARKERS = [
  "Describe the symptom",
  "A subheading that says something",
  "Replace this with your real",
  "until then it stays honest",
];

/** True when this route is not fit to be indexed yet. */
export function isUnwritten(route: string): boolean {
  // An INDEX with nothing to list is thin by definition - there is no content
  // on it, only chrome. /blog exists today so the structure is whole and the
  // nav is complete, but it stays out of Google until it has posts. This lifts
  // itself: the day /scale-map adds the first entry to content/posts.ts, /blog
  // drops the noindex and joins the sitemap with no one having to remember.
  if (route === "/blog") return livePosts().length === 0;

  const file = join(process.cwd(), "app", route, "page.tsx");
  if (!existsSync(file)) return false;
  return TEMPLATE_MARKERS.some((m) => readFileSync(file, "utf8").includes(m));
}

/**
 * Spread into a page's exported metadata:
 *
 *   export const metadata = { title: "...", ...gate("/services") };
 *
 * Returns the canonical URL, the page's Open Graph block IN FULL (Next replaces
 * a parent openGraph object outright rather than merging into it, so a page
 * that sets only `url` would silently drop og:image, og:type, og:site_name and
 * og:locale), and a noindex directive while the page is unwritten.
 *
 * follow stays true on purpose: a held-back page's links to the money pages
 * should still pass equity.
 */
export function gate(route: string, ogType: "website" | "article" = "website") {
  return {
    // The homepage canonical renders as the bare origin, with no trailing
    // slash - Next normalises it and an absolute override is normalised too.
    // That is fine and is NOT the /services vs /services/ problem: an empty
    // path and "/" are the same URL by spec, so the sitemap's site.url + "/"
    // and this are one address. Every other route matches exactly.
    alternates: { canonical: route },
    openGraph: {
      type: ogType,
      siteName: site.name,
      locale: "en_AU",
      url: route,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name} - ${site.tagline}` }],
    },
    ...(isUnwritten(route) ? { robots: { index: false, follow: true } } : {}),
  };
}
