# Digilabss — Apple-style one-page landing

A single-scroll, Apple-inspired landing page for a Meta Ads service, built for
the Digilabss screening assignment.

> **Demo build.** The brand, copy, figures and testimonials are placeholders for
> a screening exercise. Nothing here describes a real service.

**Live:** _add your deployment URL here_
**Repo:** _add your repository URL here_

---

## Scores

Lighthouse, mobile emulation, against a local production build (`next build` +
`next start`):

| Category | Score |
| --- | --- |
| Performance | **99** |
| Accessibility | **100** |
| Best Practices | **100** |
| SEO | **100** |

Core Web Vitals from the same run: **LCP 2.2 s · CLS 0 · TBT 20 ms · FCP 0.9 s ·
Speed Index 1.3 s.**

Numbers from a hosted deployment will differ — localhost has no real network
latency. Re-run against the live URL after deploying and update this table.

---

## Stack

- **Next.js 16** (App Router) + **React 19** — server components by default
- **Tailwind CSS v4** — tokens declared in `@theme`, no config file
- **Framer Motion** (`motion` v13) — scroll-linked and presence animation
- **TypeScript**, strict

## Run it

```bash
npm install
cp .env.example .env.local   # optional — everything works without it
npm run dev                  # http://localhost:3000
```

Production check:

```bash
npm run build && npm start
```

---

## The three (plus) moments of motion

