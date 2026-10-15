// The blog INDEX - the hub of the informational branch.
//
// Built to rule 7 of references/pyramid-structure.md, same as /services: an H1
// naming the branch, a short intro, then one card per child. It is an index,
// never an article - the gate in the engine's code/ fails this page if
// it contains an <article>, a <form>, offer pricing, or an H1 that matches any
// post's H1.
//
// Each card is a single <a> carrying the post's own hero photo, so a click
// anywhere on it works. No <article> blocks: check_site_complete.py fails this
// page outright if the rendered HTML contains "<article".
//
// The shared Cover and Close bracket the posts, and
// the posts sit between them on the night ground, so the page has three
// grounds in three scenes (app/pages/blog.css):
//   Cover    the photograph closes in to a plate over BLOG (shared)
//   Feature  night. The newest post as a spread: its photo across seven
//            columns, swept open on a slant, the words still beside it
//   Close    paper, the photograph rises behind "Rather speak to someone"
// Posts two onward drop into a 3-column grid under the feature, each card
// rising in a column stagger, so the layout grows with content/posts.ts on
// its own.
//
// The cards are DATA, in content/posts.ts, never JSX in this file. Adding a
// post means adding an object to that list.
//
// While content/posts.ts is empty the page is noindex and out of the sitemap,
// because an index with nothing on it is thin content, and it shows an empty
// state that routes people to what DOES exist. Both lift by themselves when
// the first post lands - see lib/unwritten.ts.
import { site, telHref } from "@/lib/site.config";
import { gate } from "@/lib/unwritten";
import HomeReveal from "@/components/HomeReveal";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Cover from "@/components/site/Cover";
import Close from "@/components/site/Close";
import Shot from "@/components/site/Shot";
import PageCss from "@/components/site/PageCss";
import { livePosts, type Post } from "@/content/posts";

export const metadata = {
  ...gate("/blog"),
  title: { absolute: "Your City Your Trade Blog - Costs | Business Name" },
  description: "Explore the Your City Your Trade blog from Business Name. Read our guides to costs, materials and the questions to ask before getting a quote.",
};

const DATE = new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "long", year: "numeric" });


/**
 * One post card. The whole card is the link.
 *
 * The title is a <b>, not an <h2>. An <h2> inside an <a> is valid, but it puts
 * a heading in the accessibility tree whose entire text is the link text, so a
 * screen reader announces the same words twice. The visual weight comes from
 * CSS, and the page keeps one H1 and no competing headings - which is also
 * what the index gate wants.
 *
 * Every card is its own scroll scene (data-scene): the feature's photo is
 * swept open by its own pass, and each grid card rises on its own arrival.
 */
function Card({ post, feature }: { post: Post; feature?: boolean }) {
  const when = post.updated ?? post.published;
  return (
    <a className={feature ? "bl-post bl-feat" : "bl-post"} href={`/blog/${post.slug}`} data-scene="">
      {post.photo && (
        <div className="bl-ph">
          {/* Decorative: the title beside it says what the post is, so a real
              alt would be read out twice. Never priority: the Cover photo is
              the page's one first-screen image. */}
          <div className="bl-sw">
            <Shot
              name={post.photo}
              sizes={feature ? "(max-width:900px) 100vw, (max-width:1440px) 54vw, 780px" : "(max-width:700px) calc(100vw - 40px), (max-width:1100px) 46vw, 420px"}
              alt=""
              eager={feature}
            />
          </div>
        </div>
      )}
      <div className="bl-b">
        <div className="bl-meta">
          {post.tag && <span className="bl-tag">{post.tag}</span>}
          <time dateTime={when}>
            {post.updated ? `Updated ${DATE.format(new Date(when))}` : DATE.format(new Date(when))}
          </time>
        </div>
        <b>{post.title}</b>
        <p>{post.excerpt}</p>
        <em>Read the guide <i>&rarr;</i></em>
      </div>
    </a>
  );
}

export default function Page() {
  const posts = livePosts();

  return (
    <div className="h-page" data-head="over">
      <SiteHeader current="/blog" />
      <main>
        <PageCss file="blog.css" />
        <HomeReveal />

        {/* The opening: the shared Cover, components/site/Cover.tsx. The
            page has no intro line, so the Cover is the photograph and the h1
            alone. Not the feature post's own photo, so it is not shown big
            twice. */}
        <Cover
          crumbs={[{ label: "Blog" }]}
          lines={[["Blog", "c"]]}
          photo="tall6"
          position="50% 62%"
        />

        {posts.length > 0 ? (
          // Night on a desktop with the scenes running: the posts are the
          // page's one dark room, between the paper of the Cover's title row
          // and the paper the Close opens on. Paper wherever the Cover and
          // the Close stay photographs (phones, JS off, reduced motion), so
          // the page never runs dark from top to bottom (blog.css).
          <section className="bl-sec"><div className="h-w">
            <div className="bl-posts">
              <Card post={posts[0]} feature />
              {posts.length > 1 && (
                <div className="bl-grid">
                  {posts.slice(1).map((p) => <Card key={p.slug} post={p} />)}
                </div>
              )}
            </div>
          </div></section>
        ) : (
          // The empty state. It says the true thing once and then gets out of
          // the way - a quote answers the cost questions better than a post
          // about costs, and that is where someone reading this wants to go.
          <section className="h-sec bl-empty"><div className="h-w">
            <h2 className="h-h2 h-rv">Nothing published yet</h2>
            <div className="bl-empty-act">
              <a className="h-btn h-rv" href="/quote">Get a free quote</a>
            </div>
          </div></section>
        )}


        {/* The closing band is for readers who came for a post and finished it.
            With nothing to read, it would just be a second big button under the
            first - two competing actions on a page whose whole job right now is
            to point at one. So it only ships once there are posts.
            The shared Close (components/site/Close.tsx), on a photo that
            appears nowhere else on the page. */}
        {posts.length > 0 && (
          <Close lines={["Rather speak", "to someone"]} photo="tall8" position="50% 70%">
            <p className="h-lede">{site.trades.join(", ")} across {site.city}.</p>
            <a className="h-btn h-btn-light" href="/services">See what we do</a>
            <small>Or call <a href={telHref}>{site.phone}</a>.</small>
          </Close>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
