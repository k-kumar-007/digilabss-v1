# Strategy note

**How the full service story fits on one page, the Apple way.**

Apple product pages work because they argue in one direction and trust a single
idea per screen. I built the page as one continuous argument — the claim, how we
work, the numbers, what you get, proof, the ask — giving each beat one headline
and one supporting line. Nothing gets a paragraph.

**What I cut.** The agency furniture: About, a team grid, a nine-tile services
list, pricing, an FAQ, a logo wall. Six capabilities survived as one line each.
I also cut the written "our approach" section — the command centre makes that
argument visually, and keeping both said the same thing twice.

**What became a visual.** The centrepiece is a Meta Ads command centre that
walks itself through twelve panels — spend, revenue, results, reach, clicks,
cost per result, trend, campaigns, creative, key metrics, audience, objectives.
Each lifts into focus while the rest dim and the console pans to follow, with one
line on what that metric means for the business. It replaces a page of copy about
analysis and optimisation, and shows the expertise instead of claiming it.

**How it stays fast.** Every visual is HTML, SVG or canvas — no screenshots, no
video, zero image requests — so the dashboard stays sharp at any size, animatable
a panel at a time. The console renders on the server and is handed to the
animation shell as children, so twelve animated panels add no JavaScript. The focus effect is one class moved between elements plus composited
`opacity`, `transform` and a `translate3d` pan. Thirty-odd scroll reveals share a
single IntersectionObserver. The depth-of-field blur is dropped below desktop and
on low-power devices, the sequence pauses off-screen, and reduced motion disables
it, leaving the console fully lit.
