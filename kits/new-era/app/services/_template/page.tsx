// THE SERVICE PAGE TEMPLATE. /service-page and /scale-map copy this folder to
// app/services/<slug>/ and rewrite every word for one keyword-map row.
// Next.js does not publish a folder that starts with "_", and the checkers
// skip it, so this page is never live.
//
// KIT STATE: the words are placeholders in the shape of the copy this layout
// was built and approved with: the same sections, paragraph counts, list
// lengths, FAQ count and the one outbound citation. Replace them, keep the
// shape unless the keyword needs otherwise. Every claim traces to
// context/proof/proof-inventory.md; nothing here is a fact about any business.
//
// Keywords, from the keyword-map row, placed where a reader meets them:
//   primary   in the title, the H1 alone, and the services H2
//   secondary the opening paragraph, the service area paragraph, and the FAQ
//             questions, phrased as the buyer asks them
//
// Buyer: the matching block in context/buyers.md. Every fear in that block is
// answered on the page, in order.
//
// The copy register this layout was approved with: a plain "we" voice,
// question H2s, each service group as a lead paragraph + "Here's what ...
// covers." + a list, a consultation paragraph with the mid-page CTA, a
// numbered three-stage process, a "Choosing <business>" section, then FAQ and
// the close. Two things about it are deliberate:
//   1. The service groups and both numbered lists are VISIBLE, not collapsed,
//      because that is how a buyer compares quotes.
//   2. No CTA and no proof line above the fold. The Cover carries the h1, the
//      intro and the breadcrumb and NO button. The asks start under the first
//      screen, with "Get a free quote" in the opening and "Book a free quote"
//      after the consultation paragraph.
//
// THE LAYOUT. Every block is from the service page kit, app/pages/service.css
// (prefix sp-), whose header comment has the markup of each. Top to bottom:
//   Cover   components/site/Cover.tsx: the h1 as the lockup over one darkened
//           photo, the intro on glass, the breadcrumb in the corner; the photo
//           closes into a plate as the page moves
//   Opening paper, HELD: the three opening paragraphs beside one big photo
//           frame that holds still and swaps photo as the second part arrives
//   Work    sand, HELD + RULES: "What Makes a Yard Work?", the two service
//           groups and the consultation, beside a held frame that swaps once
//           per part; the service lists are ruled rows that draw themselves
//   Process night, STEPS (the signature scene): both numbered lists hang off
//           a rail, a bronze line draws down it and each step lights as the
//           line reaches it. Both lists stay <ol>
//   Jobs    paper, ROW: the three recent jobs as equal frames walking sideways
//           while the stage is held; a swipe row on phones
//   Why     sand, WHY: "Choosing <business>" beside the four trust facts
//   FAQ     paper: the heading held beside the questions
//   Areas   sand: the plain-text service area beside a photo, then AuthorNote
//   Quote   paper: the form (#quote) in a calm panel
//   Close   components/site/Close.tsx: the closing question turned ivory by
//           a rising photo, the closing button and phone line
//
// check_page_rhythm: a page needs a photo, an SVG or a form at least every 350
// words, counted in SOURCE order (an <ol> counts as text), and the attributes
// of each <img> count as words in the stretch after it. A held frame is
// therefore several <figure>s, each written straight before the part of the
// text it belongs to, and the frame is assembled by CSS. Four placements are
// load-bearing; each is marked where it sits: the process photo (between the
// first lede and the three stages), the trust facts' icons (after the "Why"
// copy, straight before the FAQ), the service-area photo (FIRST in its
// section, straight after the FAQ) and the FAQ cite's two-word lead-in. The
// FAQ is the longest stretch with nothing to look at: anything added to it, or
// moved between the icons and the area photo, needs a visual with it.
//
// SEO decisions built in: both schema blocks generated from single arrays
// (written before the Cover, so the JSON-LD order is service, FAQ,
// breadcrumb, person), the one outbound citation, and the plain-text service
// area. The LCP photo is the Cover's, marked priority there. Do not add a
// ReactDOM.preload for any other photo: it would compete with the Cover's.
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
import AuthorNote from "@/components/site/AuthorNote";
import ScheduledLink from "@/components/site/ScheduledLink";

