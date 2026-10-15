// THE BLOG POST TEMPLATE. /blog-post and /scale-map copy this folder to
// app/blog/<slug>/ and rewrite every word for one keyword-map row. Next.js
// does not publish a folder that starts with "_", and the checkers skip it,
// so this page is never live. A reading page; the layout and its motion are
// app/pages/post.css (prefix po-).
//
// KIT STATE: the words are placeholders in the shape of a cost post (the
// kind of post this layout was built and approved on): an answer box, ten
// sections, three sourced tables and a worked sum, five FAQs. Every section
// shows one of the layout's blocks, so delete the ones a post does not need.
//
// The structure, top to bottom (copy it; change the words, photos and toc):
//   masthead   breadcrumb, then the kicker line, H1 and standfirst on the
//              article's reading scale (brand.css .n-art-*), in the text
//              column; the hero photo across the full width under them.
//   .po-body   ONE paper ground for the whole article, a [data-scene]. On a
//              desktop it is a 12-column grid: the "On this page" list is a
//              sticky rail on columns 1 to 3 with a reading-progress line
//              (the body's --pin), and the article runs down a 720px text
//              column from column 5. The answer box comes first, then one
//              <section className="po-sec"> per H2, in order. Rhythm comes
//              from type, rules and photos, not from striped grounds.
//   photos     each is its own [data-scene] and sits in the source exactly
//              where it breaks the text (check_page_rhythm reads the source
//              order). Four shapes, each with its own quiet move:
//                .po-fig    captioned, 3:2, wider than the text column;
//                           settles from a closer crop as it arrives
//                .po-strip  uncaptioned, 2:1, as wide; pans slowly sideways
//                           as it is read past
//                .po-side   half width, a caption or one paragraph beside
//                           it; drifts upward inside its frame
//                .po-inset  a small photo (a source under 800px wide), its
//                           caption beside it; rises in
//   tables     real <table className="n-tbl po-tbl">, ruled ledgers as wide
//              as the photos; their top rule draws as they arrive. They are
//              gap-breakers for check_page_rhythm, so never turn one into
//              divs.
//   after      the bridge section on the night ground (.po-plan), the
//              author note, and the shared Close (components/site/Close.tsx)
//              whose lines join to the closing H2.
// No words move in the reading column: no split headings, no fading
// paragraphs. A post with more or fewer than ten sections needs nothing
// changed: the rail spans every row of the body grid by itself.
//
// Keywords, from the keyword-map row, placed where a reader meets them:
//   primary   title, H1, the short answer, one FAQ
//   secondary one H2 each, phrased as the buyer searches it
//
// Buyer: the matching block in context/buyers.md.
//
// PRICES AND FIGURES. Every number on a post is either in
// context/proof/proof-inventory.md or a third party's with a live link to
// where it was read (the S list below). Nothing third-party may be reworded
// into "we charge" or "our price". A worked example is arithmetic on a cited
// table, labelled as such, never a quote.
import { site, telHref } from "@/lib/site.config";
import { gate } from "@/lib/unwritten";
import HomeReveal from "@/components/HomeReveal";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import Shot from "@/components/site/Shot";
import AuthorNote from "@/components/site/AuthorNote";
import Close from "@/components/site/Close";
import PageCss from "@/components/site/PageCss";
import { photos } from "@/lib/photos";
import ScheduledLink from "@/components/site/ScheduledLink";

const ROUTE = "/blog/_template";
const PUBLISHED = "2026-01-01";
const H1 = "How Much Does Service One Cost in Your City?";

// The post's own share image, 1200x630, cut from its hero photo with sharp
// and saved as public/images/og/<slug>.jpg. Without it every blog link shares
// the generic site card, which is the same picture for every page.
const OG = "/images/og/placeholder.jpg";
const OG_ALT = "What the hero photo shows";
const base = gate(ROUTE, "article");

export const metadata = {
  ...base,
  // Under 60 characters: front-load the keyword, carry the year, one power
  // word at most. Variants go in optimization-log.md.
  title: { absolute: "Service One Cost in Your City: Real 2026 Prices" },
  description:
    "Service one cost in Your City for 2026: typical prices by job, real quotes, and the hidden costs. Every number sourced.",
  openGraph: { ...base.openGraph, images: [{ url: OG, width: 1200, height: 630, alt: OG_ALT }] },
  twitter: { card: "summary_large_image" as const, images: [OG] },
};

