import type { Metadata } from "next";
// app/globals.css is NOT imported. It holds a comment and nothing else - every
// real rule is read off disk and inlined below - but importing it still made
// Next emit /_next/static/css/<hash>.css and link it as a blocking stylesheet
// on every page. Lighthouse measured that empty file costing 158ms of
// render-blocking time. The file stays on disk; only the import is gone, so
// the day a rule genuinely belongs in a bundled stylesheet, add it back.
import { site } from "@/lib/site.config";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Read at build time and inlined in <head>. Routed through a CSS pipeline the
// custom properties resolve to empty strings at runtime, so they are read off
// disk instead. Order matters: brand.css re-declares ds.css tokens.
// Minified on the way in, at BUILD time only - the files on disk keep their
// comments and their formatting. Lighthouse flagged the inlined sheet as
// unminified (2KB on every page), and since this text is pasted into the head
// of every page it is paid for on every single request.
const squeeze = (s: string) =>
  s
    .replace(/\/\*[\s\S]*?\*\//g, "")   // comments
    .replace(/\s+/g, " ")                // runs of whitespace
    .replace(/\s*([{};,>])\s*/g, "$1")  // space around the syntax
    .trim();
// Read inside RootLayout, not at module load: the static export reads each
// file once per page at build time either way, and on `next dev` this makes
// CSS edits show on the next reload instead of needing a server restart.
const css = (f: string) => squeeze(readFileSync(join(process.cwd(), "app", f), "utf8"));

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | ${site.city}`, template: `%s | ${site.name}` },
  description: site.tagline,
  // Share preview, set once. Next fills og:title and og:description from each
  // page's own title/description, so a page only overrides these when it wants
  // a different image. og:url is deliberately NOT set here - at the root it
  // stamps the homepage URL onto every page; left out, Next resolves it per
  // page from that page's canonical (see lib/unwritten.ts).
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_AU",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name} - ${site.tagline}` }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

// ONE canonical business entity for the whole site, emitted in <head> on every
// page. Individual pages carry their own Service, FAQPage and BreadcrumbList
// blocks; those reference this node by @id rather than redeclaring the NAP,
// which is how name, phone and email stay identical everywhere.
//
// Two fields a trade schema usually carries are missing ON PURPOSE until
// context/proof/proof-inventory.md holds them:
//   address       - a street address only once the owner publishes one. A
//                   PostalAddress with only a locality is legal; a
//                   fabricated street is not.
//   aggregateRating - only real reviews. Marking up a rating that does not
//                   exist is a manual action.
// Add each the day the real value lands, and nowhere else.
//
// `@type`: HomeAndConstructionBusiness suits most trades. Pick the closest
// schema.org LocalBusiness subtype for the client (Plumber, Electrician,
// HVACBusiness, RoofingContractor...).
const businessSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HomeAndConstructionBusiness",
      "@id": `${site.url}/#business`,
      name: site.name,
      url: `${site.url}/`,
      telephone: site.phone,
      email: site.email,
      description: `${site.trades.join(", ")} across ${site.city}.`,
      image: `${site.url}/og.png`,
      // PNG, not the SVG: Google's logo and favicon pickers want a raster
      // file. The same mark as app/icon.png (both placeholders in the kit).
      logo: `${site.url}/logo-mark.png`,
      sameAs: [site.instagram, site.facebook],
      priceRange: "$$",
      currenciesAccepted: "AUD",
      address: { "@type": "PostalAddress", addressLocality: site.city, addressRegion: site.state, addressCountry: site.country },
      areaServed: { "@type": "City", name: site.city },
      knowsAbout: [...site.trades],
      // The real hours, from lib/site.config.ts. Never 24/7 without an
      // answering service: a profile that claims one earns a bad review the
      // first time nobody picks up on a Sunday.
      openingHoursSpecification: site.hoursSpec.map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [...h.days],
        opens: h.opens,
        closes: h.closes,
      })),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${site.name} services`,
        itemListElement: site.trades.map((t) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: t } })),
      },
    },
    {
      "@type": "Organization",
      "@id": `${site.url}/#org`,
      name: site.name,
      url: `${site.url}/`,
      telephone: site.phone,
      email: site.email,
      logo: `${site.url}/logo-mark.png`,
      sameAs: [site.instagram, site.facebook],
      address: { "@type": "PostalAddress", addressLocality: site.city, addressRegion: site.state, addressCountry: site.country },
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: `${site.url}/`,
      // Google reads this for the site name above the result. Without it the
      // result shows the bare domain, as the old Squarespace listing did.
      name: site.name,
      alternateName: [new URL(site.url).hostname],
      publisher: { "@id": `${site.url}/#org` },
      inLanguage: "en-AU",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ds = css("ds.css");
  const fontCss = css("fonts.css");
  const brandCss = css("brand.css");
  // suppressHydrationWarning: on `next dev` the motion script classes <html>
  // with .h-js before React hydrates (see components/HomeReveal.tsx).
  // It covers <html>'s own attributes only, nothing below it.
  return (
    <html lang="en-AU" suppressHydrationWarning>
      <head>
        {/* Both faces are self-hosted (public/fonts), so there is no third-party
            preconnect. Epilogue sets every heading, which is the LCP text on
            most inner pages; Instrument Sans sets the body. Each is one
            variable file. */}
        <link rel="preload" as="font" type="font/woff2" href="/fonts/epilogue.woff2" crossOrigin="anonymous" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/instrument-sans.woff2" crossOrigin="anonymous" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/epilogue-italic.woff2" crossOrigin="anonymous" />
        <meta name="theme-color" content="#f2f0eb" />
        <style dangerouslySetInnerHTML={{ __html: ds }} />
        <style dangerouslySetInnerHTML={{ __html: fontCss }} />
        <style dangerouslySetInnerHTML={{ __html: brandCss }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
