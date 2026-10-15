---
description: The review machine - filter form built + routed, QR code, reply drafts. Reviews are the #1 local ranking factor.
---


**1. ⛔ ASK FOR THE TWO VALUES FIRST, BEFORE BUILDING ANYTHING.**

The form has exactly two destinations, and without them it is a demo. Check CLAUDE.md "## My setup" for `GOOGLE_REVIEW_URL` and `website/lib/site.config.ts` for a real `leadSite` that the lead relay knows. If either is missing or still a placeholder, **ask for both in one go, right now**, before writing a single line of the page:

> "Two things before I build this, both about a minute each:
> **1. Your Google review link.** Google Business Profile → 'Ask for reviews' → 'Share review form' → copy. Looks like `g.page/r/[id]/review`. This is where 4-5 star clicks go.
> **2. This site on your lead relay.** 1-3 star feedback posts through the relay to the inbox in this site's `SITES` entry, so it must be an inbox the owner reads. Not there yet? Add it as `/build-website` step 1 says."

Save both the moment I give them, so nothing asks twice. Then build the page immediately from `context/business.md` + the site's existing styles, hand me a local preview link in the same reply, and **fire one real test through each path** - a 5-star click landing on the actual Google form, and a 2-star submission arriving in the owner's inbox (the relay refuses localhost in production, so run that one on the deployed site, or against a local EOS server via `NEXT_PUBLIC_LEAD_ENDPOINT`). Confirm both before moving on.

**Why up front:** these two values ARE the machine. A review form whose stars go nowhere is a page, not a system, and a placeholder that gets published is a customer's bad review vanishing into a `TODO`.

**Only if I say "skip it"** for either one: build with a clearly-marked placeholder constant, say plainly which path is dead, and never publish it in that state.

**2. The happy path is already pointed at Google** from step 1. Confirm a 5-star click lands on the real form, then generate the QR code (trucks, invoices, counter cards) with `code/make_review_qr.py` - it reads the URL from one config file and writes a print-ready PNG plus an SVG. **Scan the output with a real phone before anything gets printed.**

**3. The unhappy path posts through the lead relay to the owner's email**, the same way `components/LeadForm.tsx` does: FormData with `site` set to `leadSite`, a `subject`, the `botcheck` honeypot, and the rating, feedback, name and contact as plain fields.

**The form works without this** - until the relay has this site, the 1-3 path still collects the feedback and shows the thank-you message, it just has nowhere to deliver it. Say that rather than blocking, and never leave the placeholder silently broken.

**The form spec - a page on MY site** (`/review`, styled from the site's existing styles):

**The link carries nothing about who they are.** Someone scanning a code on a truck, an invoice or a counter card, or opening the link the owner sent, arrives with nothing in the URL, and that is a real customer worth capturing:
- 4-5 stars → straight to Google, exactly as normal. No details needed, nothing lost.
- 1-3 stars → **only now** ask for a name and one contact method, framed as the reason it is being asked: "So we can actually fix this, who should we call?" Two fields, both optional, submission works without them.

- **Question 1, VERBATIM - do not reword, shorten or "improve" this line:** "On a 1-5 scale, how likely are you to refer us to your friends and family?" - 1-5 stars (big, thumb-friendly). Asking about referring rather than about the visit is what makes a 4 read as lukewarm instead of positive, which is exactly the split the filter depends on.
- **Question 2:** feedback textarea, shown for EVERY rating. 1-3: "What went wrong?" (required). 4-5: "What stood out?" (optional).

- **⛔ Tapping a star ONLY selects it. Nothing sends, nothing navigates.** Every action - the relay POST and the Google redirect alike - happens on the submit button, never on the star. An instant redirect on tap means the fields below are never filled and the happy path is never recorded at all: the 5-star rating, the name and the customer's own words all vanish. If a rating can leave the page before submit, the form is wrong.

- **Routing, all of it on submit (client-side JS):**
  - **4-5 →** copy their words to the clipboard, then redirect to the Google review link. Button reads "Continue to Google".
  - **1-3 →** POST to the lead relay → thank-you message ("the owner sees this personally, usually within the hour"). No public review link on this path, ever.

- **The clipboard step, and why there is no prefill.** Google's review form accepts NO parameter that populates the review body - deliberately, because their policy requires a review to be the reviewer's own words. So the closest legitimate help is copying what the customer already typed onto their clipboard so they paste it in one tap, with the caption saying exactly that. Wrap it in try/catch: clipboard access fails on http, in older browsers and under some permission settings, and a failed copy must never stop the redirect.

**4. Reply drafts (the other half of the ranking factor - replying matters).** **Read `references/review-replies.md` FIRST - it IS the spec**: the 4-beat shape for a negative reply, the 100-150 word cap, the banned phrases, the six hard cases (something went wrong · scope mix-up · slow comms · price · fake/not-a-customer · angry-but-vague), the fake-review reporting and escalation path, and the regulated-trade rules. **If `context/business.md` shows healthcare, legal or financial services, apply that file's regulated section before writing a single reply** - a US healthcare reply that acknowledges someone was a patient is a HIPAA violation even when they said so themselves.
- Draft 12 templates in my voice (`context/voice.md`): four 5-star variants, two 4-star, and one per hard case
- Ongoing: paste new reviews here any time and I draft the replies; or wire the Make.com GBP scenario (same account as `/gbp-posts`) to auto-draft
- Every reply: no fake warmth, no corporate apology-speak, sounds like the owner

**5. The velocity cap (tell the owner, do not skip it - it is the difference between reviews that last and reviews that get deleted).**

Google removes reviews that arrive too fast. Measured across 335,520 deleted reviews: at 1-2 new reviews/week the median review survives **594 days**; at 3-5/week it drops to **129 days**; at 21-50/week it is **9 days**. Blasting a customer list does not get more reviews, it burns the list and gets the reviews wiped.

The owner sends the review ask themselves. Tell them the cap:
- **Target 2-3 review requests per week. Hard ceiling 5 per week.** Never a bulk send to the whole list.
- Never re-ask the same contact inside 90 days.
- Backfill of past customers is where people blow this: 40 old customers is **13-20 weeks of asking**, not one afternoon. Say this to me out loud.

**Every ask must request written text, not a star rating.** As of January 2026, rating-only 5-star reviews with no words are removed ~100% of the time within 30 days (median lifespan 5 days). A 5-star with no text is worth nothing. The ask copy must prompt for one specific sentence - name the service, name the outcome ("what did we fix, and how did it go?").

**Never build:** incentivised reviews (discounts, entries, freebies for a review) or staff review quotas. Both are policy violations and both are removal risks.

**6. Deploy + hand off:** publish the form page (through `/publish`), give me the one link + QR to put everywhere (the owner's review ask, email signature, invoice footer, truck), and log the setup in CLAUDE.md "## My setup".
