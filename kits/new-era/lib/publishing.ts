// The publish schedule - the one list every dated page, listing, link and the
// sitemap read. /scale-map's first scheduling run adds the dates.
//
// HOW THE DRIP WORKS. A route listed here with a date in the future does not
// exist yet: its page calls notFound(), /services and the footer leave it out,
// the sitemap leaves it out, and every in-body link to it renders as plain
// text (components/site/ScheduledLink.tsx). Any build on or after its date
// releases all of that at once, and scripts/drop-scheduled.mjs removes the
// exported files of anything not yet due. The site needs a build every
// morning for the queue to drain through quiet weeks: /scale-map adds the
// daily-rebuild GitHub Action to the site's repo on its first scheduling run.
//
// A route NOT listed here is live.
//
// DATES. A plain date (YYYY-MM-DD) means midnight local standard time on that
// day (the +10:00 in at() below: change it for a site outside AEST), so a
// morning rebuild releases it that day. A full timestamp is honoured exactly.
//
// The format of the list below is read by code/check_scheduled_links.py and
// scripts/drop-scheduled.mjs ("/route": "date"), so keep one route per line.
// The dates HERE are the truth.
export const schedule: Record<string, string> = {
};

function at(d: string): Date {
  return new Date(/^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T00:00:00+10:00` : d);
}

/**
 * True once the date has passed. No date means live.
 *
 * On the dev server (npm run dev) everything is live, so a page can be
 * previewed and approved before its date. Every production build - local
 * `npm run build` and Vercel alike - runs with NODE_ENV=production and holds
 * dated pages back.
 */
export const isLive = (d?: string, now = new Date()) =>
  process.env.NODE_ENV === "development" || !d || at(d) <= now;

/** Only the items whose publishDate has passed. */
export const live = <T extends { publishDate?: string }>(xs: T[]) => xs.filter((x) => isLive(x.publishDate));

/** The scheduled date of a route, or undefined for a route that is simply live. */
export const dateOf = (route: string): string | undefined => schedule[route];

/** True when this route is public. Unscheduled routes always are. */
export const routeIsLive = (route: string) => isLive(dateOf(route));
