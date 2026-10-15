// Styles that belong to ONE page, inlined into that page only.
//
//   <PageCss file="home.css" />   reads app/pages/home.css
//
// Same reasoning as app/layout.tsx: read off disk and inlined, so there is no
// render-blocking stylesheet request and no CSS pipeline. Read per render, so
// edits show on the next reload on `next dev`; the static export reads it once
// at build time. Shared look (tokens, type, chrome, motion) stays in
// app/brand.css; this is only for layouts no other page uses.
import { readFileSync } from "node:fs";
import { join } from "node:path";

export default function PageCss({ file }: { file: string }) {
  const raw = readFileSync(join(process.cwd(), "app", "pages", file), "utf8");
  const min = raw
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{};,>])\s*/g, "$1")
    .trim();
  return <style dangerouslySetInnerHTML={{ __html: min }} />;
}
