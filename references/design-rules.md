# Design rules

How the site looks and moves. Learned from seven rounds of client feedback on New Era Landscapes, October 2026. Read before any visual work. A client or reference that says otherwise wins; record it under "## Design" in that site's CLAUDE.md.

**Look**
- Restraint reads as quality. About five type roles across the whole site, at most two text styles in any block.
- A pale background with thin text and a photo reads cheap. Separate sections by changing the background (light, warm, dark, full photo). Every main page has at least one dark section.
- Headings in a solid weight (500 or more). Labels at 14px or more, full contrast. No thin display type.
- Large type only for 8 words or fewer. Longer text at 16-21px, no more than 65 characters a line.
- Text never overlaps text.
- No decorative colour. Take the accent from the photos and the logo, and use it sparingly.
- Where the name is decoration, use the logo artwork. Never set the name huge in a webfont.
- One spacing unit and a 12-column grid. No one-off sizes.

**First screen**
- The homepage opens on one photo and the headline, nothing competing. The scroll opens the photo out and brings in the intro and the quote button. With JavaScript off, the button shows on the finished layout.

**Photos**
- The weakest photo sets the impression. Cut a weak shot rather than fill a slot.
- Each photo once per page. The hero shows the work. Faces only in sections about the people.
- Client photos first. Stock only with the owner's OK.

**Motion**
- Motion follows the scroll directly. No lag, no glide.
- Each section moves its own way. No repeated wipe on every image, no marquees.
- Driven by CSS and the kit's scroll script, no client-side React. With reduced motion or JavaScript off, the page is the finished static layout.
- Phones: no sideways pins, lighter motion.

**Process**
- Fix a complaint by finding its cause, never by doing the opposite. Mock two options with real photos and show the better one.
- Before showing anything, run `node code/design/shoot.mjs --all`, reload one page mid-scroll, and look at every shot.
- No sideways scrolling at 390. No text under 14px.
