// Terms of use - for the WEBSITE only.
//
// Deliberately not trading terms. Payment schedules, variations, defects
// liability and warranty periods are commercial terms that belong on the quote
// and the contract, and none of them has been confirmed for this business.
// Inventing them here would put wording in front of a customer that the
// business has never agreed to.
import { site, telHref } from "@/lib/site.config";
import { gate } from "@/lib/unwritten";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import PageCss from "@/components/site/PageCss";

export const metadata = {
  ...gate("/terms"),
  title: { absolute: "Terms of Use - Business Name" },
  description: "The terms that apply to using the Business Name website.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <div className="h-page">
      <SiteHeader />
      <main className="lg">
        <PageCss file="legal.css" />
        {/* The title row (round 6's .h-open, brand.css): breadcrumb, the h1
            on the first seven columns, and the document's own first line,
            who it covers and when it changed, on the last four. A hairline
            closes it. CSS only: the h1 and line nudge up as the page loads,
            the hairline draws across, and nothing else on the page moves. */}
        <section className="h-open lg-open"><div className="h-w">
          <Breadcrumbs trail={[{ label: "Terms of use" }]} />
          <h1>Terms of use</h1>
          <p className="h-lede">These terms apply to this website, operated by {site.name} (ABN {site.abn}). Last updated 1 January 2026.</p>
        </div></section>

        {/* The document: each heading in the left four columns as a side
            head, its paragraphs in a reading column on the right, every
            heading row under one hairline across the page (legal.css). */}
        <div className="h-w lg-doc">
          <h2>This site is not a quote</h2>
          <p>Everything here describes the kind of work we do. Nothing on it is an offer, a price, or a commitment to do a particular job. A price only exists once we have measured your site and sent you a written quote, and the terms of the work are the ones in that quote.</p>

          <h2>The photographs</h2>
          <p>Every photo on this site is of a job completed by {site.name} and is our copyright. Please do not reuse them. They show what was built, not what any future job will cost, take, or look like - every site is different.</p>

          <h2>Accuracy</h2>
          <p>We keep the site accurate and up to date as best we can. Materials, methods and availability change, so treat what is written here as a description rather than a specification.</p>

          <h2>Links out</h2>
          <p>Where this site links to somewhere else - Instagram, or our form provider&apos;s privacy policy - we do not control that site and are not responsible for it.</p>

          <h2>Using the site</h2>
          <p>Do not use the forms to send abuse, spam, or anything unlawful. Do not copy the site&apos;s text, photographs or code for use on another business&apos;s website.</p>

          <h2>Privacy</h2>
          <p>How we handle anything you send us is set out in the <a href="/privacy-policy">privacy policy</a>.</p>

          <h2>Governing law</h2>
          <p>These terms are governed by the laws of Your State, Australia.</p>

          <h2>Questions</h2>
          <p>Email <a href={`mailto:${site.email}`}>{site.email}</a> or call <a href={telHref}>{site.phone}</a>.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
