// Quote - the conversion target. ONE primary action on the page: the form.
// Phone and email are present but secondary; nothing else competes with it.
// Per references/pyramid-structure.md the booking calendar does NOT live here -
// it belongs on /thank-you, the instant after someone converts.
//
// Built on /contact's frontend, so the two forms read as one pair. Three
// parts:
//   Cover   the shared opening (components/site/Cover.tsx): the h1 as the
//           lockup over a darkened photo that closes into a plate
//   Main    night ground. The form, with the three steps above it, on a
//           paper panel; beside it the direct line, the number largest, HELD
//           (sticky) with a photo under it that pans sideways across the
//           scroll while the form passes
//   FAQ     "Three things that speed a quote up", on paper: the heading is
//           held while the questions pass, the homepage's quiet FAQ scene
// The form's #lead-form anchor is what every "Free quote" link lands on.
// Layout and choreography: app/pages/quote.css.
import { site, telHref } from "@/lib/site.config";
import { gate } from "@/lib/unwritten";
import HomeReveal from "@/components/HomeReveal";
import LeadForm from "@/components/LeadForm";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Cover from "@/components/site/Cover";
import Shot from "@/components/site/Shot";
import PageCss from "@/components/site/PageCss";

export const metadata = {
  ...gate("/quote"),
  title: { absolute: "Free Your Trade Quote Your City | Business Name" },
  description: "Free on-site quotes across Your City. Tell Business Name what the job is and where, and someone comes out and measures it. Call (555) 010-0199.",
};

const icon = { viewBox: "0 0 24 24", width: 18, height: 18, fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

// The job types, in the owner's words: one per service, then "Something else".
const jobs = [...site.trades, "Something else"];

export default function Page() {
  return (
    <div className="h-page" data-head="over">
      <SiteHeader />
      <main>
        <PageCss file="quote.css" />
        <HomeReveal />

        {/* The opening, as on /contact: the business name as the accent,
            FREE QUOTE in the caps. The photo is the job a quote is for,
            finished. */}
        <Cover
          crumbs={[{ label: "Free quote" }]}
          lines={[["Business Name", "a"], ["Free Quote", "c"]]}
          lede="Tell us what the job is and where. Someone comes out, measures it and prices it."
          photo="wide1"
          position="50% 62%"
        />

        {/* The main section, on night, as /contact's. The form comes first in
            the source (it is the #lead-form anchor every "Free quote" link
            lands on); the grid puts it on the right, on a paper panel, with
            the steps leading it as a small numbered row (the numbers are CSS
            counters, not text). The direct line and the photo share one
            column (.qt-side), held beside the form on desktop so the number
            stays on screen while the form is filled in; the photo pans
            sideways inside its frame across the section's pass (quote.css).
            Phones: the number, the photo, then the form. */}
        <section className="h-night qt-main" data-scene><div className="h-w qt-grid">
          <div id="lead-form" className="c-form qt-form">
            <ol className="c-steps qt-steps">
              <li className="is-now"><i></i>Send the details</li>
              <li><i></i>We come and measure</li>
              <li><i></i>You get a price</li>
            </ol>
            <h2 className="h-h2s qt-title" data-split>Ask for a price</h2>
            <p className="c-intro">Everything marked with an asterisk is needed to call you back. The rest just makes the quote faster.</p>
            <LeadForm subject={`New quote request from the ${site.name} website`}>
              <div className="c-row">
                <label className="c-field"><span>Name <em>*</em></span><input name="name" required autoComplete="name" placeholder="Your name" /></label>
                <label className="c-field"><span>Phone <em>*</em></span><input name="phone" type="tel" required autoComplete="tel" placeholder="Your phone number" /></label>
              </div>
              <div className="c-row">
                <label className="c-field"><span>Email</span><input name="email" type="email" autoComplete="email" placeholder="Your email address" /></label>
                <label className="c-field"><span>Suburb <em>*</em></span><input name="suburb" required autoComplete="address-level2" placeholder="Your suburb" /></label>
              </div>
              <label className="c-field"><span>What is the job <em>*</em></span>
                <select name="job" required defaultValue="">
                  <option value="" disabled>Pick the closest one</option>
                  {jobs.map((j) => <option key={j} value={j}>{j}</option>)}
                </select>
              </label>
              <label className="c-field"><span>Anything else worth knowing</span><textarea name="message" rows={4} placeholder="Rough size, access, whether there is a deadline, what you want it to end up like." /></label>
              <small>Used to quote your job and nothing else. See the <a href="/privacy-policy">privacy policy</a>.</small>
              <button type="submit" className="h-btn">Send it <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg></button>
            </LeadForm>
          </div>

          <div className="qt-side">
            <aside className="qt-direct" aria-label="Direct contact details">
              <span className="h-label qt-label">Rather just call</span>
              <a className="qt-tel" href={telHref}>{site.phone}</a>
              <div className="qt-lines">
                <a className="qt-line" href={`mailto:${site.email}`}><i><svg {...icon}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg></i>{site.email}</a>
                <div className="qt-line"><i><svg {...icon}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg></i>{site.region}, all of {site.city}</div>
                <div className="qt-line"><i><svg {...icon}><path d="M20 6 9 17l-5-5" /></svg></i>Free, and nothing owed after it</div>
              </div>
            </aside>
            {/* A long, wide frame, so the pan has a whole view to travel
                along, and a photo no other page shows here. Not the LCP image
                (that is the cover), so it loads lazily. The <img> is wider
                than the frame on purpose; sizes is its rendered width. */}
            <div className="qt-ph"><div className="qt-ph-sc"><Shot name="wide12" sizes="(max-width:999px) 120vw, (min-width:1440px) 800px, 56vw" position="50% 60%" /></div></div>
          </div>
        </div></section>

        {/* Before you send it: the heading is held on the left while the
            three questions pass on the right, and only the hairlines between
            them draw as each arrives (quote.css). On paper, so the page
            steps cover, night, paper, then the night footer. */}
        <section className="h-sec qt-faq"><div className="h-w qt-faq-g">
          <div className="qt-faq-head">
            <p className="h-kicker">Before you send it</p>
            <h2 className="h-h2s">Three things that speed a quote up</h2>
          </div>
          <div className="h-faqs" data-scene>
            <details className="h-faq" data-scene><summary>Roughly how big is the area?</summary><p>Paces are fine. &quot;About twelve metres by six&quot; is enough to know whether it is a day or a fortnight.</p></details>
            <details className="h-faq" data-scene><summary>How do we get in?</summary><p>Whether a vehicle can reach the work, any stairs or tight spots, and how far it is from the street. Access is often the single biggest thing between two prices for the same job.</p></details>
            <details className="h-faq" data-scene><summary>What do you want it to end up like?</summary><p>A photo of something you like says more than a paragraph. There are photos against every service on <a href="/services">our services</a> if you want a starting point.</p></details>
          </div>
        </div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
