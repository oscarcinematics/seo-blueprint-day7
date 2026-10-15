// The inner-page opening (round 7, 5 Oct 2026): the homepage hero's
// materials with the opposite move. It opens where the homepage hero ends -
// one photograph full bleed, the page's h1 as the lockup in ivory over it,
// and the page's own intro on a glass panel - and as the visitor scrolls the
// photograph closes in from below into a framed plate at the top of the
// screen. Its lower edge rises through the heading and the intro, so each
// line turns from ivory to ink as the photo leaves it and the glass is cut
// away with the photo, ending on the title row: plate above, heading on the
// left, intro on the right. The homepage opens out to welcome you; the inner
// pages close in to get to the point.
//
//   <Cover crumbs={[{ label: "Services" }]} photo="tall3"
//     lines={[["Your Trade", "c"], ["Services", "c"], ["in Your City", "a"]]}
//     lede="..." />
//
// `lines` are the h1's own words, one line each, in order: "c" is a line of
// the lockup's tracked caps, "a" the italic accent (brand.css "Lockup"). The
// h1 reads exactly as the lines joined by spaces, so the heading text is
// unchanged by the line breaks.
//
// The heading and intro are drawn twice, as the homepage hero's heading is:
// the real ones in ink, clipped to everything OUTSIDE the photo's window,
// and an aria-hidden copy in ivory clipped to the window. The copy's words
// come from CSS (data-t), so it adds no text to the page. The glass is its
// own layer under both, because a backdrop blur inside a clipped layer has
// nothing behind it to blur. The breadcrumb sits apart, in the photo's top
// corner for the whole scene, so its links are always on screen and live.
// Choreography: brand.css "Cover".
import { Fragment, type CSSProperties } from "react";
import Breadcrumbs from "./Breadcrumbs";
import Shot from "./Shot";
import type { PhotoKey } from "@/lib/photos";

type Line = readonly [words: string, voice: "c" | "a"];

export default function Cover({
  crumbs,
  lines,
  lede,
  photo,
  position,
  fit,
}: {
  crumbs: { href?: string; label: string }[];
  lines: readonly Line[];
  /** The page's own intro line, on the glass. Leave it out when the page
   * has none: the cover is then the photo and the heading. */
  lede?: string;
  photo: PhotoKey;
  /** object-position for the photo, which is cropped to the screen's shape. */
  position?: string;
  /** The longest caps word's width in em, when it is wider than LANDSCAPING
   * (6.78em): keeps it inside a phone's gutters. Measure it on the page. */
  fit?: number;
}) {
  const cls = (v: Line[1]) => (v === "a" ? "lk-a" : "lk-c");
  // The copy's words carry the same --i the script gives the h1's words, so
  // the two layers rise together.
  let i = 0;
  const ghost = lines.map(([words, v], li) => (
    <Fragment key={li}>
      <span className={cls(v)}>
        {words.split(" ").map((w, wi) => (
          <Fragment key={wi}>
            {wi > 0 ? " " : ""}
            <span className="sw"><span className="si" data-t={w} style={{ "--i": i++ } as CSSProperties} /></span>
          </Fragment>
        ))}
      </span>
      {li < lines.length - 1 ? " " : ""}
    </Fragment>
  ));

  return (
    <section className="h-cover" data-scene style={fit ? ({ "--cw": fit } as CSSProperties) : undefined}>
      <div className="h-cv-stage">
        <div className="h-cv-ph"><div className="h-cv-sc"><Shot name={photo} sizes="100vw" priority position={position} /></div></div>
        {lede && <div className="h-w h-cv-in h-cv-pane" aria-hidden="true"><i data-t={lede} /></div>}
        <div className="h-cv-type">
          <div className="h-w h-cv-in">
            <h1 className="lk" data-split>
              {lines.map(([words, v], li) => (
                <Fragment key={li}>
                  <span className={cls(v)}>{words}</span>
                  {li < lines.length - 1 ? " " : ""}
                </Fragment>
              ))}
            </h1>
            {lede && <p className="h-cv-lede">{lede}</p>}
          </div>
        </div>
        <div className="h-cv-ghost" aria-hidden="true">
          <div className="h-w h-cv-in">
            <div className="h-cv-gh lk" data-split>{ghost}</div>
            {lede && <p className="h-cv-lede" data-t={lede} />}
          </div>
        </div>
        <div className="h-cv-crumb"><Breadcrumbs trail={crumbs} /></div>
        <span className="h-cv-cue" aria-hidden="true" />
      </div>
    </section>
  );
}
