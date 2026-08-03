# Bridgewood Academy

A complete, production-quality website for a fictional private early-learning
academy in Elmhurst, Illinois. Built as a sales demo to show owners and
directors of real childcare centers what their site could be.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · no component
library, no animation library, no icon package.

**Live: <https://bridgewood-academy.vercel.app>**

---

## About the deployment

Deployed to Vercel as project `bridgewood-academy`. The production alias above
is public and shareable; the per-deployment URLs
(`bridgewood-academy-<hash>-….vercel.app`) stay behind Vercel Authentication,
which is the default and worth leaving alone.

**The demo is deliberately not indexable.** Bridgewood Academy does not exist,
but Elmhurst does, and the license number on the site is not real — it should
never surface in a parent's search for childcare. The production environment
sets `NEXT_PUBLIC_NOINDEX=true`, which produces `noindex, nofollow` on every
page and a `Disallow: /` robots.txt. Verify with:

```bash
curl -s https://bridgewood-academy.vercel.app/robots.txt
```

The default with no environment variable is **indexable**, which is the correct
behaviour for the real center this template becomes. Remove the variable in the
Vercel dashboard, or set it to anything other than `true`, to turn indexing on.

Redeploy after changes with:

```bash
npx vercel deploy --prod
```

---

## Run it

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

Production build, which is what all the numbers below are measured against:

```bash
npm run build && npm start
```

Deploys to Vercel with zero configuration.

## Verify it

```bash
npm run verify
```

Contrast ratios, banned phrases, US-English spellings, external image hosts,
ratio-versus-state-minimum arithmetic, and the house rule that a room name
never appears without its age range. Prints the actual grep output for each.

```bash
npm run build && node scripts/browser-checks.mjs
```

Drives a real Chromium: hero fold at 390×844, CTA reachability at every scroll
position, tap-target geometry, keyboard-only operation, the form with and
without JavaScript, horizontal overflow at 320px, first-load JS, and
cross-page number consistency. Writes `verification/browser-checks.txt`.

```bash
npm run build && npm run verify:art                  # the art-direction plan, Section 9
npm run build && npm run verify:text                 # text that compiled without a space in it
```

`verify:text` exists because of a real bug that shipped. Written in a component,
`{staff.length} people` looks like it has a space in it and compiles without one
whenever the expression opens a line and the prose after it wraps — it went out
as "17people" in the first sentence of `/staff`. The single-line version of the
same shape is fine, so reading the source tells you nothing; it has to be checked
in the output, which is what this does, across every prerendered page and every
client chunk.

Hero height as a share of the viewport, the percentage of scroll height sitting
on a dark ground, the computed size of the display headline, the contrast of the
page white over the **real composited background** under every run of type on a
dark section, image bytes at 390px, all fifteen routes, and the focus ring on
every control on a dark section. Writes `verification/art-direction-checks.txt`.

The contrast check is the one worth knowing about: it hides the type, captures
the page in one frame, and samples the pixels the type was sitting on. A pair of
hex values cannot answer that question once a photograph and a gradient are
underneath the words.

```bash
npm run build && node scripts/lighthouse-check.mjs   # mobile preset, production build
npm run build && node scripts/screenshots.mjs        # every page at 390×844 and 1440×900
npm run build && node scripts/reskin-proof.mjs       # proves the one-file re-skin
npm run build && npm run verify:swap                 # CLS across a photo swap
npm run build && npm run verify:perf                 # CLS + LCP on emulated Slow 4G
npm run build && npm run verify:fix-brief            # no-JS legibility, titles, mobile page height
```

`verify:swap` writes a real JPEG over every placeholder path in the manifest,
reloads six pages at two widths, and measures layout shift. It is the proof
that dropping in real photography is a file copy and not a layout bug hunt.
Originals are restored on exit, always.

## Re-skin it for a new prospect

Edit **one file**: `content/site.config.ts`. Center name, tagline, address,
phone, email, license number and issuing agency, accreditations, hours,
director, and every brand color live there and nowhere else. No component holds
a hex value, a phone number or the center's name.

Then regenerate the placeholder art, which reads its palette from that same
file and its file list from `content/images.ts`:

```bash
npm run placeholders   # wordless SVG blocks for every empty slot + app/icon.svg
npm run photos:fetch   # downloads the source photography (once)
npm run photos:build   # grades it into AVIF/WebP/JPEG at the slot ratios
npm run photo-doc      # regenerates PHOTO-SWAP.md from the manifest
```

