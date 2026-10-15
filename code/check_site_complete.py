#!/usr/bin/env python3
"""The /build-website exit gate. The run is not done until this passes.

    python3 code/check_site_complete.py [--core] [--port N | --base URL]

--core is for day one (/build-website, the first /publish): the core pages
must be done, but keyword-map rows do not need a page yet.

Run from the site folder. Looks at localhost:DEV_PORT (from .env) unless
--port or --base is given.



Checks the three ways a "finished" build has actually shipped half-done:
  1. A route that errors or 404s
  2. Placeholder text still on a page (Business Name, (555)..., Service one...)
  3. Keyword-map rows with no route (the pyramid never got built)
"""

import re
import sys
import urllib.request
from pathlib import Path

from _site import ROOT, SITE, base_url

# Any site, any stack: --base https://example.com (imported site, WordPress,
# staging). With --base, routes are discovered by CRAWLING from / instead of
# walking website/app, so the checks work on sites this repo didn't build.
BASE = base_url()

PLACEHOLDERS = [
    "Business Name", "(555) 010-0199", "(555) 555-5555", "hello@example.com",
    "hello@yourbusiness.example", "000 Example Street", "Your City",
    "Licence #000000", "Service one", "Area one", "Trade &amp; Speciality",
    "Trade & Speciality", "A headline with a bit of swagger",
    "One quiet line about the work", "Engagement one", "Publication",
    "Customer name", "Client name", "000+ verified",
    # frame labels that must not survive once real photos are placed
    "CREW &amp; VAN", "ON THE JOB", "FINISHED INSTALL", "JOB PHOTO",
    "PORTRAIT", "SIGNATURE FRAME", "US, WORKING", "THE CREW, 2026",
    "Project · location", "Month 2026", "Choose one", "yourbusiness",
    "From $0,000", "From $000", "$0M insured", "Example Street",
    "00 000 000 000",  # the kit's placeholder ABN
]

# Shape-based patterns: catch placeholders nobody thought to list.
PLACEHOLDER_PATTERNS = [
    # (?<![\d,]) so the "000," inside a real "$20,000," is not a zeroed frame
    (r"(?<![\d,])0{2,}[,+]|\b0,000\b", "zeroed-out number (00+, 0,000)"),
    (r"\$0[,0]*\b|\bFrom \$0", "zeroed-out price ($0, From $000)"),
    (r"\(555\) ?\d{3}", "555 phone number"),
    (r"\b[Ll]orem\b|\bipsum\b", "lorem ipsum"),
    (r"TODO|FIXME|PLACEHOLDER|placeholder", "literal TODO/placeholder marker"),
    (r"Add your real|Replace with|Fill this in|goes here\b", "instruction text left on page"),
    (r"Your (City|Business|Name|Trade)\b", "Your X template phrase"),
    (r"@(example|yourbusiness)\.", "example email domain"),
    (r"\b00 Month\b|\byyyy-mm-dd\b", "template date placeholder in a form field"),
]

def pattern_hits(html):
    import re as _re
    # strip script/style FIRST: Next.js mirrors form placeholders and email
    # hints into its flight-data <script>, false-positiving every form page
    html = _re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", html, flags=_re.S | _re.I)
    # placeholder/value/aria-label attrs vanish with the tags - harvest them
    # first so template-ese inside form fields gets scanned too
    attrs = " ".join(_re.findall(r'(?:placeholder|value|aria-label)="([^"]*)"', html))
    text = _re.sub(r"<[^>]+>", " ", html) + " " + attrs
    return [label for pat, label in PLACEHOLDER_PATTERNS if _re.search(pat, text)]


def crawl_routes(max_pages=80):
    """Discover routes by following internal links from /. Works on any stack."""
    skip = ("privacy", "terms", "thank-you", "wp-admin", "wp-login", "feed",
            "wp-json", "cart", "checkout", "tag/", "author/", "#")
    seen, queue = [], ["/"]
    while queue and len(seen) < max_pages:
        route = queue.pop(0)
        if route in seen:
            continue
        seen.append(route)
        status, html = fetch(route)
        if status != 200:
            continue
        for href in set(re.findall(r'href="(/[^"#?]*)"', html)):
            href = href.rstrip("/") or "/"
            if href not in seen and href not in queue and not any(k in href for k in skip):
                queue.append(href)
    return seen


