// Contact. Phone and email come from lib/site.config.ts so they cannot drift
// from the footer and the schema - the usual way a trade site ends up with two
// different phone numbers and a NAP that no longer matches the GBP.
//
// Three scenes, on the shared blocks.
//   Cover   the shared opening (components/site/Cover.tsx): the h1 as the
//           lockup over a darkened photo that closes into a plate
//   Main    night ground. The phone number is the largest thing in it, the
//           three other ways in sit under it, and that column is HELD beside
//           the form (sticky) with a photo under it that pans sideways
//           across the scroll, while the form on its paper panel passes
//   Close   the shared close (components/site/Close.tsx): the photo rises
//           behind "Or skip straight to a price"
// The form's #lead-form anchor is what every "send the form" link lands on.
// Layout and choreography: app/pages/contact.css.
import { site, telHref } from "@/lib/site.config";
import { gate } from "@/lib/unwritten";
import HomeReveal from "@/components/HomeReveal";
import LeadForm from "@/components/LeadForm";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Cover from "@/components/site/Cover";
import Close from "@/components/site/Close";
import Shot from "@/components/site/Shot";
import PageCss from "@/components/site/PageCss";

export const metadata = {
  ...gate("/contact"),
  title: { absolute: "Contact Business Name - Your City Your Trade Team" },
  description: "Contact Business Name in Your City. Call (555) 010-0199, email hello@example.com, or send a message about your job. Ask for a free on-site quote.",
};

const icon = { viewBox: "0 0 24 24", width: 18, height: 18, fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export default function Page() {
  return (
    <div className="h-page" data-head="over">
      <SiteHeader current="/contact" />
      <main>
        <PageCss file="contact.css" />
        <HomeReveal />

        {/* The opening: the business name as the accent, CONTACT in the caps.
            A wide frame of a finished job with the sky as a strip at the top,
            under the header's shade, so the words sit on the work. */}
        <Cover
          crumbs={[{ label: "Contact" }]}
          lines={[["Business Name", "a"], ["Contact", "c"]]}
          lede="Call, email, or send the form. Whichever is easier."
          photo="wide6"
          position="50% 64%"
        />

        {/* The main section, on night. The form comes first in the source
            (it is the #lead-form anchor every "send the form" link lands
            on); the grid puts it on the right, on a paper panel, and the
            details on the left. The details and the photo share one column
            (.ct-side), which is held beside the form on desktop, so the
            number stays on screen while someone fills the form in. The
            photo pans sideways inside its frame across the section's pass
            (contact.css). Phones: details, photo, then the form. */}
        <section className="h-night ct-main" data-scene><div className="h-w ct-grid">
          <div id="lead-form" className="c-form ct-form">
            <h2 className="h-h2s ct-title" data-split>Send a message</h2>
            <p className="c-intro">If it is a quote you want, <a href="/quote">the quote form</a> asks the right questions and comes back faster.</p>
            <LeadForm subject={`New enquiry from the ${site.name} contact page`}>
              <div className="c-row">
                <label className="c-field"><span>Name <em>*</em></span><input name="name" required autoComplete="name" placeholder="Your name" /></label>
                <label className="c-field"><span>Phone <em>*</em></span><input name="phone" type="tel" required autoComplete="tel" placeholder="Your phone number" /></label>
              </div>
              <label className="c-field"><span>Email</span><input name="email" type="email" autoComplete="email" placeholder="Your email address" /></label>
              <label className="c-field"><span>Message <em>*</em></span><textarea name="message" rows={5} required placeholder="What you need, and the suburb it is in." /></label>
              <small>Used to answer you and nothing else. See the <a href="/privacy-policy">privacy policy</a>.</small>
              <button type="submit" className="h-btn">Send it <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg></button>
            </LeadForm>
          </div>

          <div className="ct-side">
            <aside className="ct-direct" aria-label="Direct contact details">
              <span className="h-label ct-label">Get hold of us</span>
              <a className="ct-tel" href={telHref}>{site.phone}</a>
              <div className="ct-lines">
                <a className="ct-line" href={`mailto:${site.email}`}><i><svg {...icon}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg></i>{site.email}</a>
                <div className="ct-line"><i><svg {...icon}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg></i>{site.region}, working all of {site.city}</div>
                <a className="ct-line" href={site.instagram} rel="noopener" target="_blank"><i><svg {...icon}><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></svg></i>Instagram</a>
              </div>
            </aside>
            {/* A wide frame, so the pan has a whole job to travel along. Not
                the LCP image (that is the cover), so it loads lazily. The
                <img> is wider than the frame on purpose; sizes is its
                rendered width. */}
            <div className="ct-ph"><div className="ct-ph-sc"><Shot name="wide5" sizes="(max-width:999px) 120vw, (min-width:1440px) 800px, 56vw" position="50% 58%" /></div></div>
          </div>
        </div></section>

        {/* The close: the Cover's bookend. The heading waits on paper and a
            photo no other page ends on rises behind it. */}
        <Close lines={["Or skip straight", "to a price"]} photo="wide4" position="50% 70%">
          <a className="h-btn h-btn-light" href="/quote">Get a free quote</a>
          <small>Free, measured on site, nothing owed after it.</small>
        </Close>
      </main>
      <SiteFooter />
    </div>
  );
}