`scripts/reskin-proof.mjs` does exactly this end to end and screenshots the
result — see `verification/reskin-home--*.png`, which is Bridgewood rebranded to
"Harborview Academy" in a navy palette by changing four values.

## Where things live

```
content/          Every word and number. Typed, never hard-coded in JSX.
  site.config.ts    The re-skin switch
  images.ts         The image manifest — every path, alt, ratio, photo slot
  photo-briefs.ts   Shot direction. Build-time only; never bundled
  rooms.ts          Room name / age range, paired once so they never separate
  programs.ts       The six rooms — ratios, sizes, rates, rhythms, availability
  staff.ts          All seventeen people, including the cook
  tuition.ts        Rates derive from programs.ts; monthly is computed
  faq.ts            Twelve questions
  safety.ts         Procedures, thresholds, frequencies
  about.ts          Story, three practices, the building, the director's note
  testimonials.ts   Named parents, named rooms, named years
app/              Routes. (site) has the full chrome; (landing) is /book-a-tour
components/       Server by default; client only where behaviour requires it
lib/tour-schema.ts One zod schema, shared by the form and the API route
scripts/          Placeholder generation and the whole verification suite
```

---

## The seven conversion decisions

*This section is for the sales conversation. None of it appears on the site.*

**1. A CTA that is never more than one tap away.**
"Book a Tour" is visible at every scroll position on every page and every
breakpoint — a sticky bottom bar below 1024px, a sticky header above it. It is
never behind the hamburger. Most childcare sites bury the only action they want
you to take inside a menu, which means a parent has to decide twice.

**2. Live openings, by room, with honest bad news.**
The home page states, per room, whether there is space and when the next one
opens — including "Acorn Room, full, waitlist about 6 weeks". This is the single
most valuable and most commonly missing element in the niche. A parent tours 3.2
centers before deciding; the site's job is to make the shortlist, and the
fastest way onto a shortlist is to answer the question that made her open the
tab. Real scarcity, stated plainly, outperforms every fake countdown ever built
— and publishing the bad news is what makes the good news believable.

**3. Ratios and license as hard numbers, above the fold.**
`1:3 infant ratio — Illinois allows 1:4 · Licensed #IDEC-114-0928 · NAEYC
accredited · Open 6:30am–6:00pm`, inside the first screen on a phone. Around 84%
of parents rank safety and cleanliness above curriculum and cost, so safety is a
top-level nav item and a first-screen claim rather than a paragraph in About.
Putting the state minimum next to our own number turns a boast into a
comparison she can check.

**4. Real prices on a real page.**
Weekly and monthly for every room, both schedules, plus the registration fee and
the supply fee, and an explicit list of what is *not* included. A parent who
cannot find a price assumes she cannot afford it and leaves. The page closes
with "Nothing else gets added later. If a cost isn't on this page, we don't
charge it." That sentence is the most persuasive thing on the site, and the
monthly figures are computed as weekly × 52 ÷ 12 with the formula printed
underneath so a sceptical parent can reconcile them.

**5. A day, hour by hour, per room.**
"7:00 Arrival and free play · 8:00 Breakfast · 9:15 Outside, 45 minutes…" This
converts better than any paragraph about philosophy because it lets her picture
her own child in the room at 2pm on a Tuesday. It is also the section directors
most often say they wish they had.

**6. Social proof with a name, a room and a year attached.**
"— Danielle R., parent in the Sunflower Room (15–24 months), 2024." Vague praise
from "A Happy Mom" is worth less than nothing; it reads as invented. Every
teacher named in a quote is a real person on the staff page, assigned to the
room the parent names, so a parent who checks finds it consistent. One of the
three quotes is about a bad day — a child who bit another child — because the
believable review is the one that admits something went wrong.

**7. A booking page built for one job, with a real reply at the end of it.**
`/book-a-tour` is a landing page, not a form on a page: no nav links, five
fields, a named human with a photograph, and the promise that "Marisol replies
within one business day — a real reply, not an auto-response." Around 78% of
parents enroll at the first center that gives a genuinely helpful reply, and
helpful beats fast. Forms of five fields or fewer convert best, and a focused
page converts roughly twice as well as the same form dropped onto a general
contact page. On submit she gets a confirmation that names her, names the day
and slot she asked for, names the person who will write back, and tells her how
to change it — not "Thanks, we'll be in touch."

---

## The visual layer