def routes_on_disk():
    app = SITE / "app"
    # --base means a foreign site (imported, WordPress, staging): the local
    # tree is irrelevant, discovery is always by crawl.
    if "--base" in sys.argv or not app.exists():
        return crawl_routes()
    skip = {"privacy-policy", "terms", "thank-you", "api"}
    out = []
    for page in sorted(app.rglob("page.tsx")):
        parts = page.relative_to(app).parts[:-1]
        if any(x in skip or x.startswith("[") or x.startswith("_") for x in parts):
            continue
        out.append("/" + "/".join(parts))
    return out


def fetch(route):
    try:
        with urllib.request.urlopen(BASE + route, timeout=30) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception as e:
        return 0, str(e)


def map_expected_routes():
    """Every keyword-map row, the route it lives at, and its primary keyword.

    A row that records its real route ("**Built:** ... `/route`" or
    "**Page:** /route") is trusted over a slug guessed from the heading.
    A row marked **DROPPED** is not owed a page.
    """
    km = ROOT / "keyword-map.md"
    if not km.exists():
        return []
    text = km.read_text()

    def slugify(x):
        return re.sub(r"[^a-z0-9]+", "-", x.lower()).strip("-")

    expected = []
    for m in re.finditer(r"^## \d+\. (Service page|Blog post): (.+)$", text, re.M):
        kind, title = m.group(1), m.group(2).strip()
        nxt = re.search(r"^#{1,2} ", text[m.end():], re.M)
        block = text[m.end():m.end() + nxt.start()] if nxt else text[m.end():]
        if re.search(r"^\*\*DROPPED\b", block, re.M):
            continue
        primary = re.search(r"^\*\*Primary keyword\*\*\s*\n- ([^·\n]+)", block, re.M)
        kw = primary.group(1).strip().lower() if primary else None
        built = (re.search(r"^\*\*Built:\*\*.*?`(/[^`]+)`", block, re.M)
                 or re.search(r"^\*\*Page:\*\*\s*(/[^\s·]*)", block, re.M))
        if built:
            expected.append((title, built.group(1), kw))
            continue
        # "Local SEO services in Austin" -> city spoke under its hub
        city = re.match(r"(.+?) in ([A-Za-z .-]+)$", title)
        if kind == "Service page":
            if city:
                expected.append((title, f"/services/{slugify(city.group(1))}/{slugify(city.group(2))}", kw))
            else:
                expected.append((title, f"/services/{slugify(title)}", kw))
        else:
            expected.append((title, f"/blog/{slugify(title)}", kw))
    return expected


