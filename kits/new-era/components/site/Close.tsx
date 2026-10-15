// The inner-page close (round 7, 5 Oct 2026), the Cover's bookend. The
// Cover opens with the photograph leaving the words; the Close ends with it
// arriving under them. The heading sits on paper in ink; as the visitor
// scrolls, one photograph rises from the foot of the screen behind it until
// it fills the screen, its top edge passing up through the heading so each
// line turns from ink to ivory as the photo reaches it. Then the action
// (the page's own button and small line) settles in on the right.
//
//   <Close lines={["Get a price on", "your project"]} photo="wide12">
//     <a className="h-btn h-btn-light" href="/quote">Get a free quote</a>
//     <small>Or call <a href={telHref}>{site.phone}</a>.</small>
//   </Close>
//
// `lines` are the h2's own words, one line each: the h2 reads exactly as the
// lines joined by spaces. Keep it short (Display size, six words or so).
// As in the Cover, the heading is drawn twice - the real h2 in ink, clipped
// to the paper above the photo, and an aria-hidden ivory copy from data-t,
// clipped to the photo - so a word changes colour exactly at the edge.
// Static (JS off, reduced motion, phones): the finished full-bleed band.
// Choreography: brand.css "Close".
import { Fragment, type ReactNode } from "react";
import Shot from "./Shot";
import type { PhotoKey } from "@/lib/photos";

export default function Close({
  lines,
  photo,
  position,
  children,
}: {
  lines: readonly string[];
  photo: PhotoKey;
  /** object-position for the photo, which is cropped to the screen's shape. */
  position?: string;
  children?: ReactNode;
}) {
  return (
    <div className="h-close" data-scene>
      <section className="h-cl">
        {/* Decorative: the heading says what the band is for. */}
        <div className="h-cl-ph" aria-hidden="true"><Shot name={photo} sizes="100vw" alt="" position={position} /></div>
        <div className="h-cl-type">
          <div className="h-w h-cl-in">
            <h2 className="h-cl-h">
              {lines.map((l, i) => (
                <Fragment key={i}>
                  <span>{l}</span>
                  {i < lines.length - 1 ? " " : ""}
                </Fragment>
              ))}
            </h2>
          </div>
        </div>
        <div className="h-cl-ghost" aria-hidden="true">
          <div className="h-w h-cl-in">
            <div className="h-cl-h">{lines.map((l, i) => <span key={i} data-t={l} />)}</div>
          </div>
        </div>
        {children && (
          <div className="h-cl-acts">
            <div className="h-w h-cl-in"><div className="h-cl-act">{children}</div></div>
          </div>
        )}
      </section>
    </div>
  );
}
