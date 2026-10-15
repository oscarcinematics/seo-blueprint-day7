---
description: Build or restyle the site from the design kit - this business's words, photos, colour and references
---

`website/` is a copy of the design kit, made by `new-site`. The kit is the design and SEO standard; this command makes it this business's site. Read `references/design-rules.md` first.

## 1. Gather - one message, then wait
Ask only for what `context/` does not have: logo file, photo folder, brand colour, the inbox leads go to, whether they want Calendly for bookings (and the link, which goes on `/thank-you`), and reference sites or screenshots (optional). Forms post to Oscar's lead relay, which only accepts sites it knows: pick a short `leadSite` id and tell Oscar to add one entry to `SITES` in `EOS New Website/website/app/api/lead/route.ts` (the id, `to` the inbox, `from` "<Name> website", `phone`, `origins` the domain with and without www plus the vercel.app URL) and deploy EOS before this site goes live. Existing site? Get the URL - every old URL gets a 301 in `vercel.json`.

## 2. Design brief - only when references are given
Screenshot each reference at 1440 and 390. Write at most 10 lines under "## Design" in this site's CLAUDE.md: what to borrow, mapped onto the kit's tokens and components, and what not to. Show it and wait for a yes. No references: skip.
Site already live? Same brief, and `node code/design/snapshot.mjs --diff` must show titles, headings, links and schema unchanged.

## 3. Make it theirs
Fill `lib/site.config.ts` from `context/business.md`. Logo into `public/`. Palette from the logo and photos, kit tokens only. Grade every photo with `scripts/build-photo-grade.mjs`, register it in `lib/photos.ts` (`tag` = what it is of, `shows` = what it contains), and cull weak shots.

## 4. Core pages
Rewrite the words on home, services, about, contact, quote, thank-you, blog, gallery and legal from `context/` and `context/voice.md`. Keep the kit's layout unless the brief changes it. `/services` and `/blog` start empty; `/service-page`, `/blog-post` and `/scale-map` add pages from the `_template` pages.

## 5. Check, then show
`python3 code/check_site_complete.py --core`, `python3 code/check_css_integrity.py`, then the screenshots from the design rules. Fix and re-run until clean. One clickable localhost URL per page. Next: `/publish`.
