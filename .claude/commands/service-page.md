---
description: One money page from a service keyword - duplicate the template page, swap the words, wire the proof
argument-hint: [service or service+city keyword, optional]
---

## Which page

Never ask. No argument = next unwritten `## N. Service page:` row in `keyword-map.md`, lowest N, hubs before city spokes. Skip anything in `website-index.md` or already routed under `app/services/`. A named argument overrides. All rows written? Say so, point at `/keyword-research expand`.

## ⛔ Duplicate = `cp` the file

```
cp app/services/_template/page.tsx app/services/[slug]/page.tsx   # or the nearest built page
```

City pages copy their parent service page. Then edit ONLY words, metadata, photos, schema. Layout, sections, inline styles stay byte-identical. Composing a page from components or writing new CSS is designing - banned.

## The words

1. **Spec:** scan the top 3 organic results - format, length, H2s, and the trust elements they show. If a local pack shows, the conversion model comes from the map-pack businesses, not the organic 10 (those set coverage only). End with THE GAPS your proof beats.
2. **Buyer:** name the ONE buyer from `context/buyers.md` and the line that says so. None fits? Pick the closest, say why, continue. Their fears = the FAQ, their words (from reviews) = the words on the page.
3. **Proof-first copy:** every claim traceable to `context/proof/proof-inventory.md`. Real reviews word for word. Humour: as `context/voice.md` Part 1 says.
4. **City pages are never clones:** real local jobs, neighbourhoods, city-specific FAQ answers - or flag and skip the city. Never find-and-replace the city name. **Read `references/doorway-pages.md`** - the 3-of-4 local material test, the sibling test, and `code/check_page_similarity.py` to prove it rather than assume it. **Localize the PROBLEM, not the place:** different housing stock, permit rules, weather damage and price bands make a different page; the same page with a different label does not. **Read `references/hub-spoke-pages.md` before any hub or city page** - the hub's "Areas we serve" H2 grows a passage + link for every new city the same day it ships, the city page references its hub early, and the caps/doorway evidence there (10-15 cities max, localize the PROBLEM not the place) are load-bearing.
5. **Photos come from `photosShowing()`** (`lib/photos.ts`). No fitting photo for a frame? Delete the frame and let the layout close up. Look at every photo before it ships. **People photos go where people belong:** team/crew shots only in team or about sections, never the hero - the hero and job frames show the WORK (the job, the result, the equipment), and portrait slots are the only place a face goes.
6. **H1:** the primary keyword alone. The secondaries go in the body.
7. **Proof:** 5+ proof touches on the page.

## Register + verify

**The exit gate - the skill does not finish until this passes:**

```
python3 code/check_page_done.py /services/[slug]
```

It fails on any surviving frame label or template string, and on any dead link on the page. Fix → re-run → repeat until PASS; never show me a failing page with an explanation. Then screenshot at 1440px and 390px and LOOK - no overlay text on photos, no empty bands. The gate is the floor, your eyes are the bar.

Append to `website-index.md` - **`references/examples/website-index-example.md` is the row shape, match it** - and MOVE the whole map row into `# Written` in `keyword-map.md`, keeping its number - never add a `Status:` field, because a block's position IS its status the moment the file saves. **The loop rule: the gate decides when you're done, not you.** Run the gate → fix every failure → run it again. Repeat until it passes. Do not report progress instead of finishing, do not ask permission to keep fixing, do not stop because a fix is tedious (37 routes to build means 37 routes get built), and never present a failing site with an explanation attached. The ONLY reasons to stop early: you need a value only I have (a key, a webhook, a photo), or a real decision is mine to make. Everything else, you finish.

Test the form posts. Screenshot at 1440px and 390px, look at both, show me. Don't publish - that's `/publish`.


**⛔ LISTINGS ARE DATA, NOT JSX. Add an ENTRY, never a link.** The `/services` and `/blog` indexes render from `website/content/services.ts` and `website/content/posts.ts`. **Never hand-edit `app/services/page.tsx` or `app/blog/page.tsx`** - when they were hardcoded, every new page's link got appended next to whichever link happened to be last, and four unrelated services ended up filed under the "SEO Audit Services" heading. Data cannot make that mistake: one object in the list renders as its own section, in order, and is filtered by publish date so a held page does not appear at all. City pages go in the parent's `children`, never as top-level entries.

**⛔ Every link to a dated route goes through `<ScheduledLink>`, never a raw `<a>`.** A page that publishes on the 1st linking to one held until the 3rd is a live 404 for two days, and the build stays green throughout. `python3 code/check_scheduled_links.py` must exit 0 before the batch is done - it caught three real instances of this.
