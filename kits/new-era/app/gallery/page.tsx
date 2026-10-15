// The gallery - every job photograph on the site, and nothing else.
//
// PURELY VISUAL. No captions, no suburb, no date, no link off a tile. The rest
// of the site puts a photo next to the copy that explains it; this page is the
// opposite of that, and the moment a tile grows a caption it stops being one.
//
// SQUARES. Every photo hangs as an equal square, for one calm rhythm. Every
// square is large, and where centre would lose the subject (a path at the
// foot of a portrait frame) the square is moved off centre when it is cut
// from the original (scripts/build-photo-grade.mjs, SQUARE_FOCUS).
//
// EACH SERVICE IS A ROOM. Its photographs hang as one band of squares in a
// single mount that travels sideways while the room is held, so scrolling
// down walks you along it. The rooms stand on the homepage's own grounds -
// sand, paper and night in turn (GROUNDS below) - and the page opens on the
// shared Cover and ends on the shared Close like every main inner page.
//
// THE COVER AND THE CLOSE REPEAT A PHOTO, on purpose. Everywhere else a photo
// appears once per page, but this page shows every job photograph in a room,
// so whatever opens and closes it is necessarily also on a wall. Pick a Cover
// that darkens into the evening mood, and a Close whose left half is dark
// enough for the heading to stay legible as the photo rises behind it. The
// Close photo is decorative (Close.tsx gives it an empty alt).
//
// SORTED BY SERVICE. The index (sticky under the header) is anchors into the
// rooms, not a filter: the site ships no React runtime (see
// components/HomeReveal), so a real filter would mean adding one back. An
// anchor does the same job for free and survives JS being off.
//
// Grouping is on each photo's own `tag` via galleryGroups(), so every job
// appears exactly once in the rooms. photosShowing() - which is generous on
// purpose, so a service page can use any frame its trade appears in - would
// put the same photograph under several headings here.
//
// Nothing on this page is a claim, and with no text at all there is nothing
// here that could become one.
import { site, telHref } from "@/lib/site.config";
import { gate } from "@/lib/unwritten";
import HomeReveal from "@/components/HomeReveal";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Cover from "@/components/site/Cover";
import DeferredPhotos from "@/components/site/DeferredPhotos";
import Close from "@/components/site/Close";
import Shot from "@/components/site/Shot";
import PageCss from "@/components/site/PageCss";
import { galleryGroups, squareWidths, type Tag } from "@/lib/photos";
import type { CSSProperties } from "react";

export const metadata = {
  ...gate("/gallery"),
  title: { absolute: "Your City Your Trade Gallery | Business Name" },
  description: "Photographs of Business Name jobs across Your City, sorted by service: service one, service two and service three.",
};

/** "Service one" -> "service-one". The anchor a chip points at. */
const anchor = (tag: Tag) => tag.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// A square renders at --sq in gallery.css: 580px on a desktop, 78vw below.
const SQUARE_SIZES = "(max-width:999px) 78vw, 580px";

// The rooms' grounds, in turn: the homepage's sand, paper and night (brand.css
// "Grounds"; .h-night flips every token, so the room's type turns over with
// no rules of its own). Sand first, so the rooms begin with a visible edge
// under the Cover's paper. End on sand or night (1, 3, 4, 6 or 7 rooms) so the
// Close's paper meets an edge. Night every third room only: a night ground is
// the richest setting for a bright photograph, but a whole page of dark walls
// reads bland, so it is a change of key, not the page's colour.
const GROUNDS = ["h-sand", "gl-paper", "h-night"] as const;

export default function Page() {
  const groups = galleryGroups();
  const total = groups.reduce((n, g) => n + g.keys.length, 0);

  return (
    <div className="h-page" data-head="over">
      <SiteHeader current="/gallery" />
      <main>
        <PageCss file="gallery.css" />
        <HomeReveal />
        <DeferredPhotos />
        {/* The opening: the cover (components/site/Cover.tsx). The photo is
            the page's one priority image. */}
        <Cover
          crumbs={[{ label: "Gallery" }]}
          lines={[["Gallery", "c"]]}
          lede={`${total} photographs of finished work across Your City, sorted by service.`}
          photo="tall4"
          position="50% 62%"
        />

        {/* The trade index is the first child of the wrapper round every
            room, because position:sticky only sticks inside its own parent.
            Plain anchors, so it works with JS off. */}
        <div className="gl-body">
          <div className="gl-nav"><div className="h-w">
            <ul>
              {groups.map((g) => (
                <li key={g.tag}><a href={`#${anchor(g.tag)}`}>{g.tag}</a></li>
              ))}
            </ul>
          </div></div>

          <div className="gl-trades">
            {groups.map((g, gi) => (
              // The room is the scene: its --pin drives the band, and the
              // stage inside it is what holds. The count and the bar are
              // drawn by CSS, so the page's visible text is unchanged.
              <section className={`gl-sec gl-room ${GROUNDS[gi % GROUNDS.length]}`} id={anchor(g.tag)} key={g.tag} data-scene style={{ "--n": g.keys.length } as CSSProperties}>
                <div className="gl-stage"><div className="h-w gl-room-w">
                  <div className="gl-room-hd">
                    <h2>{g.tag}</h2>
                    <span aria-hidden="true" className="gl-room-meta" data-t={`${g.keys.length} photographs`}><i /></span>
                  </div>
                  {/* The alt stays even though nothing is written on the
                      page: it is what a screen reader and an image search
                      get. No square is priority: the Cover's photo is the
                      page's LCP image. The first room's squares are eager,
                      not deferred: a reload lands on them, and deferred
                      they painted as empty mounts before popping in. */}
                  <div className="gl-row"><ul className="gl-strip">
                    {g.keys.map((k) => (
                      <li key={k}><div className="gl-sq">
                        <Shot name={k} variant={{ ratio: "1x1", widths: squareWidths(k) }} sizes={SQUARE_SIZES} defer={gi > 0} eager={gi === 0} />
                      </div></li>
                    ))}
                  </ul></div>
                </div></div>
              </section>
            ))}
          </div>
        </div>

        {/* The close: the Cover's bookend, components/site/Close.tsx. The
            heading waits on paper and the photo rises behind it. */}
        <Close lines={["Want yours to", "look like this?"]} photo="tall3" position="50% 70%">
          <p className="h-lede">Free on-site quotes across Your City.</p>
          <a className="h-btn h-btn-light" href="/quote">Get a free quote</a>
          <small>Or call <a href={telHref}>{site.phone}</a>.</small>
        </Close>
      </main>
      <SiteFooter />
    </div>
  );
}