The brief asked for at least three distinct moments. There are six, but only the
first three use Framer Motion — the rest are CSS, for reasons under
[Performance](#performance).

| # | Moment | How |
| --- | --- | --- |
| 1 | **Hero parallax** — the console settles back and lifts as you scroll | `useScroll` + `useTransform`, `transform`/`opacity` only |
| 2 | **Pinned story** — one sticky screen advances through three beats | `position: sticky` + scroll progress, crossfading panels |
| 3 | **Presence** — floating CTA and the form's success state | `AnimatePresence` |
| 4 | **Scroll reveals** — every section, stat and card | one shared `IntersectionObserver` + CSS transitions |
| 5 | **Animated background** — drifting gradient field | throttled 2D canvas, blurred up from a small buffer |
| 6 | **Hover** — cursor-following spotlight on the capability cards | two CSS custom properties written in a rAF |

Plus the chart that draws itself, the counters, and the trust marquee — all CSS.

---

## Performance

The hardest part of the brief, and where most of the design decisions came from.

**The LCP element is not animated by JavaScript.** The hero headline is plain
server-rendered HTML with a CSS keyframe entrance. A Motion component starting
at `opacity: 0` would pin LCP to hydration time; a CSS animation starts on the
browser's first frame.

**Reveals cost no JavaScript per element.** `<Reveal>` is a *server* component
that emits a `data-reveal` attribute. One `IntersectionObserver` mounted at the
root toggles a single class, and CSS does the transition — then unobserves. An
earlier Motion-based version wrapped ~30 elements in client components; this one
ships zero JS per reveal.

**Nothing runs on scroll.** No `scroll` listeners anywhere. The nav state, the
sticky CTA, the reveals and the section theming are all IntersectionObserver;
the parallax and pinned story read scroll position through Motion's own
compositor-friendly path.

**The animated background is opt-in per device.** It draws into a ~300 × 190
canvas (about 55k pixels) which is then CSS-scaled and blurred to full size — so
it costs the same on a 4K monitor as on a phone. It is capped at 30fps, paused
when off-screen or the tab is hidden, and never starts at all for
`prefers-reduced-motion`, `Save-Data`, ≤4 cores, or ≤4GB RAM. Those devices get
the static gradient underneath, which is what is server-rendered anyway.

**No image or video files.** Every visual is SVG, CSS or canvas. The only binary
the page downloads is one 47 KB subset of Inter, self-hosted by `next/font` and
preloaded.

**Layout shift is zero by construction.** The chart has a fixed
`aspect-ratio`; form error messages sit in reserved space; the counters are
`tabular-nums` and server-render their final value; the story panels are stacked
in one grid cell so swapping them cannot reflow.

**Reduced motion is honoured properly** — `MotionConfig reducedMotion="user"`
for Motion, a media query that neutralises every keyframe and transition for the
CSS layer, and the canvas simply never starts.

---

## Lead capture

`POST /api/lead` — the dummy CRM sink.

Submissions are recorded three ways so the data is verifiable wherever it runs:

1. a structured server log (`vercel logs`, or your dev terminal);
2. appended to JSON Lines on disk — `.data/leads.jsonl` locally, `/tmp` on
   serverless, which is the only writable path there;
3. forwarded to `LEAD_WEBHOOK_URL` if set.

For point 3, any endpoint that accepts a JSON `POST` works — a Google Sheet via
SheetDB or an Apps Script Web App, or a [webhook.site](https://webhook.site) URL,
which is the quickest way to prove delivery to a reviewer.

In development, `GET /api/lead` returns everything captured so far.

**Validation runs on both sides** from one shared module
(`lib/validateLead.ts`), because client-side validation is a courtesy, not a
gate. The endpoint also carries a honeypot field and a per-IP rate limit.

Try it:

```bash
curl -X POST http://localhost:3000/api/lead \
  -H 'content-type: application/json' \
  -d '{"name":"Jordan Reyes","email":"jordan@northbound.com",
       "company":"Northbound","budget":"15k-50k"}'
```

---

## Tracking

Everything routes through the **GTM dataLayer** as the single source of truth.
Set `NEXT_PUBLIC_GTM_ID` to load a real container; the container script is loaded
`afterInteractive`, so it can never delay LCP.

Because the assignment asks for a *mock* GA4 / Meta Pixel event, `lib/analytics.ts`
installs shims for `gtag` and `fbq` when no real tag is present. They queue the
call, push it to the dataLayer, and log it — so the conversion is verifiable
without a live container.

Events fired: `page_view`, `section_view`, `cta_click`, `form_start`,
`form_error`, and on success **`generate_lead`** (GA4, with `currency`, `value`
and `lead_id`) plus Meta **`Lead`**.

To verify in the browser: submit the form, then

```js
window.dataLayer.filter(e => e.event === 'generate_lead')
window.fbq.queue
```

---

## Accessibility

Keyboard-reachable throughout with a skip link and visible focus rings; the form
labels every field, sets `aria-invalid` / `aria-describedby`, moves focus to the
first invalid field on submit, and announces success via `role="status"`. Budget
is a real `radiogroup`. All text meets WCAG AA contrast (this cost some of the
very low-opacity greys, and was worth it). Lighthouse accessibility: 100.

---

## Deploying

Vercel, from the repository root:

```bash
npx vercel --prod
```

Or import the repo at [vercel.com/new](https://vercel.com/new) — the defaults are
correct for Next.js and no build configuration is needed.

Set these in the project's environment variables (all optional; the page works
without them):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | canonical URL for metadata |
| `NEXT_PUBLIC_GTM_ID` | loads a real GTM container |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | ID reported by the GA4 mock |
| `NEXT_PUBLIC_META_PIXEL_ID` | ID reported by the Pixel mock |
| `LEAD_WEBHOOK_URL` | forwards leads to a sheet or webhook |
| `LEAD_WEBHOOK_TOKEN` | sent as `x-api-key` to that webhook |

---

## Layout

```
app/
  layout.tsx          fonts, metadata, GTM, the data-js guard
  page.tsx            section order — the argument
  globals.css         design tokens + the CSS reveal system
  api/lead/route.ts   dummy CRM endpoint
components/
  site/               page sections
  fx/                 Reveal, RevealObserver, Aurora, Counter, SpotlightCard
  visuals/            the SVG/CSS "product" panels
lib/                  analytics, validation, motion constants, device profile
```

See [STRATEGY.md](STRATEGY.md) for the 300-word strategy note.