const ROUTE = "/services/_template";

export const metadata = {
  ...gate(ROUTE),
  title: { absolute: "Service one Your City - Primary Keyword Title" },
  description:
    "Service one in Your City. One sentence on what is included and who does it, then the ask. Get a free on-site quote.",
};

// The two halves of the job, grouped the way a buyer comparing quotes reads
// them. Written once here and rendered as the two service blocks below.
const groups = [
  {
    id: "part-one",
    heading: "The first half of the work",
    lead: "Two sentences on what this part of the job is and why it has to be done properly. Say what goes wrong when it is not, in the buyer's terms.",
    intro: "Here's what this part covers.",
    items: [
      "Item one of the work",
      "Item two, with the materials or options named",
      "Item three, linked to its own page once it exists",
      "Item four of the work",
      "Item five of the work",
      "Item six of the work",
    ],
  },
  {
    id: "part-two",
    heading: "The second half of the work",
    lead: "Two sentences on the second part of the job and what the customer sees of it every day. Say how it is prepared and finished.",
    intro: "Here's what this part covers.",
    items: [
      "Item one of the work",
      "Item two of the work",
      "Item three of the work",
      "Item four of the work",
    ],
  },
] as const;

// Links inside the service-group bullets. Each wraps words already in the
// item, so the copy is unchanged: the bullet text is the key, the anchor is the
// substring that becomes a link. ScheduledLink renders plain text until the
// target's publish date.
const itemLinks: Record<string, readonly [string, string]> = {
  "Item three, linked to its own page once it exists": ["linked to its own page", "/services"],
};
function item(i: string) {
  const l = itemLinks[i];
  if (!l) return i;
  const n = i.indexOf(l[0]);
  return <>{i.slice(0, n)}<ScheduledLink href={l[1]}>{l[0]}</ScheduledLink>{i.slice(n + l[0].length)}</>;
}

// The order of works. This is the page's real differentiator and the answer to
// the buyer's biggest fear, so it is written once here and rendered as the
// numbered list below.
const sequence = [
  ["Step one", "One line on why this comes first."],
  ["Step two", "One line on what it sits on and why it cannot move."],
  ["Step three", "One line on what it depends on."],
  ["Step four", "One line on what has to be in before it."],
  ["Step five", "One line on why it goes here and not later."],
  ["Last step, last", "One line on why it is always the final step."],
] as const;

