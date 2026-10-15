import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { site, telHref } from "@/lib/site.config";

export const metadata = { title: { absolute: `Page not found - ${site.name}` }, robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <div className="h-page">
      <SiteHeader />
      <main>
        <section className="h-phero"><div className="h-w">
          <h1><span className="n-ne">{site.name}</span> Wrong Turn</h1>
          <p>That page is not here. These ones are.</p>
          <ul className="n-chips">
            <li><a href="/">Home</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/quote">Free quote</a></li>
          </ul>
          <p style={{ marginTop: "28px" }}>Or call {site.name} on <a href={telHref} style={{ color: "var(--h-cta)", fontWeight: 700 }}>{site.phone}</a>.</p>
        </div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
