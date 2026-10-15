import type { MetadataRoute } from "next";
import { site } from "@/lib/site.config";

export const dynamic = "force-static"; // required for static export

// Search engines AND AI crawlers allowed. AI answers are a traffic source, not
// a threat, and this is a business with no reviews yet - being quotable in an
// AI answer is one of the few ways it gets cited at all.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Keep utility pages crawlable so engines can read their noindex tags.
      { userAgent: "*", allow: "/" },
      { userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "OAI-SearchBot"], allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