def main():
    failures = []

    # 1. every route on disk renders
    for route in routes_on_disk():
        status, _ = fetch(route)
        if status != 200:
            failures.append(f"route {route} -> {status}")

    # 2. no placeholder text on the MAIN pages. Pyramid stubs (deep service and
    #    blog routes) are allowed placeholder bodies - /service-page and
    #    /blog-post fill them later. Stubs are checked in section 3 instead.
    MAIN = {"/", "/services", "/about", "/blog", "/contact", "/pricing", "/quote", "/reviews"}
    for route in routes_on_disk():
        if route not in MAIN:
            continue
        _, html = fetch(route)
        found = [ph for ph in PLACEHOLDERS if ph in html] + pattern_hits(html)
        if found:
            failures.append(f"{route}: placeholder(s) still visible: {', '.join(found[:5])}")

    # 3. the pyramid: every keyword-map row has a live route whose content
    #    carries its primary keyword. --core (day one) skips the rows that
    #    have no page yet, but a page that exists is still checked.
    core = "--core" in sys.argv
    for title, route, kw in map_expected_routes():
        status, html = fetch(route)
        if status != 200:
            if not core:
                failures.append(f'keyword-map row "{title}" has no page at {route} (-> {status})')
            continue
        # The row's primary keyword, verbatim on the page or every word of it
        # in the <title>. Rows with no primary keyword: the heading's first two words.
        want = kw or " ".join(title.lower().split()[:2])
        t = re.search(r"<title[^>]*>(.*?)</title>", html, re.S | re.I)
        title_words = set(re.findall(r"[a-z0-9]+", t.group(1).lower())) if t else set()
        if want not in html.lower() and not set(re.findall(r"[a-z0-9]+", want)) <= title_words:
            failures.append(f'{route}: page exists but its content never mentions "{want}" - H1/meta not set to the keyword')

    # 4. every internal link on every page resolves
    links = {}
    for route in routes_on_disk():
        _, html = fetch(route)
        for href in set(re.findall(r'href="(/[^"#?]*)"', html)):
            links.setdefault(href, []).append(route)
    for href, sources in sorted(links.items()):
        status, _ = fetch(href)
        if status != 200:
            failures.append(
                f"dead link: {href} -> {status} (linked from {', '.join(sources[:3])})")

    # 5. required links: the pyramid wiring itself
    #    - every service hub linked from /services (below)
    #    - every city spoke linked from its hub, and links back up to it
    #    - every blog post linked from /blog
    #    - nav on every main page reaches /services and /blog
    route_set = set(routes_on_disk())
    for route in sorted(route_set):
        parts = route.strip("/").split("/")
        if route.startswith("/services/") and len(parts) == 3:
            hub = "/" + "/".join(parts[:2])
            _, hub_html = fetch(hub)
            if f'href="{route}"' not in hub_html:
                failures.append(f"hub {hub} does not link down to its spoke {route}")
            _, spoke_html = fetch(route)
            if f'href="{hub}"' not in spoke_html:
                failures.append(f"spoke {route} does not link up to its hub {hub}")
    _, blog_html = fetch("/blog")
    for route in sorted(route_set):
        if route.startswith("/blog/") and route != "/blog":
            if f'href="{route}"' not in blog_html:
                failures.append(f"/blog index does not link {route}")
    for main in ("/", "/services", "/about", "/blog", "/contact"):
        _, html = fetch(main)
        for must in ("/services", "/blog"):
            if f'href="{must}"' not in html:
                failures.append(f"nav on {main} has no link to {must}")

    # 5b. index pages are real indexes, not a child's page type
    def first_h1(html):
        m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S | re.I)
        return re.sub(r"<[^>]+>", "", m.group(1)).strip().lower() if m else ""
    _, blog_idx = fetch("/blog")
    if "<article" in blog_idx.lower():
        failures.append("/blog is an <article>, not an index - move the article to its own post URL")
    blog_h1 = first_h1(blog_idx)
    for route in sorted(route_set):
        if route.startswith("/blog/") and route != "/blog":
            _, ph = fetch(route)
            if blog_h1 and blog_h1 == first_h1(ph):
                failures.append(f"/blog has the same H1 as {route} - the index is a post")
    # An index is a page TYPE. Renaming the H1 on a sales page does not count:
    # index pages carry no enquiry form and no offer pricing - those live on
    # the child pages (spec rule 7 + the hub definition).
    for idx_route in ("/services", "/blog"):
        _, idx_html = fetch(idx_route)
        if "<form" in idx_html.lower():
            failures.append(f"{idx_route} contains a form - an index is not a sales page; forms live on child pages")
        body = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", idx_html, flags=re.S | re.I)
        body = re.sub(r"<[^>]+>", " ", body)
        if re.search(r"\$\s?\d{1,3},\d{3}", body):
            failures.append(f"{idx_route} shows offer pricing - an index names the branch; pricing lives on child pages")

    _, svc_idx = fetch("/services")
    svc_h1 = first_h1(svc_idx)
    if "service" not in svc_h1:
        failures.append(f'/services H1 "{svc_h1}" does not name the branch - an index H1 must contain "service"')
    for route in sorted(route_set):
        if route.startswith("/services/"):
            _, ph = fetch(route)
            if svc_h1 and svc_h1 == first_h1(ph):
                failures.append(f"/services has the same H1 as {route} - the index is a child page")

    # 6. no orphans: every service route is linked from the /services index
    _, services_html = fetch("/services")
    for route in routes_on_disk():
        if route.startswith("/services/") and route.count("/") == 2:
            if f'href="{route}"' not in services_html:
                failures.append(f"orphan: {route} is not linked from /services")

    if failures:
        print("SITE NOT COMPLETE\n")
        for f in failures:
            print(f"  - {f}")
        print(f"\n{len(failures)} failure(s). /build-website is not done. Fix and re-run.")
        return 1
    if "--core" in sys.argv:
        print("Core complete: every route renders, no placeholders, wiring intact. Keyword-map rows without a page were not checked (--core).")
    else:
        print("Site complete: every route renders, no placeholders, pyramid matches keyword-map.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
