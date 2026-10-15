// Privacy policy. Written against what this site ACTUALLY does - the fields on
// the two forms, Web3Forms as the only processor, a static export with no
// analytics and no cookies - rather than from a generic template. If a form
// field, an analytics tag or a tracking pixel is ever added, this page changes
// in the same commit.
import { site, telHref } from "@/lib/site.config";
import { gate } from "@/lib/unwritten";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import PageCss from "@/components/site/PageCss";

export const metadata = {
  ...gate("/privacy-policy"),
  title: { absolute: "Privacy Policy - Business Name" },
  description: "How Business Name collects, uses and stores the information you send through this website.",
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
          <Breadcrumbs trail={[{ label: "Privacy policy" }]} />
          <h1>Privacy policy</h1>
          <p className="h-lede">This policy covers {site.name} (ABN {site.abn}) and this website. Last updated 1 January 2026.</p>
        </div></section>

        {/* The document: each heading in the left four columns as a side
            head, its paragraphs in a reading column on the right, every
            heading row under one hairline across the page (legal.css). */}
        <div className="h-w lg-doc">
          <h2>What we collect</h2>
          <p>Only what you type into a form on this site:</p>
          <ul>
            <li>Your name</li>
            <li>Your phone number</li>
            <li>Your email address, if you give one</li>
            <li>Your suburb, on the quote form</li>
            <li>What the job is, and anything else you write in the message box</li>
            <li>The page the form was sent from</li>
          </ul>
          <p>If you call or email instead, we hold whatever you tell us on the call or in the email.</p>

          <h2>What we do with it</h2>
          <p>Quote your job and contact you about it. That is the whole list. We do not sell it, rent it, trade it, or send marketing to people who only asked for a price.</p>

          <h2>Who else sees it</h2>
          <p>Form submissions are delivered by Web3Forms, which passes the message to our email inbox. Their privacy policy is at <a href="https://web3forms.com/privacy" rel="noopener" target="_blank">web3forms.com/privacy</a>. Email is held by our email provider. Beyond those two, nobody, unless we are required to hand something over by law.</p>

          <h2>Cookies and tracking</h2>
          <p>This website sets no cookies of its own and runs no advertising or analytics trackers. Fonts and images are served from the same domain as the site, so no third party is contacted just by loading a page.</p>

          <h2>How long we keep it</h2>
          <p>Enquiries stay in our email for as long as they are useful for quoting and for the tax records we are required to keep. If you ask us to delete yours, we delete it.</p>

          <h2>Getting at it, or getting rid of it</h2>
          <p>Email <a href={`mailto:${site.email}`}>{site.email}</a> or call <a href={telHref}>{site.phone}</a> and ask for a copy of what we hold about you, a correction to it, or for it to be deleted. There is no charge.</p>

          <h2>Complaints</h2>
          <p>Tell us first, at the address above. If you are not satisfied with how we handle it, you can take the complaint to the Office of the Australian Information Commissioner at <a href="https://www.oaic.gov.au" rel="noopener" target="_blank">oaic.gov.au</a>.</p>

          <h2>Changes</h2>
          <p>If this policy changes, the date at the top changes with it.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
