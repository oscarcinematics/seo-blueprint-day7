// The footer, on every page. The NAP block here is the reference copy: it must
// match the Google Business Profile and every citation character for character.
//
// No street address and no claim of 24/7 unless context/proof says so: the
// footer gives the service area and the real hours.
//
// "What we do" lists the BUILT service pages, from content/services.ts
// (already filtered by publish date), so a page joins the footer the day it
// goes live and a link here never points at a 404. "All services" is always
// there.
import { site, telHref } from "@/lib/site.config";
import { services } from "@/content/services";

export default function SiteFooter() {
  return (
    <footer className="h-foot"><div className="h-w">
      <div className="h-foot-grid">
        <div className="h-foot-brand">
          <b>{site.name}</b>
          <p>{site.trades.join(", ")} across {site.city}. One line on what the business does and for whom.</p>
          <div className="h-badges"><span>ABN {site.abn}</span><span>Free quotes</span><span>00+ years</span></div>
        </div>
        <nav className="h-foot-col" aria-label="What we do">
          <span className="h-foot-h">What we do</span>
          {services.map((s) => <a key={s.id} href={s.href}>{s.name}</a>)}
          <a href="/services">All services</a>
        </nav>
        <nav className="h-foot-col" aria-label="Company">
          <span className="h-foot-h">Company</span>
          <a href="/about">About</a>
          <a href="/gallery">Gallery</a>
          <a href="/blog">Blog</a>
          <a href="/contact">Contact</a>
          <a href="/quote">Get a free quote</a>
          <a href={site.instagram} rel="me noopener" target="_blank">Instagram</a>
        </nav>
        <div className="h-foot-col h-foot-contact">
          <span className="h-foot-h">Contact</span>
          <a className="h-foot-tel" href={telHref}>{site.phone}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <table className="h-foot-tbl"><tbody>
            <tr><th scope="row">Based in</th><td>{site.region}</td></tr>
            <tr><th scope="row">Covers</th><td>All of {site.city}</td></tr>
            <tr><th scope="row">Quotes</th><td>Free, on site</td></tr>
            <tr><th scope="row">Hours</th><td>{site.hours}</td></tr>
          </tbody></table>
        </div>
      </div>
      {/* The sign-off: the client's logo lockup (the light one, made for
          dark grounds) run across the content width, never cropped
          (app/brand.css, Footer). Decorative - the name is already in the
          brand column - so the alt is empty. */}
      <img className="h-foot-mark" src="/logo-light.svg" width={300} height={54} alt="" loading="lazy" decoding="async" />
      <div className="h-foot-bar">
        <span>&copy; {new Date().getFullYear()} {site.name} &middot; ABN {site.abn}</span>
        <a href="/privacy-policy">Privacy</a>
        <a href="/terms">Terms</a>
      </div>
    </div>
    </footer>
  );
}
