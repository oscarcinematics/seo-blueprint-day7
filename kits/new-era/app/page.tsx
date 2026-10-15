// Homepage. Every number and claim on it must trace to
// context/proof/proof-inventory.md. Where the inventory is thin (no reviews,
// no results, no prices), the photographs carry the proof and the copy stays
// on what the business does.
//
// KIT STATE: the words are placeholders in the shape of the copy this layout
// was designed and approved with (lengths, number of cards, FAQ count).
// /build-website rewrites them from context/ and context/voice.md.
import { site, telHref } from "@/lib/site.config";
import { gate } from "@/lib/unwritten";
import HomeReveal from "@/components/HomeReveal";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Shot from "@/components/site/Shot";
import { photos, type PhotoKey } from "@/lib/photos";
import PageCss from "@/components/site/PageCss";
import type { CSSProperties } from "react";

export const metadata = {
  ...gate("/"),
  title: { absolute: "Your Trade in Your City - Service one, Service two & Service three" },
  description: "Your Trade across Your City: service one, service two and service three, all with one team. Get a free on-site quote from Business Name.",
};

// The four FAQ answers, once. Rendered as <details> AND as FAQPage schema from
// the same array, so the two can never drift - the usual way a rich result
// quietly stops matching the page.
const faqs = [
  {
    q: "What areas of Your City do you cover?",
    a: "All of Your City. Recent jobs have been in Area one, Area two, Area three and Area four. If your suburb is not on that list, call and ask.",
  },
  {
    q: "How much does Your Trade cost in Your City?",
    a: "Cost depends on the size of the job, the materials, and how easy the site is to work on. Those three change the price enough that a published rate would be misleading, so quotes are free and measured on site.",
  },
  {
    q: "What services does Business Name offer?",
    a: "Service one, service two and service three. Residential and commercial.",
  },
  {
    q: "How do I get a quote?",
    a: "Call (555) 010-0199 or fill in the quote form with what the job is, roughly how big it is, and where. Someone then comes out, measures the site and prices it. The quote is free and there is no obligation to go ahead.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

// The services shown on the homepage: three cards in the night room, each
// pointing at a page that EXISTS. In the kit they all point at /services
// until the service pages are built; /build-website repoints each card at its
// page (a card to a missing page is a dead link the gates fail on). Three is
// what the deck scene is choreographed for (home.css "The night room").
// Photos are ones not repeated elsewhere on this page.
const cards = [
  { photo: "wide1", name: "Service one", href: "/services", blurb: "One sentence on what this service covers, start to finish, in the owner's words.", cta: "Service one" },
  { photo: "wide11", name: "Service two", href: "/services", blurb: "One sentence on what this service covers, start to finish, in the owner's words.", cta: "Service two" },
  { photo: "wide5", name: "Service three", href: "/services", blurb: "One sentence on what this service covers, start to finish, in the owner's words.", cta: "Service three" },
] as const;

// The recent work walk: jobs the rest of this page does not already show,
// each labelled with the trade the photo is OF (lib/photos.ts `tag`). Six,
// travelling sideways past a pinned screen on desktop at their own sizes and
// speeds, a swipe row on phones (app/pages/home.css "The walk"); /gallery
// has the rest. `sizes` is the width each one renders at: the walk sizes
// photos by screen HEIGHT, so the desktop value is in vh.
const strip: { k: PhotoKey; sizes: string }[] = [
  { k: "wide2", sizes: "(max-width:800px) 80vw, 90vh" },
  { k: "tall6", sizes: "(max-width:800px) 80vw, 30vh" },
  { k: "tall2", sizes: "(max-width:800px) 80vw, 58vh" },
  { k: "wide14", sizes: "(max-width:800px) 80vw, 84vh" },
  { k: "wide6", sizes: "(max-width:800px) 80vw, 54vh" },
  { k: "tall4", sizes: "(max-width:800px) 80vw, 34vh" },
];

// The hero's heading is drawn twice: the real <h1> in ink, and an
// aria-hidden copy in ivory whose words come from CSS (data-t), clipped to
// the photo's window. Where a word crosses the window edge it changes colour
// as it crosses, and as the window opens the ivory copy takes over. The copy
// is ornament: no text nodes, so the page text is unchanged.
// Three short words: the caps lines are sized for one word each (the longest
// caps word should be no wider than LANDSCAPING, about 6.8em, or it overflows
// a phone's gutters).
const heroLines = ["Your Trade", "Across", "Your City"] as const;
// Both copies are set as the lockup (brand.css "Lockup"): the middle word is
// the italic accent, the other two the caps. Classes only; the words stay.
const heroLk = ["lk-c", "lk-a", "lk-c"] as const;

export default function Page() {
  return (
    <div className="h-page">
      <SiteHeader current="/" />
      <main>
        <PageCss file="home.css" />
        <HomeReveal />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

        {/* Hero, "the opening frame": a pinned scene. At rest the photograph
            sits in a window on paper with the heading crossing its edges; the
            scroll opens the window to full bleed and the glass panel rises.
            The photo is the LCP element, so it is eager, high priority and
            painted at load (framed, never hidden). Without the script it is
            the finished full-bleed hero. Choreography: home.css "Hero". */}
        <section className="h-hero hm-hero" data-scene>
          <div className="hm-stage">
            <div className="hm-hero-ph"><div className="hm-hero-sc"><Shot name="pano1" sizes="100vw" priority position="50% 60%" /></div></div>
            <div className="h-w hm-lines" aria-hidden="true"><i /><i /><i /></div>
            <div className="hm-type">
              <div className="h-w hm-hero-in">
                <h1 className="lk"><span className="n-ne">{site.name}</span> <span className="h-d1" data-split>{heroLines.map((l, i) => <span className={`hm-l hm-l${i + 1}`} key={l}><span className={heroLk[i]}>{l}</span>{i < 2 ? " " : ""}</span>)}</span></h1>
              </div>
            </div>
            <div className="hm-ghost" aria-hidden="true">
              <div className="h-w hm-hero-in">
                <div className="hm-gh1 lk">
                  <span className="hm-gey" data-t={site.name} />
                  <span className="h-d1" data-split>{heroLines.map((l, i) => <span className={`hm-l hm-l${i + 1}`} key={l}><span className={heroLk[i]}><span className="sw"><span className="si" data-t={l} style={{ "--i": i } as CSSProperties} /></span></span></span>)}</span>
                </div>
              </div>
            </div>
            <div className="h-w hm-panel">
              <div className="hm-glass">
                <p>Service one, service two and service three. One team on the job from start to finish.</p>
                <a className="h-btn h-btn-light" href="/quote">Get a free quote</a>
                <p className="hm-alt">Or call <a href={telHref}>{site.phone}</a></p>
              </div>
            </div>
            <span className="hm-cue" aria-hidden="true" />
          </div>
        </section>

        {/* The ledger: a breath after the hero. Hairlines draw across and down
            as it arrives and the figures rise out of their own masks, column
            by column, scrubbed by the scroll (home.css "Ledger"). */}
        <section className="hm-facts" data-scene><div className="h-w hm-stats">
          <div className="hm-stat"><b><span>00+ years</span></b><span>in the trade across Your City</span></div>
          <div className="hm-stat"><b><span>Proof one</span></b><span>a fact from the inventory</span></div>
          <div className="hm-stat"><b><span>Free quotes</span></b><span>measured on site</span></div>
          <div className="hm-stat"><b><span>All Your City</span></b><span>residential and commercial</span></div>
        </div></section>

        {/* The curtain: About and the night room share one wrapper. On
            desktop About holds by its foot (data-hold) and the night room
            slides up over it, dimming it into dusk; the wrapper ends with the
            night room, so About lets go there (home.css "The curtain"). */}
        <div className="hm-curtain">
        {/* About, "materials": a giant heading, small words in a narrow
            column, and two photographs that pass each other in opposite
            directions. The first is drawn open by a curtain as it arrives; the
            second slides down and across it. A third, small photograph
            (desktop only) rises out of the page under the words, a third
            plane moving at its own pace. */}
        <section id="about" className="h-sec hm-about" data-scene data-hold><div className="h-w hm-about-g">
          <h2 className="h-h2 hm-about-h lk"><span className="hm-ab-w lk-c">About</span> <span className="lk-a"><span className="n-ne">{site.name}</span></span></h2>
          <div className="hm-about-txt">
            <p className="h-lede">{site.name} has worked in Your Trade for <span className="hm-em">00+ years</span>, across all of Your City.</p>
            <p>The work is residential: <a href="/services">service one</a>, service two and service three, each linked to its own page once it is built.</p>
            <p className="hm-about-more"><a className="h-more" href="/about">More about {site.name} &rarr;</a></p>
            <div className="hm-ab3"><div className="hm-ab-in"><Shot name="tall8" sizes="(max-width:1440px) 19vw, 270px" /></div></div>
          </div>
          <div className="hm-about-ph">
            <div className="hm-ab1"><div className="hm-ab-in"><Shot name="tall5" sizes="(max-width:900px) 72vw, (max-width:1440px) 37vw, 530px" /></div></div>
            <div className="hm-ab2"><div className="hm-ab-in"><Shot name="tall1" sizes="(max-width:900px) 58vw, (max-width:1440px) 33vw, 470px" position="55% 30%" /></div></div>
          </div>
        </div></section>

        {/* Services, "the night room": pinned on desktop. The heading holds on
            the left with a large bronze numeral that rolls 01, 02, 03 (CSS
            from data-t, ornament), while the three cards stack on the right,
            each sliding up over the last as it steps back. On phones the cards
            are a plain column and each scales in as it arrives. */}
        <section className="h-night hm-svc" data-scene>
          <div className="hm-svc-stage"><div className="h-w hm-svc-g">
            <div className="hm-svc-head">
              <h2 className="h-h2" data-split>Services</h2>
              <p className="h-lede">Residential and commercial work across Your City.</p>
              <span className="hm-odo" aria-hidden="true"><span>{cards.map((c, i) => <i key={c.name} data-t={`0${i + 1}`} />)}</span></span>
            </div>
            <div className="hm-deck" data-n={cards.length}>
              {cards.map((c, i) => (
                <a className={`hm-card hm-card${i + 1}`} key={c.name} href={c.href} data-scene>
                  <div className="hm-card-ph"><Shot name={c.photo} sizes="(max-width:800px) 92vw, (max-width:1440px) 52vw, 750px" /></div>
                  <div className="hm-card-b">
                    <span className="hm-num" aria-hidden="true" data-t={`0${i + 1}`} />
                    <b>{c.name}</b>
                    <span className="hm-blurb">{c.blurb}</span>
                    <em>{c.cta} <i>&rarr;</i></em>
                  </div>
                </a>
              ))}
            </div>
            <a className="h-more hm-svc-all" href="/services">See all services &rarr;</a>
          </div></div>
        </section>
        </div>

        {/* Recent work, "the walk": the peak of the page. On desktop the
            screen pins and six photographs travel past it sideways, each at
            its own size, height and speed, in front of a huge heading that
            moves slower behind them, with a hairline marking the way. Phones
            get a native swipe row. Each tile is tagged with its trade
            (CSS-drawn from data-t, decorative). */}
        <section className="h-sand hm-walk" data-scene>
          <div className="hm-walk-stage">
            <div className="h-w hm-work-head">
              <div>
                <p className="h-label">The work</p>
                <h2 className="h-h2 hm-walk-h">Recent work</h2>
              </div>
              <a className="h-more" href="/gallery">See the gallery &rarr;</a>
            </div>
            <ul className="hm-work">
              {strip.map(({ k, sizes }) => (
                <li key={k}>
                  <div className="hm-wph"><Shot name={k} sizes={sizes} /></div>
                  <span aria-hidden="true" data-t={photos[k].tag} />
                </li>
              ))}
            </ul>
            <span className="hm-walk-bar" aria-hidden="true" />
          </div>
        </section>


        {/* FAQ, the quiet before the finale: the heading holds still (sticky)
            while the questions pass it, and only the hairlines between them
            draw as each arrives. No h-cv here - containment breaks sticky. */}
        <section className="h-sec hm-faq"><div className="h-w hm-faq-g">
          <div className="hm-faq-head">
            <p className="h-label">Questions</p>
            <h2 className="h-h2">Common questions</h2>
          </div>
          <div className="h-faqs" data-scene>
            {faqs.map((f) => (
              <details className="h-faq" key={f.q} data-scene><summary>{f.q}</summary><p>{f.a}</p></details>
            ))}
          </div>
        </div></section>

        {/* The invitation, "card to full-bleed": on desktop .hm-fin is a tall
            track on paper and the band is its pinned stage. It arrives as a
            framed card, unfolds to the sides and then top and bottom until it
            fills the screen, and then the heading's words rise, all scrubbed
            by the scroll. Phones: the photo fades up as the band arrives.
            The scene is on the track, so the band reads its numbers. */}
        <div className="hm-fin" data-scene>
        <section className="h-final hm-final">
          <div className="h-final-ph" aria-hidden="true"><Shot name="wide12" sizes="100vw" alt="" /></div>
          <div className="h-w">
            <h2 className="h-h2" data-split>Get a price on your project</h2>
            <a className="h-btn" href="/quote">Get a free quote</a>
            <small>Quotes are free and measured on site. Or call <a href={telHref}>{site.phone}</a>.</small>
          </div>
        </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
