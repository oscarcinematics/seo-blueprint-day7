#!/usr/bin/env python3
"""Fail the build if a page is missing voice, proof, or renders broken.

    python3 code/check_page_quality.py            # all pages
    python3 code/check_page_quality.py /blog/x    # one route

Three gates. Any failure exits 1, which means the page is not finished
and does not get shown to the owner. Numbers not found in
proof-inventory.md are a WARNING: check each one against the proof file and
fix the page or the file. They do not fail the run.
"""
import json, re, subprocess, sys, urllib.request
from pathlib import Path

from _site import ROOT, SITE, BASE

PROOF = ROOT / "context" / "proof" / "proof-inventory.md"

BANNED = ["in today's world", "in the fast-paced", "we strive to", "unfortunately",
          "in conclusion", "it is important to note", "when it comes to",
          "in the ever-evolving", "look no further", "rest assured"]

def routes():
    if len(sys.argv) > 1: return [sys.argv[1]]
    out = []
    for p in (SITE/"app").rglob("page.tsx"):
        r = "/" + p.relative_to(SITE/"app").parent.as_posix()
        if r == "/.": r = "/"
        if "[" in r or "/_" in r: continue  # dynamic, or unpublished (_template)
        out.append(r)
    return sorted(out)

def text_of(html):
    html = re.sub(r"<(script|style|nav|footer)[^>]*>.*?</\1>", " ", html, flags=re.S|re.I)
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html)).strip()

def proof_numbers():
    if not PROOF.exists(): return set()
    return set(re.findall(r"[\d][\d,\.]*\+?%?", PROOF.read_text(encoding="utf-8", errors="ignore")))

def main():
    if not SITE.exists(): print("No website/ folder."); return 0
    known = proof_numbers()
    fails, warns = [], []
    for r in routes():
        url = BASE + r
        # GATE 1 - it must actually render
        try:
            with urllib.request.urlopen(url, timeout=15) as resp:
                code, html = resp.status, resp.read().decode("utf-8", "ignore")
        except Exception as e:
            code, html = getattr(e, "code", 0), ""
        if code != 200:
            fails.append((r, "RENDER", f"returns {code or 'no response'}. A page that does not load is not built."))
            continue
        body = text_of(html)
        words = len(body.split())
        if words < 120: continue  # nav-only pages

        # GATE 2 - proof
        nums = re.findall(r"\b[\d][\d,\.]*\+?%?\b", body)
        real = [n for n in nums if n in known]
        imgs = len(re.findall(r"<img|background-image", html, re.I))
        touches = len(real) + imgs + len(re.findall(r"[""“]", html))
        if touches < 5:
            fails.append((r, "PROOF", f"{touches} proof touches, target 5+. Real numbers found: {len(real)} of {len(nums)} on the page. Images: {imgs}."))
        invented = [n for n in set(nums) if n not in known and len(n) > 2 and not n.startswith("20")]
        if invented:
            warns.append((r, "CHECK NUMBERS", f"{len(invented)} numbers not in proof-inventory.md: {', '.join(sorted(invented)[:6])}. Check each against the proof file."))

        # GATE 3 - voice
        low = body.lower()
        hits = [b for b in BANNED if b in low]
        if hits: fails.append((r, "VOICE", f"banned phrases: {', '.join(hits)}"))
        if "—" in body: fails.append((r, "VOICE", "em-dash on the page. Regular hyphens only."))
        sents = [s for s in re.split(r"[.!?]+", body) if s.strip()]
        if sents:
            avg = sum(len(s.split()) for s in sents)/len(sents)
            if avg > 26: fails.append((r, "VOICE", f"average sentence {avg:.0f} words, target 14-17. Long sentences read as a manual."))

    def show(items):
        cur = None
        for route, kind, why in items:
            if route != cur: print(f"{route}"); cur = route
            print(f"  [{kind}] {why}")

    if warns:
        print("WARNINGS - numbers to check against proof-inventory.md\n")
        show(warns)
        print()
    if not fails:
        print("PASS - every page renders, carries proof, and has no banned phrasing."); return 0
    print("PAGE QUALITY FAILED\n")
    show(fails)
    print("\nFix these before showing the pages. A page that fails here is not finished.")
    return 1

if __name__ == "__main__": sys.exit(main())
