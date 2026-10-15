// /thank-you - OFF the pyramid, and mandatory.
//
// Every form redirects here (components/LeadForm.tsx), and this is the URL a
// conversion tag fires on. Four properties are deliberate, not oversights, per
// references/pyramid-structure.md:
//   noindex            if it ranks, people land here without converting and the
//                      conversion count becomes fiction
//   out of sitemap.xml app/sitemap.ts excludes it by name
//   not in the nav     it is reached by submitting a form, not by browsing
//   exempt from the 3-click and orphan rules, for the same reason
//
// The booking calendar belongs HERE rather than on the money pages: a quote
// page keeps one primary action, and the calendar appears the instant after
// someone converts, when intent is highest. If the client has a booking link
// (Calendly), add it to lib/site.config.ts and render it here.
//
// Built on /contact's frontend, as /quote is, so the form, the quote and the
// moment after them read as one set. Two parts:
//   Cover   the shared opening (components/site/Cover.tsx): the h1 as the
//           lockup over a darkened photo, the reassurance on the glass, and
//           the photo closes into a plate
//   Main    night ground. The call, the number largest, and the "While you
//           wait" heading are one column HELD (sticky) on the left while the
//           four jobs pass on the right, each photo settling into its frame
//           as it arrives
// Still no close and no pinned scene: this is the calm moment after someone
// has converted. Layout and motion: app/pages/thankyou.css.
// HomeReveal is the site's one motion script, the same as every other page
// (it also runs the header).
import { site, telHref } from "@/lib/site.config";
import { gate } from "@/lib/unwritten";
import HomeReveal from "@/components/HomeReveal";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Cover from "@/components/site/Cover";
import Shot from "@/components/site/Shot";
import PageCss from "@/components/site/PageCss";

export const metadata = {
  ...gate("/thank-you"),
  title: { absolute: "Thanks - Business Name" },
  description: "Your enquiry has been sent to Business Name.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="h-page" data-head="over">
      <SiteHeader />
      <main>
        <PageCss file="thankyou.css" />
        <HomeReveal />

        {/* The opening, as on /contact and /quote: the business name as the
            accent, GOT IT in the caps. A calm, finished frame for the calm
            moment, and a photo no other page opens on. */}
        <Cover
          crumbs={[{ label: "Thank you" }]}
          lines={[["Business Name", "a"], ["Got It", "c"]]}
          lede="Your message is through. You will get a call back on the number you left."
          photo="wide11"
          position="50% 55%"
        />

        {/* The main section, on night, as /contact's. On the left, one
            column held beside the work: the call (the old button's words,
            "Call" set as the label over the number, so the number is the
            largest thing on the screen), then the "While you wait" heading.
            On the right the four jobs pass in one column, wide frames full
            width and tall ones narrower, swapping sides, each its own scene
            (thankyou.css). Phones: the call, the heading, then the jobs. */}
        <section className="h-night ty-main" data-scene><div className="h-w ty-grid">
          <div className="ty-side">
            <a className="ty-tel" href={telHref}><span className="h-label ty-label">Call</span> <span className="ty-num">{site.phone}</span></a>
            <div className="ty-head">
              <p className="h-kicker">While you wait</p>
              <h2 className="h-h2s">Have a look at the work</h2>
              <p className="h-lede">Four recent jobs. Send back a photo of anything you like the look of and the quote gets a lot more accurate.</p>
            </div>
          </div>
          <div className="ty-work">
            <figure className="ty-fig" data-scene><div className="ty-ph"><Shot name="wide14" sizes="(max-width:700px) 100vw, (min-width:1440px) 666px, 46vw" /></div><span className="ty-cap">What the job was, in a few words<i>Service two</i></span></figure>
            <figure className="ty-fig" data-scene><div className="ty-ph"><Shot name="tall7" sizes="(max-width:700px) 100vw, (min-width:1440px) 444px, 31vw" /></div><span className="ty-cap">What the job was, in a few words<i>Service two</i></span></figure>
            <figure className="ty-fig" data-scene><div className="ty-ph"><Shot name="tall8" sizes="(max-width:700px) 100vw, (min-width:1440px) 444px, 31vw" /></div><span className="ty-cap">What the job was, in a few words<i>Service one</i></span></figure>
            <figure className="ty-fig" data-scene><div className="ty-ph"><Shot name="wide10" sizes="(max-width:700px) 100vw, (min-width:1440px) 666px, 46vw" /></div><span className="ty-cap">What the job was, in a few words<i>Service three</i></span></figure>
          </div>
        </div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
