# Strategy note

**How the full service story fits on one page, the Apple way.**

Apple product pages work because they argue in one direction and trust a single
idea per screen. I built the page as one continuous argument — what it is, why
it matters, what you get, proof, how to start, the ask — giving each beat one
headline and one supporting line. Nothing gets a paragraph.

**What I cut.** The agency furniture: About, a team grid, a nine-tile services
list, pricing, an FAQ, a logo wall. Most of it repeats the pitch or asks the
visitor to do work. Six capabilities survived as one line each; the rest was
folded into the approach or deleted.

**What became a visual.** The methodology — normally three paragraphs on
creative testing and attribution — is now a pinned scroll sequence where the
copy advances against a changing panel: a creative pipeline, a measurement
stack, a compounding revenue chart. Results are counters that animate on entry
rather than a table. The hero's claim is carried by a live "campaign console"
instead of a screenshot. The visual makes the point; the text only names it.

**How it stays fast.** Every visual is SVG, CSS, or canvas — no photography, no
video files — so the media-heavy look costs kilobytes, stays sharp at any size,
and adds nothing to the JS bundle. The hero headline is the LCP element and
animates via a CSS keyframe, not JS, so it paints with the HTML instead of
waiting for hydration. Thirty-odd scroll reveals share one IntersectionObserver
toggling a class; Framer Motion is reserved for the three moments that need it.
The animated background renders into a 300px canvas blurred up to full size,
capped at 30fps, paused off-screen, and never started on reduced-motion or
low-power devices.