The site was rebuilt against an art-direction plan after a comparison against
four competitor sites found the same failure on every axis at once: a 380px
hero beside a small image, a 40px headline, and no tone anywhere on the page
darker than its own body text. Whitespace without a focal point does not read as
expensive. It reads as unfinished.

What changed, and what it costs:

| | Before | Now |
|---|---|---|
| Hero | ~380px, image in a box beside the type | Full-bleed photograph, 85vh phone / 88vh desktop |
| Display headline at 1568 | 50px | **78px** |
| Dark ground | none | **22%** of the page's scroll height |
| Palette | two neutrals plus a green and a terracotta | plus sand `#F5EEE3`, ground `#24301F`, deep `#2A3A26`, brass `#C9A227` / `#7A5C12` |
| Openings block | an 11px-header data table | six cards, the number set at display scale in brass |
| Photography | six bright activity shots | eleven, graded to **two** exposure targets |

The dark is the hero and the closing band, both full-bleed photographs. Every
section between them sits on one of three light grounds — the page background, a
warm sand and a pale sage — because a section only has to look different from
the one above it, and that never required darkness. The verification check for
this is a two-sided band, 15–40%: too little and the page is flat, too much and
it is heavy.

Three things are worth knowing about how it was done.

**The grade has two targets, not one.** Matching every photograph to a single
mean luminance is what stops a set of stock images looking like a set of stock
images — but two of the new frames are dark on purpose, and holding them to the
daylight number turned a photograph whose whole value was its shadow into an
overcast afternoon. `tone: "low-key"` on a manifest entry moves it to its own
target. The daylight set now matches to within 4.7 levels of 255 and the low-key
set to within 8.9, and the two sets are four stops apart, which is the point.

**Contrast over a photograph is measured on the rendered page.** Every number in
the palette check is a pair of hex values, which is the right tool for a card on
a flat fill and useless for white type on a gradient over a photograph. Two
sections failed on their first build — 4.35:1 on the day timeline and 3.22:1 on
the closing band, both from single blown highlights the mean luminance said
nothing about. The scrims are now set from those peaks. Worst case anywhere on
the page is 6.40:1.

**The hero's headline has a reserved line box, and that is a CLS fix.** The hero
content is bottom-anchored, so when Source Serif 4 arrived 1.7s into a throttled
4G load and re-broke the headline, the whole block grew 422px → 502px and moved
up. That one element was a 0.256 CLS on its own. `.display-reserve` holds the
box at the line count the headline actually sets — four lines below `lg`, three
above, measured at every width from 390 to 2560.

---

## One measured shortfall

**First-load JavaScript on `/` is 156.3KB gzipped against the brief's 120KB
budget.** The figure is measured from the production build, counting the scripts
the initial HTML tells a modern browser to execute (the `nomodule` legacy
polyfill bundle is excluded, as Next.js excludes it).

It is not application weight. A page containing nothing but `<p>floor</p>`, with
no client components at all, measured ~144KB gzipped on this stack — that is the
Next 16 App Router runtime, the React 19 DOM renderer and the Flight client.
Everything this site adds on top of that is about 12KB.

The application share was cut roughly in half during the build by making the
room switcher a CSS-only radio group, making the scroll-reveal a single shared
observer instead of one client component per section, moving the hero out of the
client entirely, passing the header only the three room fields it renders, and
splitting the dev-only overflow probe behind a dynamic import.

Getting under 120KB would mean changing the rendering approach rather than the
code — a static export without the App Router client runtime, or a different
framework. Worth raising before anyone commits to the number.

Everything else is green. On the production build, after the art-direction
rebuild:

| | |
|---|---|
| Lighthouse mobile, `/` | **93 / 100 / 100 / 100** (Performance, Accessibility, Best Practices, SEO) |
| LCP, emulated Slow 4G + 4× CPU | **0.75s** at 390px, 0.73s at 1440px (budget 2.5s) |
| CLS | **0.000** at both widths (budget 0.1) |
| Image bytes on `/` at 390px | **44KB** on arrival, 179KB after scrolling the whole page |
| Static checks | 15/15 |
| Browser checks | 15/16 — the one above |
| Art-direction checks | 7/7 |
| Glued-text check | pass |

Performance moved 94 → 93 and LCP 3.0s → 3.1s on the Lighthouse preset, which is
what a full-bleed 88vh photograph costs. The hero is the only eager image on the
page; everything else is lazy, which is why arrival is still 44KB.
