// The services index, as DATA.
//
// The blueprint's hard rule, in /service-page and /scale-map both: the
// /services index renders from this file, and app/services/page.tsx is never
// hand-edited to add a service. The rule exists because when an index was
// hardcoded JSX, each new page's link got appended beside whichever link
// happened to be last, and unrelated services ended up filed under the wrong
// heading. One object in this list renders as its own row, in order.
//
// A service appears here WHEN ITS PAGE EXISTS, not before: a row with no page
// behind it renders as a heading you cannot click. So this file is the
// built-pages list, and it is the single switch for three things at once - a
// row here puts the service on /services, in the footer's "What we do", and
// makes its row clickable. /service-page and /scale-map own adding rows.
//
// KIT STATE: empty. /services shows only its Cover and Close until the first
// service page is built from app/services/_template.

import type { PhotoKey } from "@/lib/photos";
import { routeIsLive } from "@/lib/publishing";

/**
 * id       - the anchor on this page (/services#<id>), kept working. Permanent for a row once it ships.
 * photo    - lib/photos.ts key. One photo, one placement - nothing here
 *            repeats anything on the homepage.
 * href     - the card's destination, and `anchor` its link text. A row only
 *            belongs in this list once its page exists, so both are REQUIRED:
 *            the whole card is a link, and a card that goes nowhere is the
 *            exact thing this file was emptied to stop.
 * children - city spokes, once suburb pages exist. Never top-level entries.
 * position - object-position override where the subject is not centred.
 */
export type Service = {
  id: string;
  name: string;
  photo: PhotoKey;
  body: string;
  href: string;
  anchor: string;
  position?: string;
  children?: { name: string; href: string }[];
};

// Every built service. Exported below through the publish-date filter, so a
// page dated in lib/publishing.ts stays off /services until its date.
//
// One row looks like:
//   { id: "service-one", name: "Service one", photo: "wide6",
//     body: "Two or three sentences on what the service covers.",
//     href: "/services/service-one-your-city", anchor: "Service one in Your City" },
const allServices: Service[] = [];

// How /services PRESENTS the list above: a few main services for easy
// navigation, the rest listed as links under the one they belong to. Every
// page is still linked from /services, so nothing is lost for SEO - the pages
// just stop competing with each other for the visitor's first click.
//
// `lead` is the service whose page the row opens on, and whose `body` the row
// uses. `name` overrides the row heading where the group is wider than the
// lead. `photo` is the row's own picture: the strongest landscape-format frame
// for that kind of work, not the card photo above. Every id in `lead` or
// `children` must exist in `services`, and each id appears exactly once.
// `name` and each child's `label` are the HUB's display headings only. They
// are deliberately not the keyword anchors: the row's main link still uses the
// lead service's `anchor`, and each service page keeps its own title, H1 and
// keyword.
export const services: Service[] = allServices.filter((s) => routeIsLive(s.href));

export type ServiceGroup = { lead: string; name: string; photo: PhotoKey; children: { id: string; label: string }[] };

// One group looks like:
//   { lead: "service-one", name: "Service one", photo: "wide2", children: [
//     { id: "service-two", label: "Service two" },
//   ] },
const allGroups: ServiceGroup[] = [];

// The groups as /services renders them: a child whose page is not live yet is
// left out, so a dated page appears on the index the day it publishes.
const liveIds = new Set(services.map((s) => s.id));
export const serviceGroups: ServiceGroup[] = allGroups.map((g) => ({ ...g, children: g.children.filter((c) => liveIds.has(c.id)) }));
