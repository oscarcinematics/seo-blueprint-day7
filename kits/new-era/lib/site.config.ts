// THE ONE FILE TO EDIT FIRST. Every page reads from here.
//
// KIT STATE: every value below is a placeholder. /build-website fills this
// file from context/business.md and context/proof/proof-inventory.md, and
// nothing here may be inferred: a value comes from the owner (tier A) or a
// register or live listing (tier B), and the comment beside it says which.
// The name, phone and email placeholders are strings the engine's checkers
// fail on (check_page_done, check_site_complete), so no page can pass while
// one is left.
//
// NAP rule: name, phone and email appear character for character identical
// here, on the Google Business Profile, and on every citation. One phone
// format, never varied.

export const site = {
  // Trading name, on every page, the footer and the GBP.
  name: "Business Name",
  tagline: "Your Trade across Your City.",
  phone: "(555) 010-0199",
  email: "hello@example.com",
  // Service-area business by default: no street address is published until
  // the owner confirms one, and none goes into LocalBusiness schema or onto a
  // Google Business Profile before that.
  address: "Your City",
  city: "Your City",
  region: "Your Region",
  // For the PostalAddress in the schema (app/layout.tsx).
  state: "VIC",
  country: "AU",
  // From the ABN Lookup register.
  abn: "00 000 000 000",
  // Canonicals, the sitemap, robots and every schema URL read this.
  url: "https://yourbusiness.example",
  instagram: "https://www.instagram.com/yourbusiness/",
  facebook: "https://www.facebook.com/yourbusiness",

  // The person behind the business, for the author credit and Person schema on
  // the money pages (on-page-seo.md 10.3 and 13.1). AuthorNote renders nothing
  // while `surname` is empty, so a half name never ships.
  //
  // `experience` is the only credential line: write only what the proof
  // inventory allows (an industry-experience claim is not a founding date).
  owner: {
    // The name customers hear on site; the schema carries the legal one too.
    firstName: "Your",
    legalFirstName: "Your",
    surname: "Name",
    role: "Owner",
    experience: "in the trade for 00+ years",
    /** The closest thing to an author page the site has. */
    url: "/about",
  },

  // The real hours. Never imply 24/7 unless an answering service exists. The
  // footer string and the openingHoursSpecification in app/layout.tsx are
  // both generated from `hoursSpec`, and the Google Business Profile must say
  // exactly the same thing.
  hours: "Mon to Fri 7am-5pm, Sat 8am-2pm",
  hoursSpec: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:00", closes: "17:00" },
    { days: ["Saturday"], opens: "08:00", closes: "14:00" },
  ],

  // The services, in the owner's words. Everything on /services is one of
  // these or a named part of one. Also the schema's knowsAbout and offers.
  trades: ["Service one", "Service two", "Service three"],

  // Never offered, and never to appear on any page.
  neverOffer: [] as string[],

  // Suburbs seen on recent jobs. Worded as places work has been done, never
  // as a coverage promise, unless the owner confirms them as a service list.
  recentSuburbs: ["Area one", "Area two", "Area three", "Area four"],
} as const;

export const telHref = `tel:${site.phone.replace(/[^\d+]/g, "")}`;
