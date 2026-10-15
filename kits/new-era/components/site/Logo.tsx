// The client's logo, for the nav.
//
//   public/logo.svg        the lockup for light grounds (the paper nav bar)
//   public/logo-light.svg  the same for dark grounds: over a dark hero
//                          (data-head="over"), in the open phone menu, and as
//                          the footer sign-off
//
// KIT STATE: both files are neutral placeholders. Replace them with the
// client's own artwork at the same names (an SVG, or change the extension
// here and in SiteFooter.tsx). width/height are the artwork's own aspect; the
// rendered height is set in brand.css (.h-logo-img), so only the ratio
// matters. Update them to the real file's viewBox so nothing shifts on load.
//
// A plain <img>, not inline SVG: a logo is on every page, so it should be
// fetched once and cached, not re-sent in the HTML of each one. The link
// around it carries the accessible name, so the image is decorative.
//
// Two copies are rendered and brand.css shows one. If the lockup crowds the
// call button on narrow phones, add a <source media="(max-width:470px)">
// with a square mark inside each <picture>. The light one is
// loading="lazy", so on a page that never shows it the browser never fetches
// it (a display:none lazy image has no box to come into view).
//
// This is chrome, not copy. It never goes in a heading: a heading carries the
// business name as real text, so search engines and screen readers read it.
//
// Styles: app/brand.css part 1 (.h-logo).
const W = 300;
const H = 54;

export default function Logo() {
  return (
    <>
      <picture className="h-logo-ink">
        <img className="h-logo-img" src="/logo.svg" width={W} height={H} alt="" decoding="async" fetchPriority="high" />
      </picture>
      <picture className="h-logo-light">
        <img className="h-logo-img" src="/logo-light.svg" width={W} height={H} alt="" decoding="async" loading="lazy" />
      </picture>
    </>
  );
}
