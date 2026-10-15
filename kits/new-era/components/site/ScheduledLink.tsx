// The date-aware link. Every in-body link to a route in lib/publishing.ts goes
// through this rather than a raw <a>: until the target's date it renders its
// words as plain text, so a live page never points at a page that is still a
// 404. The build that releases the target turns every one of these into a
// link in the same deploy. check_scheduled_links.py fails on a raw <a> to a
// scheduled route.
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { routeIsLive } from "@/lib/publishing";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode };

export default function ScheduledLink({ href, children, ...rest }: Props) {
  if (!routeIsLive(href.split("#")[0])) return <>{children}</>;
  return <a href={href} {...rest}>{children}</a>;
}
