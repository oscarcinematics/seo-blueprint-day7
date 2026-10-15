// One <img> for every photo on the site.
//
// Plain <img>, not next/image: the site is a static export (next.config.mjs
// `output: "export"`), so there is no server to optimise on request. The
// variants are built ahead of time into public/images/work and listed in
// lib/photos.ts, which is the same result with none of the runtime.
//
// width/height are always the intrinsic size of the largest variant. They are
// what stops the layout shifting while a photo loads - the aspect box in CSS
// crops, but the browser needs the ratio before the bytes arrive.
import { photos, type PhotoKey } from "@/lib/photos";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { cloneElement } from "react";

export default function Shot({
  name,
  sizes,
  priority = false,
  className,
  alt,
  position,
  crop,
  variant,
  defer = false,
  eager = false,
}: {
  name: PhotoKey;
  /** What width this photo actually renders at. Wrong sizes = the wrong file downloaded. */
  sizes: string;
  /** True for anything above the fold, and for nothing else. */
  priority?: boolean;
  className?: string;
  /** Overrides the library alt only where the surrounding copy changes what the photo is saying. */
  alt?: string;
  /**
   * object-position for THIS placement. Every photo is cropped by its box, and
   * centre is wrong whenever the subject is not in the middle - a pool sitting
   * in the top third of a portrait frame disappears out of a tall hero panel.
   * Set it where the crop would otherwise lose the thing the photo is of.
   */
  position?: string;
  /**
   * Serve a pre-cropped set at narrow widths, as `<picture><source media>`.
   *
   * Only worth it where the CSS box is a DIFFERENT aspect to the photo. A
   * portrait source in a 4/3 box downloads the full height and then throws the
   * top and bottom away - on the landscaping money page that was 44 percent of
   * the LCP image's bytes, 223KB to show 113KB worth of pixels. The cropped
   * file shows the IDENTICAL pixels (same centre crop object-fit makes), so
   * nothing changes on screen, only what crosses the wire.
   *
   * Files sit beside the originals as `<slug>-<ratio>-<width>.webp`. Generate
   * them from the 1600 master with sharp, `fit: "cover", position: "centre"`,
   * quality 80 - the same settings the rest of public/images/work was built at.
   */
  crop?: { ratio: string; widths: number[]; media: string; sizes: string };
  /**
   * Serve a pre-cropped set at EVERY width, as a plain <img>.
   *
   * Use this instead of `crop` when the CSS box is the same aspect at every
   * breakpoint, which is the usual case on a blog post: there is no second
   * shape to switch to, so `<picture>` buys nothing and costs something. It
   * also keeps width/height honest - they describe the cropped file rather
   * than the taller original, so the browser reserves the right box and
   * nothing shifts on load.
   *
   * `ratio` is the filename label and the shape, written as "16x9" or "4x3".
   * Files are generated exactly like `crop`'s: sharp, fit cover, centre,
   * quality 80, saved as `<slug>-<ratio>-<width>.webp`.
   */
  variant?: { ratio: string; widths: number[] };
  /** Gallery strips load near the viewport; DeferredPhotos supplies the loader. */
  defer?: boolean;
  /**
   * Load at once and decode before painting, without priority's high fetch
   * priority or preload. For the photos just under a Cover: a reload lands
   * there, and lazy or deferred loading painted them as empty boxes for a
   * few frames before they popped in (blog feature, first gallery room,
   * 6 Oct 2026).
   */
  eager?: boolean;
}) {
  const p = photos[name];
  // A variant swaps which files this <img> points at, and nothing else.
  const [rw, rh] = variant ? variant.ratio.split("x").map(Number) : [0, 0];
  const widths = variant ? variant.widths : p.widths;
  const stem = (w: number) => `/images/work/${p.slug}${variant ? `-${variant.ratio}` : ""}-${w}.webp`;
  const widest = widths[widths.length - 1];
  const src = stem(widest);
  const srcSet = widths.map((w) => `${stem(w)} ${w}w`).join(", ");
  // Optional in development; the production build generates every variant.
  // A picture source keeps WebP as the fallback for older browsers.
  const avif = (path: string) => path.replace("/work/", "/optimized/").replace(/\.webp$/, ".avif");
  const hasAvif = widths.every((w) => existsSync(join(process.cwd(), "public", avif(stem(w)))));
  const avifSet = widths.map((w) => `${avif(stem(w))} ${w}w`).join(", ");
  const cropSet = crop?.widths.map((w) => `/images/work/${p.slug}-${crop.ratio}-${w}.webp ${w}w`).join(", ");
  const hasCropAvif = crop && crop.widths.every((w) => existsSync(join(process.cwd(), "public", avif(`/images/work/${p.slug}-${crop.ratio}-${w}.webp`))));
  const img = (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      width={variant ? widest : p.w}
      height={variant ? Math.round((widest * rh) / rw) : p.h}
      alt={alt ?? p.alt}
      className={className}
      style={position ? { objectPosition: position } : undefined}
      loading={priority || eager ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      // sync above the fold: with async, a reload paints the hero's first
      // frames with an empty grey box where the photo goes. Measured 5 Oct
      // 2026: LCP unchanged, the photo simply arrives with the first paint.
      decoding={priority || eager ? "sync" : "async"}
    />
  );
  if (!crop && !hasAvif && !defer) return img;
  const picture = (deferred: boolean) => (
    <picture data-deferred-photo={deferred ? "" : undefined}>
      {hasCropAvif && <source media={crop!.media} sizes={crop!.sizes} type="image/avif" srcSet={deferred ? undefined : cropSet!.replaceAll("/work/", "/optimized/").replaceAll(".webp", ".avif")} data-srcset={deferred ? cropSet!.replaceAll("/work/", "/optimized/").replaceAll(".webp", ".avif") : undefined} />}
      {crop && <source media={crop.media} sizes={crop.sizes} type="image/webp" srcSet={deferred ? undefined : cropSet} data-srcset={deferred ? cropSet : undefined} />}
      {hasAvif && <source type="image/avif" sizes={sizes} srcSet={deferred ? undefined : avifSet} data-srcset={deferred ? avifSet : undefined} />}
      {deferred ? cloneElement(img, { src: undefined, srcSet: undefined, "data-src": src, "data-srcset": srcSet }) : img}
    </picture>
  );
  return (
    <>
      {priority && !crop && hasAvif && (
        <link rel="preload" as="image" type="image/avif" imageSrcSet={avifSet} imageSizes={sizes} fetchPriority="high" />
      )}
      {picture(defer)}
      {defer && <noscript>{picture(false)}</noscript>}
    </>
  );
}