// Answers stay straight and self-contained - these are what AI Overviews and
// featured snippets lift. Rendered as <details> AND as FAQPage schema from this
// one array so the two can never drift.
const faqs = [
  {
    q: "How much does service one cost in Your City?",
    a: "Answer in two or three straight sentences: what the price depends on, why a published rate would mislead, and how a quote is worked out. A model lifts this answer whole, so it must stand on its own.",
  },
  {
    q: "A second question with a secondary keyword in it?",
    a: "Answer in two or three straight sentences, starting with the direct answer and then the reason.",
  },
  {
    q: "How do I choose the right business for this job?",
    a: "Answer in two or three straight sentences: what to ask, what to compare, and what a good answer sounds like. Never a superlative about this business.",
  },
  {
    q: "How long does the job take?",
    a: "Answer in two or three straight sentences: the usual range, and the things that move the date.",
  },
  {
    q: "Do I need a permit for this?",
    a: "Answer in two or three straight sentences with the regulatory fact, and what the business does about it. The source below is the one outbound link on the page.",
    // The only outbound link on the page, and the only claim that warrants
    // one: a regulatory statement, linked to the regulator's own page. Kept
    // to a two-word lead-in: the FAQ block is the page's longest stretch
    // without a photo, so a longer lead-in fails check_page_rhythm. Anything
    // added to this section needs a visual with it.
    cite: {
      href: "https://www.example.com/",
      label: "the regulator",
      lead: "Source:",
    },
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Service one",
  name: "Service one in Your City",
  description:
    "One sentence on the whole service and what it includes, across Your City.",
  provider: { "@type": "LocalBusiness", name: site.name, telephone: site.phone, url: site.url },
  areaServed: { "@type": "City", name: site.city },
  url: `${site.url}${ROUTE}`,
};

// The suburbs on the keyword map. Plain text until their pages exist, because
// a link to nowhere teaches Google the wrong target. /scale-map sets `href` on
// a row the day it ships that suburb's page, exactly as content/services.ts
// works, and the link appears with nothing else moving.
const suburbs: { name: string; href?: string }[] = site.recentSuburbs.map((name) => ({ name }));

// The trust facts: figure, label, and the icon's path. The icons are inline
// SVG, which check_page_rhythm counts as something to look at.
const facts = [
  ["00+ years", "in the trade", "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"],
  ["Proof one", "a fact from the inventory", "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm13 14v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"],
  ["Free quotes", "measured on site", "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13h6M9 17h3"],
  ["Your Region", "and across Your City", "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0ZM12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"],
] as const;

// What each photo renders at, for `sizes`. Held frames are six of the twelve
// columns on desktop and the content width below 1000px; the job frames are
// 54% of the screen's height at 4:3 (720px at most), 78vw on a phone.
const HELD = "(max-width:999px) calc(100vw - 40px), (max-width:1440px) 46vw, 670px";
const JOB = "(max-width:999px) min(78vw, 520px), 650px";

export default function Page() {
  return (
    <div className="h-page" data-head="over">
      {/* The kit's styles, outside <main> so the SEO snapshot of the page's
          words (main's text) never picks up CSS. */}
      <PageCss file="service.css" />
      <SiteHeader current="/services" />
      <main>
        <HomeReveal />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

        {/* Cover: the h1, the intro and the breadcrumb trail. No button and
            no proof line here (see the header comment). The photo should
            darken into the evening mood, without bright sky behind the
            words, and differ from the photo /services opens on. */}
        <Cover
          crumbs={[{ href: "/services", label: "Services" }, { label: "Service one" }]}
          lines={[["Service one", "c"], ["Services", "c"], ["In Your City", "a"]]}
          lede="At Business Name, we do the whole job across Your City. One or two sentences on what the service covers, from the first stage through to the finish, in the owner's words."
          photo="tall6"
          position="50% 62%"
        />

        {/* The opening, held. Its first paragraph is the quick answer that AI
            Overviews lift, so it stays straight and self-contained, and it is
            the first part on its own. No heading of its own: an H2 here sits
            directly under the H1 and repeats it, which reads as two
            titles. */}
        <section className="sp-sec sp-held">
          <div className="h-w sp-held-g">
            <figure className="sp-hf" data-scene>
              <div className="sp-hf-in"><Shot name="tall3" sizes={HELD} position="50% 72%" /></div>
            </figure>
            <div className="sp-hp sp-big">
              <p><a href="/about">{site.name}</a> is a full service one business in Your City. The quick answer goes here: who does the work, where, and what it includes, with links to the related service pages once they exist. <a href="/quote">Quotes are free</a> and measured on site.</p>
            </div>
            <figure className="sp-hf" data-scene data-hold>
              <div className="sp-hf-in"><Shot name="wide4" sizes={HELD} /></div>
            </figure>
            <div className="sp-hp sp-big">
              <p>A second paragraph on how most jobs run, start to finish, and what the customer is spared by it.</p>
              <p>A third paragraph on why that way of working gives a better result, with one concrete example the buyer can picture. Who is accountable for the result.</p>
              <p className="sp-act"><a className="h-btn" href="#quote">Get a free quote</a></p>
            </div>
          </div>
        </section>

        {/* The work, held, on sand. The explainer (name the two halves of the
            work, then say plainly why one without the other fails), then
            what's included, grouped and listed: each group runs lead
            paragraph, "Here's what ... covers.", then the list. Visible on
            purpose - see the header comment. The consultation paragraph and
            the mid-page ask close it, with a captioned photo as the last
            frame. */}
        <section className="sp-sec sp-held sp-flip h-sand">
          <div className="h-w sp-held-g">
            <figure className="sp-hf" data-scene>
              <div className="sp-hf-in"><Shot name="wide6" sizes={HELD} /></div>
            </figure>
            <div className="sp-hp">
              <p className="h-kicker h-rv">The two halves</p>
              <h2 className="h-h2s" data-split>A Question the Buyer Asks?</h2>
              <p>Every good job balances two things. <ScheduledLink href="/services">The first half</ScheduledLink> does one thing for the customer; the second half does another. Say both plainly.</p>
              <p>Get one without the other and it shows. One sentence with the failure the buyer has seen before.</p>
              <p>We plan both at the same time. One sentence on what that means in practice, from day one.</p>
            </div>
            <figure className="sp-hf" data-scene data-hold>
              <div className="sp-hf-in"><Shot name="wide2" sizes={HELD} /></div>
            </figure>
            <div className="sp-hp">
              <p className="h-kicker h-rv">The work</p>
              <h2 className="h-h2s" data-split>Our Service one Services</h2>
              <p className="h-lede">One sentence on who carries out the work below. You don't need to know which parts your job needs. Tell us what you want and we'll work out the rest.</p>
              <h3>{groups[0].heading}</h3>
              <p>{groups[0].lead}</p>
              <p>{groups[0].intro}</p>
              <ul className="sp-rules">{groups[0].items.map((i) => <li key={i} data-scene>{item(i)}</li>)}</ul>
            </div>
            <figure className="sp-hf" data-scene data-hold>
              <div className="sp-hf-in"><Shot name="tall4" sizes={HELD} /></div>
            </figure>
            <div className="sp-hp">
              <h3>{groups[1].heading}</h3>
              <p>{groups[1].lead}</p>
              <p>{groups[1].intro}</p>
              <ul className="sp-rules">{groups[1].items.map((i) => <li key={i} data-scene>{item(i)}</li>)}</ul>
            </div>
            <figure className="sp-hf" data-scene data-hold>
              <div className="sp-hf-in"><Shot name="wide8" sizes={HELD} /></div>
              <figcaption>One line on what the photo shows and why it matters to the price.</figcaption>
            </figure>
            <div className="sp-hp">
              <p>A site visit is always the right place to start. It lets us see the job as it is and hear what you want before anything is priced.</p>
              <p>During the visit we walk the site with you and measure it. We talk through the options, how long each one lasts, how much upkeep it needs and <a href="/quote">what it costs</a>, so you can choose what suits your budget.</p>
              <p className="sp-act"><a className="h-btn" href="#quote">Book a free quote</a></p>
            </div>
          </div>
        </section>

        {/* The process, on night: the page's signature scene. Three numbered
            stages, then the order the build runs in. Both are <ol>, which is
            machine-readable and the shape AI answers lift cleanly
            (on-page-seo.md group 12). The numerals and the rail are CSS. */}
        <section className="sp-sec h-night sp-proc">
          <div className="h-w">
            <p className="h-kicker h-rv">The process</p>
            <h2 className="h-h2 sp-proc-h" data-split>Our Process</h2>
            <div className="sp-proc-g">
              <div className="sp-proc-hd">
                <p className="h-lede h-rv">Every job starts with understanding what you want. From there, it runs in three stages.</p>
                {/* Load-bearing for check_page_rhythm, which counts an <ol> as
                    text: it breaks the run from the captioned photo, through the
                    consultation and both lists, to the recent-work photos. */}
                <figure className="sp-dev" data-scene><Shot name="tall5" sizes="(max-width:999px) min(100vw - 40px, 520px), 420px" /></figure>
              </div>
              <ol className="sp-steps">
                <li data-scene><b>Consultation and site assessment.</b> One sentence on what gets checked on site, and what we ask you.</li>
                <li data-scene><b>An itemised quote.</b> Every part of the job is priced separately, so you can see what each element costs and stage the work if that suits you better.</li>
                <li data-scene><b>The work itself.</b> One sentence on how the job is carried out, in order, and handed back finished.</li>
              </ol>
            </div>
            <div className="sp-proc-g">
              <div className="sp-proc-hd">
                <h2 className="h-h2s" data-split>Why Does the Order of Works Matter?</h2>
                <p className="h-lede h-rv">The order matters because each stage depends on the one before it. One sentence on what happens when it is done out of order, and what fixing it costs.</p>
              </div>
              <ol className="sp-steps">
                {sequence.map(([step, why]) => (
                  <li key={step} data-scene><b>{step}.</b> {why}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Jobs we've done. Photographs sell faster than paragraphs. */}
        <section className="sp-row" data-scene>
          <div className="sp-row-stage">
            <div className="h-w sp-row-hd">
              <div>
                <p className="h-kicker h-rv">Recent work</p>
                <h2 className="h-h2s" data-split>Recent Service one Jobs Around Your City</h2>
              </div>
              <p className="h-lede h-rv">Recent jobs include one in Area one, one in Area two and one in Area three, only as the proof inventory records them. We keep our customers' details private, so the photos do the talking.</p>
            </div>
            <div className="sp-row-vp">
              <div className="sp-jobs">
                <div className="sp-job">
                  <div className="sp-job-ph"><Shot name="wide1" sizes={JOB} /></div>
                  <p>One line on what this job was.</p>
                </div>
                <div className="sp-job">
                  <div className="sp-job-ph"><Shot name="wide5" sizes={JOB} /></div>
                  <p>One line on what this job was.</p>
                </div>
                <div className="sp-job">
                  <div className="sp-job-ph"><Shot name="tall2" sizes={JOB} position="50% 72%" /></div>
                  <p>One line on what this job was.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why us, in the "Choosing X for Y" shape, with the trust facts
            beside it. Every fact comes from proof-inventory.md, in its own
            wording (an industry-experience claim is never a founding date).
            The facts come AFTER the copy on purpose: their icons are the last
            thing to look at before the FAQ, the page's longest stretch of
            words (check_page_rhythm allows 350). */}
        <section className="sp-sec h-sand sp-why">
          <div className="h-w sp-why-g">
            <div className="sp-why-txt">
              <p className="h-kicker h-rv">Why {site.name}</p>
              <h2 className="h-h2s" data-split>Choosing {site.name} for Your Job</h2>
              <p className="h-rv">Our team brings 00+ years of experience in the trade across Your City. One sentence on the range of jobs, linking a <ScheduledLink href="/services">related service</ScheduledLink>.</p>
              <p className="h-rv">One or two sentences on who does the work and why that matters to the finished job.</p>
              <p className="h-rv">Quotes are free, measured on site and itemised, with no obligation to go ahead.</p>
            </div>
            <div className="sp-facts h-stagger" data-scene>
              {facts.map(([value, label, d]) => (
                <div className="sp-fact" key={value}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
                  <b>{value}</b><span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ. Questions visible and answers shut, with the cost one open. The
            heading holds beside the questions. */}
        <section className="sp-sec sp-faq">
          <div className="h-w sp-faq-g">
            <div className="sp-faq-hd">
              <p className="h-kicker">Questions</p>
              <h2 className="h-h2s">Frequently Asked Questions</h2>
            </div>
            <div className="h-faqs" data-scene>
              {faqs.map((f, i) => (
                <details className="h-faq" key={f.q} open={i === 0} data-scene>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                  {"cite" in f && f.cite ? (
                    <p className="sp-cite">
                      {f.cite.lead}{" "}
                      <a href={f.cite.href} target="_blank" rel="noopener">{f.cite.label}</a>.
                    </p>
                  ) : null}
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Service area, in plain text so a model can read where they work.
            A "near me" secondary keyword lives here, because that search is
            answered by location, and this is the paragraph that says where we
            are. The author note follows on the same sand.
            ⛔ The photo is FIRST in the source on purpose: it is what ends the
            FAQ's stretch of words for check_page_rhythm. Move it after the
            heading or the copy and that stretch grows. */}
        <div className="h-sand">
          <section className="sp-sec sp-area">
            <div className="h-w sp-area-g">
              <div className="sp-area-ph h-frame">
                <Shot name="tall8" sizes="(max-width:999px) calc(100vw - 40px), (max-width:1440px) 46vw, 670px" />
              </div>
              <div className="sp-area-txt">
                <h2 className="h-h2s" data-split>Areas We Serve Across Your City</h2>
                <p>We're based in Your Region, and we work right across the city. There's no shopfront to visit, so we come to you.</p>
                <p>If you've searched for a business like ours near you anywhere in Your Region, there's a good chance we're already working close by. You'll find us regularly in{" "}
                  {suburbs.map((s, i) => (
                    <span key={s.name}>
                      {s.href ? <a href={s.href}>{s.name}</a> : s.name}
                      {i < suburbs.length - 1 ? ", " : "."}
                    </span>
                  ))}
                </p>
                <p>Not on that list? <a href="/contact">Call and ask</a>. We cover most of Your City, and you'll get a straight answer either way.</p>
              </div>
            </div>
          </section>

          {/* Who wrote it. Renders only once a surname exists - see the component. */}
          <AuthorNote />
        </div>

        {/* The quote form, in a calm panel. Guarantee restated, then the form. */}
        <section id="quote" className="sp-sec sp-quote">
          <div className="h-w">
            <div className="c-form sp-panel">
              <h2 className="c-title">Get a free quote</h2>
              <p className="c-intro">Free, measured on site, itemised, and no obligation to go ahead. Everything marked with an asterisk is needed to call you back.</p>
              <LeadForm subject={`New quote request from the ${site.name} website`}>
                <div className="c-row">
                  <label className="c-field"><span>Name <em>*</em></span><input name="name" required autoComplete="name" placeholder="Your name" /></label>
                  <label className="c-field"><span>Phone <em>*</em></span><input name="phone" type="tel" required autoComplete="tel" placeholder="Your phone number" /></label>
                </div>
                <label className="c-field"><span>Suburb <em>*</em></span><input name="suburb" required autoComplete="address-level2" placeholder="Your suburb" /></label>
                <label className="c-field"><span>What do you want the job to end up like?</span><textarea name="job" rows={4} placeholder="Rough size, what's there now, and what you're picturing." /></label>
                <small>Used to quote your job and nothing else. See the <a href="/privacy-policy">privacy policy</a>. {site.name}, ABN {site.abn}.</small>
                <button type="submit" className="h-btn">Get my free quote <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg></button>
              </LeadForm>
            </div>
          </div>
        </section>

        {/* The close: the Cover's bookend (components/site/Close.tsx). The
            heading waits on paper and the photo rises behind it. A finished
            job, not the homepage hero's photo (the hero is never a close),
            and a photo no other page ends on. */}
        <Close lines={["Planning a", "New Job?"]} photo="wide7" position="50% 75%">
          <p className="h-lede">Get a free, no-obligation quote from our team.</p>
          <a className="h-btn h-btn-light" href="#quote">Get a free quote</a>
          <small>Quotes are free and measured on site. Or call <a href={telHref}>{site.phone}</a>.</small>
        </Close>
      </main>
      <SiteFooter />
    </div>
  );
}
