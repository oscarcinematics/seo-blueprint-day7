# Site

Static site. Next 15, `output: "export"`: every page is HTML on a CDN, no server.
Made from the engine's design kit by `new-site`; `/build-website` makes it this
business's site.

```bash
npm install
npm run dev      # the site's own port (DEV_PORT in ../.env), own .next-dev folder
npm run build    # -> out/
```

Always build with `npm run build`, never `npx next build`: the npm script also
makes the AVIF files, strips the unused React runtime from every page and drops
pages whose publish date has not come.

## Before it goes live

1. `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` in `.env.local` and in Vercel (see
   `.env.example`). Without it both forms refuse to send and tell people to call.
2. Every old URL of an existing site gets a 301 in `vercel.json` `redirects`.
3. `site.url` in `lib/site.config.ts`: canonicals, the sitemap and the schema read it.

## How it's put together

- `lib/site.config.ts`: the NAP, hours, services and owner. Every page reads it.
- `lib/photos.ts`: every photo, once, with alt, sizes and what it shows.
  `photosShowing()` builds a page's set. The kit ships grey placeholders.
- `app/ds.css` tokens, `app/brand.css` the shared look and the Cover, Close and
  lockup, `app/pages/<page>.css` each page's own layout and scroll scenes.
- `components/HomeReveal.tsx`: the one motion script (scenes, reveals, header).
  Nothing hydrates in production; with JS off or reduced motion every page is
  its finished static layout.
- `lib/unwritten.ts`: pages still carrying template prose get noindex and stay
  out of the sitemap until real copy lands.
- `lib/publishing.ts` + `components/site/ScheduledLink.tsx`: dated pages and
  links that appear on their publish date.
- `app/services/_template` and `app/blog/_template`: the page templates. Not
  published (the folder starts with `_`).

## Rules that are not style choices

- URLs are extensionless: `/services`, never `/services/`.
- No claim goes on a page unless it is in `../context/proof/proof-inventory.md`.
- No stock photography without the owner's OK.
