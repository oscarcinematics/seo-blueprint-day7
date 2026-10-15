// About - the E-E-A-T page.
//
// Who the business is, how it works, where it works, and the registered
// details. Every claim traces to context/proof/proof-inventory.md: a
// length-of-trading line only in the inventory's own wording (industry
// experience is not a founding year), and a person named or pictured only if
// the owner wants that.
//
// The page opens on the shared Cover and ends on the shared Close, and between
// them three scenes of its own (app/pages/about.css): the split, the held
// photo by the suburbs, the ruled details.
//
// KIT STATE: placeholder words in the shape of the approved copy.
import { site, telHref } from "@/lib/site.config";
import { gate } from "@/lib/unwritten";
import HomeReveal from "@/components/HomeReveal";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Cover from "@/components/site/Cover";
import Close from "@/components/site/Close";
import Shot from "@/components/site/Shot";
import PageCss from "@/components/site/PageCss";

export const metadata = {
  ...gate("/about"),
  title: { absolute: "About Business Name - Your Trade in Your City" },
  description: "Meet Business Name, a Your City business handling the whole job: service one, service two and service three. See how we work and get a quote.",
};

export default function Page() {
  return (
    <div className="h-page" data-head="over">
      <SiteHeader current="/about" />
      <main>
        <PageCss file="about.css" />
        <HomeReveal />

        {/* The opening: the shared cover, components/site/Cover.tsx. The h1
            is the business's name, so it is set accent first and caps under
            it, the way a logo stacks it. About is about the whole business
            rather than one trade: an entrance, a team or a wide finished job
            suits it. Pick a frame that darkens into dusk rather than into a
            grey sky (about.css deepens the shade to the hero's depth). */}
        <Cover
          crumbs={[{ label: "About" }]}
          lines={[["Business", "a"], ["Name", "c"]]}
          lede="00+ years in Your Trade, across all of Your City."
          photo="wide13"
          position="34% 55%"
        />

        {/* The intro, "the split", on its own sand ground so the cover's
            paper ends at a visible edge. On desktop the screen divides: one
            photograph fills the left half, edge to edge, and the two
            paragraphs sit on the right, their block centred on the
            photograph. The screen holds briefly; the first paragraph settles
            up into place as the second arrives under it on its bronze rule,
            while the photograph tilts slowly the whole way through. Nothing
            opens or closes, so it shares no move with the cover before it or
            the window after. A deep, shaded frame works best here. */}
        <section className="h-sand ab-intro" data-scene>
          <div className="ab-stage">
            <div className="ab-ph"><Shot name="tall4" sizes="(max-width:999px) 100vw, 50vw" /></div>
            <div className="h-w ab-intro-g">
              <div className="ab-txt">
                <p className="ab-first">{site.name} is a Your City business that does <span className="ab-em">the whole job</span> rather than one part of it. <a href="/services">Service one</a>, service two and service three - one sentence on how the work is done and priced, in the owner's words.</p>
                <p className="ab-second">A second paragraph on why that matters to the customer: the problem the way of working solves, said plainly, in two or three sentences.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Where we work, on the night ground. The photo is held beside the
            suburb list (sticky): its window opens from a thin horizon line as
            the section arrives, then slowly closes in as the list passes.
            Each suburb is a ruled row: the rule draws in from the left as the
            row arrives and the name slides in along it. Low-key photos with
            no sky belong on the night ground. On phones the photo is held at
            the top and the list runs up under it.
            check_page_rhythm fails three text-only blocks in a row, so this
            section keeps its photo. A <ul> is not a visual to that check. */}
        <section className="h-sec h-night ab-where" data-scene><div className="h-w ab-where-g">
          <h2 className="h-h2 ab-where-h" data-split>Where we work</h2>
          <p className="h-lede ab-where-l h-rv">All of Your City. Recent jobs have been in these suburbs, and if yours is not on the list, call and ask.</p>
          <div className="ab-where-ph">
            <div className="ab-where-fr">
              <div className="ab-where-im"><Shot name="tall8" sizes="(max-width:900px) 100vw, (min-width:1440px) 760px, 52vw" position="50% 60%" /></div>
            </div>
          </div>
          <ul className="ab-subs">
            {site.recentSuburbs.map((s) => <li key={s} data-scene><span>{s}</span></li>)}
          </ul>
        </div></section>

        {/* Business details on sand, the homepage FAQ's way: the heading is
            held (sticky) on the left while the rows pass on the right, and
            only the rules move, each drawn in as its row arrives. The
            accordion is unchanged: same summaries, same answers, the first
            one open. No h-cv here - containment breaks sticky. */}
        <section className="h-sec h-sand ab-biz"><div className="h-w ab-biz-g">
          <div className="ab-biz-head">
            <h2 className="h-h2" data-split>Business details</h2>
          </div>
          <div className="h-faqs" data-scene>
            <details className="h-faq" data-scene open><summary>Registered business</summary><p>{site.name} trades under ABN {site.abn}, registered for GST. Every quote and invoice carries it.</p></details>
            <details className="h-faq" data-scene><summary>How long</summary><p>00+ years in the trade.</p></details>
            <details className="h-faq" data-scene><summary>What it costs to ask</summary><p>Nothing. Quotes are free, measured on site, and there is no obligation after one.</p></details>
            <details className="h-faq" data-scene><summary>How to see the work</summary><p>There are photos of finished jobs against every trade on <a href="/services">our services</a>, and more goes up on <a href={site.instagram} rel="noopener" target="_blank">Instagram</a> as it is finished.</p></details>
          </div>
        </div></section>

        {/* The close: the Cover's bookend, components/site/Close.tsx. The
            heading waits on paper and the photo rises behind it. A photo no
            other page ends on, in shade, so the page ends in the cover's
            light. Check the back of the frame for bins, cars and clutter: at
            full bleed every corner shows. */}
        <Close lines={["Get a price on", "your project"]} photo="tall6" position="50% 90%">
          <a className="h-btn h-btn-light" href="/quote">Get a free quote</a>
          <small>Or call <a href={telHref}>{site.phone}</a>.</small>
        </Close>
      </main>
      <SiteFooter />
    </div>
  );
}
