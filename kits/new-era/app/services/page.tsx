// The services INDEX - the hub page of the branch.
//
// A few MAIN services, each linking to its own page, with the related service
// pages listed as links underneath. Four groups do the sorting for the
// visitor; nine cards of equal weight make the visitor do it. Every service
// page is still linked from here with a descriptive anchor, which is what
// pyramid rule 7 and check_site_complete.py's orphan check need.
//
// The groups are set as one pinned "contents" scene on the night ground: a
// list of the group names, one framed photo that changes, the active group's
// words. See the comment above the section, and services.css for the
// choreography and the anchor rules it has to respect.
//
// The groups are DATA - serviceGroups in content/services.ts - never JSX in
// this file. Each group's article id is the lead service's id, so
// /services#<id> lands on the right group; children keep their ids on their
// list item. In the pinned scene that only works because of the
// scroll-margins in services.css, so change the scene's timings there, not
// the markup.
//
// KIT STATE: content/services.ts is empty, so the contents scene is left out
// and the page is the Cover and the Close until the first service page lands.
import { site, telHref } from "@/lib/site.config";
import { gate } from "@/lib/unwritten";
import HomeReveal from "@/components/HomeReveal";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Cover from "@/components/site/Cover";
import Close from "@/components/site/Close";
import Shot from "@/components/site/Shot";
import PageCss from "@/components/site/PageCss";
import { services, serviceGroups } from "@/content/services";

const byId = new Map(services.map((s) => [s.id, s]));

export const metadata = {
  ...gate("/services"),
  title: { absolute: "Your Trade Services in Your City | Business Name" },
  description: "Explore Your Trade services across Your City: service one, service two and service three. Get a free quote from Business Name.",
};

export default function Page() {
  return (
    <div className="h-page" data-head="over">
      <SiteHeader current="/services" />
      <main>
        <PageCss file="services.css" />
        <HomeReveal />
        {/* The opening: the cover (components/site/Cover.tsx), the homepage
            hero's materials with the opposite move. Pick a photo that darkens
            into an evening mood (shade, no bright sky behind the words) and
            that no row below uses. */}
        <Cover
          crumbs={[{ label: "Services" }]}
          lines={[["Your Trade", "c"], ["Services", "c"], ["in Your City", "a"]]}
          lede="Service one, service two and service three, delivered by one team from start to finish."
          photo="tall3"
          position="50% 58%"
        />

        {/* The contents: the groups as one pinned scene on
            the night ground, between the Cover's paper title row and the
            Close's paper heading. Desktop: the four names are a list on the
            left, the active one lit and the rest receded; one framed photo on
            the right is wiped over by the next group's photo as the page
            moves; the active group's words sit under the list. Phones, JS off
            and reduced motion: the same four groups as a plain stack, every
            word visible. Choreography and its reasons: services.css.
            Each article is its own wrapper pair so its words stay together
            in the source (h2, then body, then links, the order search
            engines and screen readers read): .sv-a holds the photo and the
            name, .sv-b the body and links. The numeral is CSS (data-t), so it
            is decoration and not text. */}
        {serviceGroups.length > 0 && (
        <section className="sv-idx h-night">
          {serviceGroups.map((g, i) => {
            const lead = byId.get(g.lead)!;
            return (
              <article className="sv-g" id={lead.id} key={lead.id} data-scene>
                <div className="sv-a">
                  <div className="sv-a-in">
                    <div className="sv-ph">
                      <div className="sv-ph-in">
                        <Shot name={g.photo} sizes="(max-width:999px) 100vw, (max-width:1440px) 40vw, 600px" />
                      </div>
                    </div>
                    <div className="sv-hd">
                      <span className="sv-num" aria-hidden="true" data-t={String(i + 1).padStart(2, "0")} />
                      <h2>{g.name}</h2>
                    </div>
                  </div>
                </div>
                <div className="sv-b">
                  <div className="sv-b-in">
                    <p>{lead.body}</p>
                    <a className="sv-go" href={lead.href}>{lead.anchor} <i>&rarr;</i></a>
                    {g.children.length > 0 && (
                      <ul className="sv-kids">
                        {g.children.map(({ id, label }) => {
                          const c = byId.get(id)!;
                          return <li key={c.id} id={c.id}><a href={c.href}>{label}</a></li>;
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
        )}

        {/* The close (round 7): the Cover's bookend, components/site/Close.tsx.
            The heading waits on paper and the photo rises behind it. */}
        <Close lines={["Working across", "all of Your City"]} photo="tall1" position="50% 70%">
          <p className="h-lede">Recent jobs in {site.recentSuburbs.join(", ")}.</p>
          <a className="h-btn h-btn-light" href="/contact">Talk to {site.name}</a>
          <small>Or call <a href={telHref}>{site.phone}</a>.</small>
        </Close>
      </main>
      <SiteFooter />
    </div>
  );
}
