import type { MetadataRoute } from "next";
import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { site } from "@/lib/site.config";
import { isUnwritten } from "@/lib/unwritten";
import { routeIsLive } from "@/lib/publishing";

export const dynamic = "force-static"; // required for static export

// Pyramid rule 6: the sitemap contains exactly the tree, every live page and
// nothing else. Built by walking app/ at build time rather than from a
// hand-kept list, so the service, suburb and blog pages /scale-map adds later
// appear on their own instead of being silently left out.
//
// DELIBERATELY EXCLUDED:
//   /thank-you            never indexed - if it ranks, people land there
//                         without converting and the conversion count becomes
//                         fiction. Also absent from the nav, and exempt from
//                         the 3-click and orphan rules by design.
//   /privacy-policy /terms   no search value
//   any dynamic [slug] route
//   every page still carrying template prose - see lib/unwritten.ts. That check
//   is automatic, so a page joins the sitemap the day real copy is written.
const EXCLUDE = new Set(["/thank-you", "/privacy-policy", "/terms"]);

function routes(dir: string, base = ""): string[] {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    if (name.startsWith("_") || name.startsWith("(") || name.startsWith("[") || name === "api") continue;
    const path = `${base}/${name}`;
    if (existsSync(join(dir, name, "page.tsx"))) out.push(path);
    out.push(...routes(join(dir, name), path));
  }
  return out;
}

function priority(path: string): number {
  if (path === "") return 1;
  if (path === "/services" || path === "/blog") return 0.9;
  const depth = path.split("/").filter(Boolean).length;
  if (path.startsWith("/services/")) return depth === 2 ? 0.9 : 0.7; // hub vs city spoke
  if (path.startsWith("/blog/")) return 0.6;
  return 0.8;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const found = routes(join(process.cwd(), "app")).filter((p) => !EXCLUDE.has(p) && !isUnwritten(p) && routeIsLive(p));
  // The URL here must match the page's own canonical character for character.
  // A sitemap entry with a trailing slash against a canonical without one is a
  // second URL for the same page, and Google picks whichever it likes.
  return ["", ...found.sort()].map((path) => ({
    url: `${site.url}${path || "/"}`,
    // Omit optional lastModified until reliable content dates are available.
    // Rebuilding the export does not mean every page's content changed.
    priority: priority(path),
  }));
}
