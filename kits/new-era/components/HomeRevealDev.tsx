"use client";
// DEV SERVER ONLY. Rendered by HomeReveal.tsx when NODE_ENV is "development".
//
// `next dev` still hydrates every page (the runtime is only stripped from the
// production export, by scripts/strip-next-runtime.mjs). The plain reveal
// script runs at DOMContentLoaded, which is BEFORE hydration, so it has
// already added .h-js and removed .h-rv from on-screen blocks by the time
// React compares - and the dev overlay reports a hydration mismatch on every
// one of them. useEffect runs after hydration, so here the same script runs
// once React is done and there is nothing left to mismatch.
//
// Production never renders this. It gets the raw <script>, unchanged.
import { useEffect } from "react";

export default function HomeRevealDev({ js }: { js: string }) {
  useEffect(() => {
    new Function(js)();
  }, [js]);
  return null;
}
