/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build output directory, overridable per process.
  //
  // Two Claude sessions have worked in this one checkout, and `next build`
  // rewrites .next from scratch while a `next dev` is serving out of it. The
  // dev server then 500s with "Cannot find module './331.js'" - its chunks
  // were deleted mid-request. Nothing is wrong with the code when that
  // happens, and restarting only fixes it until the next build.
  //   Long-lived dev server:  NEXT_DIST_DIR=.next-dev next dev -p <DEV_PORT>
  //   Builds and exports:     npx next build     (uses .next as usual)
  // Both can then run at once. Default is unchanged, so CI and /publish are
  // unaffected.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Static export: the whole site is HTML on a CDN. No server, nothing to keep
  // warm, and every page is already rendered when Googlebot arrives.
  output: "export",
  // No trailingSlash: URLs are extensionless (/services, not /services/), which
  // is the convention references/pyramid-structure.md and every gate in
  // the engine's code/ assume. Mixing the two patterns is the one thing
  // that spec calls out as never allowed.
  images: {
    // next/image needs a server to optimise. The site ships plain <img> with
    // hand-built srcSets (see public/images/work) so this stays off.
    unoptimized: true,
  },
};
export default nextConfig;