// Every external source, named once. Each figure on the page links to one of
// these, and each must return 200 on the day the post is written.
const S = {
  sourceA: "https://www.example.com/source-a",
  sourceB: "https://www.example.com/source-b",
  sourceC: "https://www.example.com/source-c",
  forum: "https://www.example.com/forum-thread",
  regulator: "https://www.example.com/regulator",
} as const;

// An outbound citation. New tab, so the reader keeps their place.
function Src({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noopener">{children}</a>;
}

// The main table. Rendered from this array so the numbers live in one place.
const perM2: [string, string, React.ReactNode][] = [
  ["Job one", "$0 to $0 per unit", <Src key="a" href={S.sourceA}>Source A</Src>],
  ["Job two", "$0 to $0 per unit", <Src key="b" href={S.sourceB}>Source B</Src>],
  ["Job three", "$0 to $0 per unit", <Src key="c" href={S.sourceA}>Source A</Src>],
  ["Job four", "$0 to $0 per unit", <span key="d"><Src href={S.sourceB}>Source B</Src> and <Src href={S.sourceC}>Source C</Src></span>],
  ["Labour", "$0 to $0 an hour", <Src key="e" href={S.sourceC}>Source C</Src>],
];

// Real quotes from real buyers, verbatim figures from the threads.
const quoted: [string, string, string, React.ReactNode][] = [
  ["Your City, Month 2026", "What the job was, in the buyer's words", "$0", <Src key="a" href={S.forum}>Forum name</Src>],
  ["Your City, Month 2025", "What the job was, in the buyer's words", "$0", <Src key="b" href={S.forum}>Forum name</Src>],
  ["Your Region, Month 2025", "What the job was, in the buyer's words", "$0", <Src key="c" href={S.forum}>Forum name</Src>],
];

// A short two-column ledger.
const designFees: [string, string][] = [
  ["The low end of the range", "$0"],
  ["A typical job", "$0"],
  ["The high end of the range", "$0"],
];

// The costs a headline price never shows.
const hidden: [string, string, React.ReactNode][] = [
  ["Hidden cost one", "$0", <Src key="a" href={S.regulator}>The regulator</Src>],
  ["Hidden cost two", "$0 to $0", <Src key="b" href={S.sourceA}>Source A</Src>],
  ["Hidden cost three", "$0 to $0", <Src key="c" href={S.sourceB}>Source B</Src>],
];

// Answers stay straight - these are what AI Overviews and People Also Ask lift.
// Every figure in them is linked where it first appears in the body.
const faqs = [
  {
    q: "How much does service one cost in Your City?",
    a: "The direct answer in two or three sentences, with the typical range and what moves it. Every figure here is linked where it first appears in the body.",
  },
  {
    q: "What's a realistic budget for a typical job?",
    a: "The direct answer in two or three sentences.",
  },
  {
    q: "Why is it so expensive?",
    a: "The direct answer in two or three sentences: the costs behind the headline price.",
  },
  {
    q: "Do I need a permit?",
    a: "The direct answer in two or three sentences, and who to check with.",
  },
  {
    q: "How do I compare quotes fairly?",
    a: "The direct answer in two or three sentences: what to ask for, and what to check each quote leaves out.",
  },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: H1,
  description: metadata.description,
  datePublished: PUBLISHED,
  dateModified: PUBLISHED,
  inLanguage: "en-AU",
  mainEntityOfPage: `${site.url}${ROUTE}`,
  image: [`${site.url}${OG}`, `${site.url}/images/work/${photos.wide1.slug}-1600.webp`],
  author: { "@type": "Person", "@id": `${site.url}${site.owner.url}#person`, name: `${site.owner.firstName} ${site.owner.surname}` },
  publisher: { "@type": "LocalBusiness", "@id": `${site.url}/#business`, name: site.name },
  about: { "@type": "Thing", name: "Service one costs in Your City" },
};

const toc = [
  ["by-job", "Prices by job"],
  ["whole-job", "What a whole job costs"],
  ["quotes-vary", "Why quotes for the same job vary"],
  ["cost-drivers", "What pushes the price up"],
  ["permits", "Permits, contracts and deposits"],
  ["fees", "A second cost buyers ask about"],
  ["calculator", "Working out your own estimate"],
  ["save", "Cutting the cost without regretting it"],
  ["how-we-price", "How we price a job"],
  ["faq", "Questions people ask"],
] as const;

const DATE = new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "long", year: "numeric" });

