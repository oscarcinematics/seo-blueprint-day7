// The nav, on every page. `current` marks the active top-level link.
//
// Six links and nothing else, per references/pyramid-structure.md - the spec's
// point is that the nav does not sprawl, not that the count is five. /gallery
// is in it because it is the page people go looking for on a trade site, and
// a gallery reachable only from the footer gets built and then never found.
// /blog is in the nav even before it has posts: the gate requires every main
// page to reach both indexes, and an index nothing links to is an orphan the
// day its first post lands. The page stays noindex until then -
// lib/unwritten.ts.
import { site, telHref } from "@/lib/site.config";
import Logo from "@/components/site/Logo";

const links = [
  ["/", "Home"],
  ["/services", "Services"],
  ["/gallery", "Gallery"],
  ["/blog", "Blog"],
  ["/about", "About"],
  ["/contact", "Contact"],
] as const;

// Layout (app/brand.css, Header): logo left, the six links centred, phone
// and the quote button right. Under 1000px the links are hidden and a
// CSS-only <details> burger opens them as a full-screen night panel. The
// <details> holds ONLY the burger; the panel is the same <nav> below it,
// restyled through the sibling selector, so the six links exist once in the
// HTML at every width. The burger has an aria-label and draws its two lines
// in CSS, so it adds no visible text.
export default function SiteHeader({ current }: { current?: string }) {
  return (
    <header className="h-head">
      <div className="h-nav"><div className="h-w h-nav-in">
        <a className="h-logo" href="/" aria-label={`${site.name} home`}>
          <Logo />
        </a>
        <details className="h-menu">
          <summary aria-label="Menu" />
        </details>
        <nav className="h-links" aria-label="Main">
          {links.map(([href, label]) => (
            <a key={href} href={href} aria-current={href === current ? "page" : undefined}>{label}</a>
          ))}
        </nav>
        <div className="h-act">
          <a className="h-tel" href={telHref} aria-label={`Call ${site.phone}`}>
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            <span>{site.phone}</span>
          </a>
          <a className="h-btn h-btn-sm" href="/quote">Free quote</a>
        </div>
      </div></div>
    </header>
  );
}
