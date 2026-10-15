// /llms.txt - the plain-text map of the site for AI crawlers.
//
// Generated rather than a file in public/, so it can never name a page before
// its publish date and send a crawler to a 404: the service pages come from
// content/services.ts and the posts from content/posts.ts, both already
// filtered by date (lib/publishing.ts). The core pages are listed here by
// hand; keep each title the page's own <title>.
import { site } from "@/lib/site.config";
import { services } from "@/content/services";
import { livePosts } from "@/content/posts";

export const dynamic = "force-static"; // required for static export

const core: [string, string][] = [
  [`Your Trade in Your City | ${site.name}`, "/"],
  [`About ${site.name}`, "/about"],
  [`Your Trade Services in Your City | ${site.name}`, "/services"],
  [`Your City Your Trade Gallery | ${site.name}`, "/gallery"],
  [`Contact ${site.name}`, "/contact"],
  [`Free Quote | ${site.name}`, "/quote"],
];

export function GET() {
  const pages: [string, string][] = [
    ...core,
    ...services.map((s): [string, string] => [s.anchor, s.href]),
    ...(livePosts().length ? [[`Blog | ${site.name}`, "/blog"] as [string, string]] : []),
    ...livePosts().map((p): [string, string] => [p.title, `/blog/${p.slug}`]),
  ];
  const list = pages.map(([title, path]) => `- [${title}](${site.url}${path})`).join("\n");
  const body = `# ${site.name}

> ${site.tagline}

Phone: ${site.phone}. Email: ${site.email}.

## Website

${list}

## Profiles

- [Instagram](${site.instagram})
- [Facebook](${site.facebook})
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
