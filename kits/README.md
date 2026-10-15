# Kits

A kit is a finished client site with the client taken out. `new-site` copies `kits/new-era` into every new site's `website/`.

## Turning a finished site into a kit

1. Copy its `website/` to `kits/<name>/`, without `node_modules`, `.next*`, `out`, `.vercel`, `.env*`, `.git` and `.github`.
2. Delete the client's photos (`public/images/work`, `optimized`, `og`) and point every key in `lib/photos.ts` and `lib/details.ts` at grey placeholders of the same shape.
3. Put placeholder identity in `lib/site.config.ts` (Business Name, (555) 010-0199, hello@example.com, `leadSite: "yourbusiness"`) and replace any name, phone, suburb or proof claim written into a page or comment.
4. Swap the logo files for neutral ones at the same names, and the icons and `og.png` too.
5. Keep one service page and one blog post as `app/services/_template` and `app/blog/_template`, delete the rest, and empty `content/services.ts`, `content/posts.ts` and the schedule in `lib/publishing.ts`.
6. Remove client-only files (verification files, old-site redirects, analytics IDs, publish logs), then check `npm run build` is clean and a `new-site` copy flags only placeholders.

## Swapping in a client's photos and logo

Every photo slot in `lib/photos.ts` is a grey placeholder named by its shape (`tall1`-`tall8` are 3:4, `wide1`-`wide14` are 4:3, `pano1` is 3:2 and the home hero, `small1` is a 600px 4:3 inset) and its alt starts "JOB PHOTO", so the checkers fail any page that still shows one. Put the originals in the site's `photos/` folder, list them in `ORIGINALS` (and `CUTS` for 4x3 or 16x9 sets) in `scripts/build-photo-grade.mjs`, and run it: it writes the graded widths and gallery squares and prints each photo's widths and size. Replace each placeholder entry with the real photo (same key, or rename the key where the pages use it), then delete the `placeholder-*` files and their `lib/squares.json` entries. The logo is `public/logo.svg` (light grounds) and `public/logo-light.svg` (dark grounds and the footer sign-off), shown by `components/site/Logo.tsx`; replace both files and set the width and height in `Logo.tsx` and `SiteFooter.tsx` to the artwork's own ratio. Replace `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico`, `public/logo-mark.png` and `public/og.png` at the same sizes.