// The hero is the LCP element, and its one preload is Shot's own: a priority
// Shot writes a <link rel=preload> for its AVIF set (components/site/Shot.tsx,
// 5 Oct 2026). This page used to add a WebP preload of the same photo through
// ReactDOM.preload; beside the AVIF <picture> that downloaded the LCP image
// twice, so it is gone.
const HERO_WIDTHS = [400, 600, 800, 1200, 1600];
// The hero spans the content's full width on a desktop; below 1000px it
// takes the 720px reading column, inside the gutters.
const HERO_SIZES = "(max-width:760px) calc(100vw - 40px), (max-width:999px) 720px, (max-width:1440px) 93vw, 1332px";

// What each photo shape really renders at (app/pages/post.css): the wide
// shapes take 8 of the 12 columns from 1000px, the 720px reading column
// below that, and the whole screen on a phone (they run edge to edge);
// .po-side takes half of that, and .po-inset is capped at 420px.
const WIDE = "(max-width:700px) 100vw, (max-width:999px) 720px, (max-width:1440px) 62vw, 888px";
const SIDE = "(max-width:700px) 100vw, (max-width:999px) 360px, (max-width:1440px) 31vw, 444px";
const INSET = "(max-width:700px) calc(100vw - 40px), 420px";

export default function Page() {
  const author = `${site.owner.firstName} ${site.owner.surname}`;
  return (
    <div className="h-page">
      <SiteHeader current="/blog" />
      <main className="n-article po">
        <PageCss file="post.css" />
        <HomeReveal />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

        <Breadcrumbs trail={[{ href: "/blog", label: "Blog" }, { label: "Service one costs" }]} />

        {/* 1-3. The masthead: kicker line, H1, then the proof line as the
            standfirst, in the article's text column, then the hero across
            the full width. Paper, left aligned, so the post opens like an
            article instead of a landing page. The reading scale (H1 60px,
            Epilogue 500) is brand.css .n-art-head. Do not put the tinted
            hero band (h-phero), or the Cover, on a blog post, and do not
            centre this. */}
        <section className="po-mast"><div className="h-w po-g">
          <header className="n-art-head">
            <p className="n-art-meta">
              <b>Costs</b> <span aria-hidden="true">·</span>{" "}
              <time dateTime={PUBLISHED}>{DATE.format(new Date(PUBLISHED))}</time>{" "}
              <span aria-hidden="true">·</span> <a href={site.owner.url}>{author}</a>
            </p>
            <h1>{H1}</h1>
            <p className="n-art-lede">
              One proof line from the inventory about who wrote this and how they price. Then what the reader gets from the post, and that every
              number is sourced.
            </p>
          </header>

          <figure className="n-art-hero po-hero">
            <span className="n-art-tag">Price guide</span>
            <div className="n-svc-ph"><Shot
              name="wide1"
              sizes={HERO_SIZES}
              variant={{ ratio: "16x9", widths: HERO_WIDTHS }}
              priority
            /></div>
            <figcaption>One line on what the hero photo shows, tied to the topic.</figcaption>
          </figure>
        </div></section>

        {/* The article: one paper ground, one scene. Its --pin (0 as the
            body's top reaches the top of the screen, 1 as its foot reaches
            the foot) is the rail's reading-progress line. */}
        <div className="po-body" data-scene>
          <div className="h-w po-g">

            {/* The 40-60 word liftable answer. The first thing under the
                photo, self-contained, boxed and labelled so it reads as the
                answer rather than a paragraph nobody introduced. */}
            <div className="n-answer">
              <span>The short answer</span>
              <p>
                Service one in Your City usually costs <Src href={S.sourceA}>$0 to $0</Src> for a typical job, and bigger jobs run past
                $0. By the unit, job one is about <Src href={S.sourceA}>$0 to $0</Src> and job two <Src href={S.sourceB}>$0 to $0</Src>.
                Name the one or two things that move it most.
              </p>
            </div>

            {/* The rail on a desktop (sticky beside the text column), the
                boxed contents list on a phone. */}
            <nav className="n-toc po-rail" aria-label="On this page">
              <p>On this page</p>
              <ol>
                {toc.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}
              </ol>
            </nav>

            {/* The main table. */}
            <section id="by-job" className="po-sec">
              <p className="h-kicker">Prices by job</p>
              <h2 className="h-h2s">Service One Cost by Job in Your City</h2>
              <p>The direct answer to the H2 in its first two sentences: what the price depends on most, and the cheapest and dearest ends of the range, with a link to the <a href="/services">service page</a>.</p>
              <p>A second paragraph on why the ranges are wide, in the voice in context/voice.md.</p>
              <table className="n-tbl po-tbl" data-scene>
                <caption>Typical prices, supplied and installed unless marked. Sources dated 2025 to 2026.</caption>
                <thead><tr><th scope="col">Job</th><th scope="col">Typical price</th><th scope="col">Source</th></tr></thead>
                <tbody>
                  {perM2.map(([job, price, src]) => (
                    <tr key={job}><th scope="row">{job}</th><td>{price}</td><td>{src}</td></tr>
                  ))}
                </tbody>
              </table>
              <p>One paragraph on how to read the table: what it prices, and what it leaves out.</p>
            </section>

            {/* An uncaptioned strip, then a second sourced table. */}
            <section id="whole-job" className="po-sec">
              <p className="h-kicker">Whole jobs</p>
              <h2 className="h-h2s">How Much Does a Whole Job Cost?</h2>
              <div className="po-strip" data-scene><Shot name="wide6" sizes={WIDE} /></div>
              <p>The direct answer: where most whole jobs land, and what pushes the big ones higher, each figure linked to <Src href={S.sourceC}>its source</Src>.</p>
              <p>A paragraph on why real quotes sit above the averages.</p>
              <p>A paragraph on why size alone barely predicts the price, with two examples from the table below.</p>
              <table className="n-tbl po-tbl" data-scene>
                <caption>What real buyers were quoted, in their own forum posts.</caption>
                <thead><tr><th scope="col">Where and when</th><th scope="col">The job</th><th scope="col">Quoted</th><th scope="col">Source</th></tr></thead>
                <tbody>
                  {quoted.map(([where, job, price, src]) => (
                    <tr key={where}><th scope="row">{where}</th><td>{job}</td><td>{price}</td><td>{src}</td></tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Why quotes vary, with the first in-body CTA about a third of
                the way down, and the small inset photo (a source under 800px
                wide) with its caption beside it. */}
            <section id="quotes-vary" className="po-sec">
              <p className="h-kicker">Comparing quotes</p>
              <h2 className="h-h2s">Why Do Quotes for the Same Job Vary So Much?</h2>
              <p>The direct answer: quotes rarely price the same job. Say what one includes and another leaves out, and what to ask.</p>
              <p>A real example from a forum, with the figures linked to <Src href={S.forum}>the thread</Src> and one short quote from it.</p>
              <p>A paragraph on why a big number is not always greed.</p>
              <figure className="po-inset" data-scene>
                <div className="po-ph"><Shot name="small1" sizes={INSET} /></div>
                <figcaption>A caption that names what is in the photo and ties it to the point: several parts of the job, so several lines on an honest quote.</figcaption>
              </figure>
              <p>A paragraph on missing lines, the other trap.</p>
              <p>A paragraph on how this business quotes, linking the <a href="/quote">quote page</a>.</p>
            </section>

            {/* Cost drivers: h3 subsections, a captioned figure, a half-width
                side photo and a third table. */}
            <section id="cost-drivers" className="po-sec">
              <p className="h-kicker">Hidden costs</p>
              <h2 className="h-h2s">What Pushes the Cost Up in Your City?</h2>
              <p>The direct answer: the three or four things that push the price up, with one expert figure linked to <Src href={S.sourceC}>its source</Src>.</p>
              <h3>Cost driver one</h3>
              <p>Two or three sentences, with the regulator's figure linked to <Src href={S.regulator}>the regulator</Src>.</p>
              <p>A second paragraph with a real example.</p>
              <figure className="po-fig" data-scene>
                <div className="po-ph"><Shot name="wide8" sizes={WIDE} /></div>
                <figcaption>A caption that ties the photo to this cost driver.</figcaption>
              </figure>
              <h3>Cost driver two</h3>
              <p>Two or three sentences on a local condition, linked to a local source.</p>
              <p>A second paragraph on what it means on the day.</p>
              <figure className="po-side" data-scene>
                <div className="po-ph"><Shot name="tall8" sizes={SIDE} /></div>
                <figcaption>A caption that ties the photo to the next cost driver.</figcaption>
              </figure>
              <h3>Cost driver three</h3>
              <p>Two or three sentences, linking a related post with a <ScheduledLink href="/blog">ScheduledLink</ScheduledLink> so it stays plain text until that post's date.</p>
              <p>One practical thing the reader can check before anyone quotes.</p>
              <h3>Cost driver four</h3>
              <p>Two or three sentences, each figure linked to its source.</p>
              <table className="n-tbl po-tbl" data-scene>
                <caption>The costs a headline price never shows.</caption>
                <thead><tr><th scope="col">Cost</th><th scope="col">Price</th><th scope="col">Source</th></tr></thead>
                <tbody>
                  {hidden.map(([what, price, src]) => (
                    <tr key={what}><th scope="row">{what}</th><td>{price}</td><td>{src}</td></tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Rules. Regulatory statements, all linked to the regulator. A
                4:3 strip from the pre-cut variant files. */}
            <section id="permits" className="po-sec">
              <p className="h-kicker">The rules</p>
              <h2 className="h-h2s">Do You Need a Permit?</h2>
              <p>The direct answer: most jobs do not, and the few that do, each linked to <Src href={S.regulator}>the regulator</Src>.</p>
              <p>A paragraph on what a permit costs in time as well as fees.</p>
              <div className="po-strip" data-scene><Shot
                name="tall6"
                sizes={WIDE}
                variant={{ ratio: "4x3", widths: [400, 600, 800, 1200] }}
              /></div>
              <p>A paragraph on local rules that change by council.</p>
              <h3>Contracts and deposits</h3>
              <p>The consumer regulator's contract and deposit rules, linked.</p>
              <p>What that means for the reader, and one free check to do before work starts.</p>
            </section>

            {/* A short two-column ledger. */}
            <section id="fees" className="po-sec">
              <p className="h-kicker">Second cost</p>
              <h2 className="h-h2s">How Much Does the Second Cost Cost?</h2>
              <p>The direct answer with the typical figure linked to <Src href={S.sourceA}>its source</Src>, and what moves it.</p>
              <table className="n-tbl po-tbl" data-scene>
                <caption>Typical fees, from <Src href={S.sourceA}>Source A</Src>. GST included.</caption>
                <thead><tr><th scope="col">What you get</th><th scope="col">Typical fee</th></tr></thead>
                <tbody>
                  {designFees.map(([what, fee]) => <tr key={what}><th scope="row">{what}</th><td>{fee}</td></tr>)}
                </tbody>
              </table>
              <p>A paragraph on when the cost earns its keep, with a real example.</p>
              <p>A paragraph on what happens without it.</p>
            </section>

            {/* The worked example is arithmetic on the table above, labelled
                as such; its total row closes on a double rule, as a ledger's
                sum does. */}
            <section id="calculator" className="po-sec">
              <p className="h-kicker">Do the sum</p>
              <h2 className="h-h2s">Is There a Cost Calculator?</h2>
              <p>The direct answer, then how to do the same sum yourself in five minutes.</p>
              <ol>
                <li><b>Split the job into parts.</b> One line.</li>
                <li><b>Measure each part.</b> One line.</li>
                <li><b>Multiply by the low and high rates</b> from the table at the top of this page.</li>
                <li><b>Add the hidden costs.</b> One line.</li>
                <li><b>Add a margin</b> for a difficult site, the range the cited expert gives.</li>
              </ol>
              <table className="n-tbl po-tbl po-sum" data-scene>
                <caption>Worked example on an easy site. Arithmetic on the rates above, not a quote.</caption>
                <thead><tr><th scope="col">Part</th><th scope="col">Sum</th><th scope="col">Range</th></tr></thead>
                <tbody>
                  <tr><th scope="row">Part one</th><td>0 x $0 to $0</td><td>$0 to $0</td></tr>
                  <tr><th scope="row">Part two</th><td>0 x $0 to $0</td><td>$0 to $0</td></tr>
                  <tr><th scope="row">Part three</th><td>0 x $0 to $0</td><td>$0 to $0</td></tr>
                  <tr><th scope="row">Total, before hidden costs</th><td>Add the three</td><td>$0 to $0</td></tr>
                </tbody>
              </table>
              <p>One sentence on what the estimate is good for, and what it is not.</p>
              <figure className="po-fig" data-scene>
                <div className="po-ph"><Shot name="tall3" sizes={WIDE} /></div>
                <figcaption>A caption tying the photo to the sum.</figcaption>
              </figure>
            </section>

            {/* Saving money. An uncaptioned strip first. */}
            <section id="save" className="po-sec">
              <p className="h-kicker">Spending less</p>
              <h2 className="h-h2s">How Can You Cut the Cost Without Regretting It?</h2>
              <div className="po-strip" data-scene><Shot name="wide2" sizes={WIDE} /></div>
              <p>The direct answer: the safest way to save, and what never to skip.</p>
              <p>An expert example, linked to <Src href={S.sourceC}>its source</Src>.</p>
              <p>Two more savings that add up.</p>
              <p>What not to cheap out on, and why it is tempting.</p>
              <p>One line on timing, with a forum quote linked to <Src href={S.forum}>the thread</Src>.</p>
            </section>

            {/* What the business does, from the practices already stated on
                the money page: no prices, job counts or results unless the
                inventory holds them. The 4:3 side photo stands beside the one
                paragraph it introduces. */}
            <section id="how-we-price" className="po-sec">
              <p className="h-kicker">From the field</p>
              <h2 className="h-h2s">How We Price a Job</h2>
              <div className="po-side" data-scene>
                <div className="po-ph"><Shot
                  name="tall4"
                  sizes={SIDE}
                  variant={{ ratio: "4x3", widths: [400, 600, 800, 1200] }}
                /></div>
                <p>One paragraph in the owner's voice on how a number gets built at {site.name}, from the site visit to the itemised list.</p>
              </div>
              <ol>
                <li><b>Step one of the quote.</b> One line.</li>
                <li><b>Step two.</b> One line.</li>
                <li><b>Step three.</b> One line, linking a related <ScheduledLink href="/services">service page</ScheduledLink>.</li>
                <li><b>Every line is itemised.</b> One line.</li>
                <li><b>Who does the work.</b> One line.</li>
              </ol>
              <p>If you'd like to see the list for your own job, <a href="/quote">book a free, measured quote</a>.</p>
              <figure className="po-fig" data-scene>
                <div className="po-ph"><Shot name="wide4" sizes={WIDE} /></div>
                <figcaption>A caption tying the photo to an itemised quote.</figcaption>
              </figure>
            </section>

            {/* FAQ, straight. The last section of the article, still on its
                one ground and still beside the rail. */}
            <section id="faq" className="po-sec">
              <p className="h-kicker">Questions</p>
              <h2 className="h-h2s">Service One Cost Questions</h2>
              <div className="h-faqs">
                {faqs.map((f, i) => (
                  <details className="h-faq" key={f.q} open={i === 0}>
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* The bridge CTA to the money page, which is also the hub. The one
            "read next" link on the page. Night: the article's one ground ends
            here, so the turn from reading to acting is a change of ground.
            The heading and words hold still; the photo opens from its centre
            line as the band arrives. */}
        <section className="h-night po-plan" data-scene><div className="h-w po-plan-g">
          <h2 className="h-h2s">Planning a Job in Your City?</h2>
          <div className="po-plan-ph"><div className="po-ph"><Shot
            name="tall2"
            sizes="(max-width:700px) 100vw, (max-width:999px) calc(100vw - 60px), (max-width:1440px) 46vw, 666px"
            variant={{ ratio: "4x3", widths: [400, 600, 800, 1200] }}
          /></div></div>
          <div className="po-plan-b">
            <p>One paragraph on what the ranges above tell the reader, and what a site visit adds.</p>
            <p>Our <a href="/services">services in Your City</a> cover every part of this post. Quotes are free, measured on site and itemised.</p>
            <p className="po-plan-act"><a className="h-btn" href="/quote">Get a free quote</a></p>
          </div>
        </div></section>

        {/* Author box and Person schema. */}
        <AuthorNote />

        {/* The close: the shared Close (components/site/Close.tsx), on a
            photo no other page ends on, with the evening mood the Close
            wants. */}
        <Close lines={["Want the Number", "for Your Job?"]} photo="wide10" position="50% 70%">
          <p className="h-lede">Free, measured on site and itemised, with no obligation to go ahead.</p>
          <a className="h-btn h-btn-light" href="/quote">Get a free quote</a>
          <small>Or call <a href={telHref}>{site.phone}</a>.</small>
        </Close>
      </main>
      <SiteFooter />
    </div>
  );
}
