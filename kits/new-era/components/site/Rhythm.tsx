// The photo rhythm block: a row of square close-ups, then (optionally) one
// breather photograph edge to edge: wide shot, close-ups, wide again. Not
// placed on any kit page today. Where it is used: once per page, always
// between two sections and never inside a scene.
//
//   <Rhythm closeUps={["detail1", "detail9", "detail5"]} breather="wide14" />
//   <Rhythm closeUps={[...]} bleed />   the gallery: the close-ups ARE the breather
//
// No words on purpose: the block adds photographs and nothing to read, so the
// page's text and headings are exactly what they were. Each close-up's alt
// comes from lib/details.ts and the breather's from lib/photos.ts. Both kinds
// are lazy, carry width and height (nothing shifts as they arrive), and sit
// in a below-the-fold .h-cv block that the browser skips until it is near.
// The styles travel with the block (app/pages/rhythm.css).
import PageCss from "./PageCss";
import Shot from "./Shot";
import { details, type DetailKey } from "@/lib/details";
import { photos, type PhotoKey } from "@/lib/photos";

/** One close-up: a plain <img> over its square files, like Shot's variants. */
function CloseUp({ name, sizes }: { name: DetailKey; sizes: string }) {
  const d = details[name];
  const stem = (w: number) => `/images/work/${d.slug}-1x1-${w}.webp`;
  return (
    <img
      src={stem(d.widths[d.widths.length - 1])}
      srcSet={d.widths.map((w) => `${stem(w)} ${w}w`).join(", ")}
      sizes={sizes}
      width={d.w}
      height={d.h}
      alt={d.alt}
      loading="lazy"
      decoding="async"
    />
  );
}

export default function Rhythm({
  closeUps,
  breather,
  position,
  bleed = false,
}: {
  /** Two or three close-ups, in the order they sit. */
  closeUps: DetailKey[];
  /** The edge-to-edge photograph after the row. Pick one this page does not already show. */
  breather?: PhotoKey;
  /** object-position for the breather, where centre would lose the subject. */
  position?: string;
  /** The gallery's version: the close-ups themselves run edge to edge. */
  bleed?: boolean;
}) {
  // What each close-up renders at, for its srcset. In the row: four of twelve
  // columns (30vw, at most 440px), and on phones half the width, or all of it
  // for the third. In the bleed band: a third of the screen, and on phones
  // the first takes the full width and the other two half each.
  const sizes = (i: number) =>
    bleed
      ? `(max-width:700px) ${i === 0 ? "100vw" : "50vw"}, 34vw`
      : `(max-width:700px) ${i === 2 ? "calc(100vw - 40px)" : "calc(50vw - 25px)"}, (max-width:1440px) 30vw, 440px`;
  // On phones the breather is a 4:5 portrait box, so a landscape photo fills
  // it by HEIGHT and renders wider than the screen: 1.25 times its own aspect.
  const air = breather ? Math.ceil(125 * (photos[breather].w / photos[breather].h)) : 0;
  return (
    <div className={`rh h-cv${bleed ? " rh-bleed" : ""}${breather || bleed ? "" : " rh-solo"}`} data-n={closeUps.length}>
      <PageCss file="rhythm.css" />
      <div className={bleed ? "rh-row" : "h-w h-grid rh-row"}>
        {closeUps.map((k, i) => (
          <figure className="rh-cu" key={k}>
            <CloseUp name={k} sizes={sizes(i)} />
          </figure>
        ))}
      </div>
      {breather && (
        <div className="rh-air">
          <Shot name={breather} sizes={`(max-width:700px) ${air}vw, 100vw`} position={position} />
        </div>
      )}
    </div>
  );
}
