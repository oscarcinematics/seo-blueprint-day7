// The breadcrumb strip, plus its BreadcrumbList schema, from one list - so the
// visible trail and the structured data can never disagree. Sitewide, mirroring
// the pyramid in references/pyramid-structure.md.
import { site } from "@/lib/site.config";

export default function Breadcrumbs({ trail }: { trail: { href?: string; label: string }[] }) {
  const items = [{ href: "/", label: "Home" }, ...trail];
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      ...(it.href ? { item: `${site.url}${it.href}` } : {}),
    })),
  };
  return (
    <nav className="h-crumb" aria-label="Breadcrumb">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="h-w"><ol>
        {items.map((it, i) =>
          i === items.length - 1 ? (
            <li key={it.label} aria-current="page">{it.label}</li>
          ) : (
            <li key={it.label}><a href={it.href}>{it.label}</a></li>
          ),
        )}
      </ol></div>
    </nav>
  );
}
