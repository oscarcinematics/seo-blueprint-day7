// The author credit, plus the Person schema that goes with it.
//
// Two checks in the engine's references/on-page-seo.md want this
// and nothing else on the site satisfies them: 10.3, Person schema on content
// linked to a real author page, and 13.1, a named author with a real bio and
// credentials. Google's raters read a trade page written by nobody as a page
// with nothing behind it.
//
// RENDERS NOTHING while site.owner.surname is empty. That is deliberate and is
// explained where the field is defined: a credit with a first name on its own
// fails 13.1 exactly as hard as no credit does, and ships half a name to a live
// page in the meantime. Fill the surname in lib/site.config.ts and this
// appears, here and on every page that calls it.
//
// The two sentences below are the whole bio, and they stay short: a byline
// carries only what proof-inventory.md allows about the owner (that they run
// the business, and site.owner.experience). No licence, insurance, job count,
// team size or year unless the inventory holds it. Do not pad this with
// anything that sounds like a credential - that is the one thing a byline
// must not do. When a real credential is confirmed it goes in site.owner,
// not inline here.
import { site } from "@/lib/site.config";

export default function AuthorNote() {
  const { firstName, legalFirstName, surname, role, experience, url } = site.owner;
  if (!surname) return null;

  const name = `${firstName} ${surname}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}${url}#person`,
    // `name` is the byline as customers know the owner. givenName/familyName carry
    // the legal name so the entity resolves cleanly, and alternateName ties the
    // two together rather than leaving Google to guess they are one person.
    name,
    givenName: legalFirstName,
    familyName: surname,
    alternateName: firstName,
    jobTitle: role,
    description: `${role} of ${site.name}, ${experience}.`,
    url: `${site.url}${url}`,
    worksFor: { "@id": `${site.url}/#business` },
  };

  return (
    <section className="h-sec" style={{ paddingTop: "clamp(48px, 6vw, 96px)", paddingBottom: "clamp(48px, 6vw, 96px)" }}><div className="h-w">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div
        className="h-rv"
        style={{
          maxWidth: "720px",
          padding: "22px 0",
          borderTop: "1px solid var(--h-line)",
          borderBottom: "1px solid var(--h-line)",
        }}
      >
        <p style={{ margin: 0, color: "var(--h-body)", fontSize: "15px", lineHeight: 1.7 }}>
          Written by <a href={url}>{name}</a>, who runs {site.name} and has been {experience}.
          You can <a href="/contact">talk to them directly</a> about your job.
        </p>
      </div>
    </div></section>
  );
}
