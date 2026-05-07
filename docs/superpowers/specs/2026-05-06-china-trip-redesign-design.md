# Refined Hand-Made Journal Redesign

**Date:** 2026-05-06
**Status:** Design proposal, awaiting review
**Audience:** Hang (site owner) and the 7 travelers

## Why we're doing this

The site currently uses generic Tailwind defaults (Schibsted Grotesk + Source Sans Pro on stone-50/blue) and feels forgettable. More concretely, the group of 7 traveling Beijing → Yunnan in July–August 2026 needs a working reference document for 22 days on the road, and two specific failures hurt that:

1. **Map and content live in separate worlds.** The interactive map is its own page; trip plans are different pages; nothing binds them.
2. **The aesthetic is generic.** It doesn't feel made-for-this-trip. No personality the group can latch onto.

This redesign keeps Astro 6 + Tailwind 4 and the existing content, and changes everything that touches the eye and the navigation between map and itinerary.

## Decisions (locked during brainstorming)

| Question | Answer |
|---|---|
| Primary audience | The 7 travelers — utility first |
| Usage context | Mobile-first; desktop is a comfortable upgrade |
| Aesthetic direction | Refined hand-made journal |
| Dark mode | Drop it. Paper only. |
| Italian reach | Phrases page + Tips page + day-card highlight lines |
| Rollout | Single big branch, one PR |
| Map ↔ content IA | Pattern A on phase pages (collapsible split), Pattern C on the homepage (inline mini-maps in phase/day cards) |

## Aesthetic system

### Typography

| Role | Font | Weights |
|---|---|---|
| Display titles, day titles | **Fraunces** (italic + roman) | 400 / 600 / 800 |
| Body | **Inter** | 400 / 500 / 600 |
| Times, dates, codes, coordinates | **JetBrains Mono** | 400 / 500 |
| Handwritten accents (route labels, marginalia, day-stamp numbers, "today ~") | **Caveat** | 500 / 700 |
| Chinese (中文) | **Noto Serif SC** | 400 / 600 |

Loaded from Google Fonts. Preload Fraunces and Inter. Limit weights to those listed. Caveat is **never** used for load-bearing information — only atmosphere.

### Color tokens (CSS variables in `global.css`)

```
--paper:        #f5ecd7   /* page background */
--paper-card:   #fffbef   /* card background */
--ink:          #2a2118   /* primary text */
--ink-soft:     #5a4830   /* secondary text */
--muted:        #8a7050   /* mono / tertiary */
--border:       #c8b690   /* card borders */
--border-dash:  #b8a878   /* dashed dividers */

--vermillion:      #c0392b   /* stamps, day badges, primary accent */
--vermillion-soft: #b8541a   /* eyebrows, route line */
--sage:            #b8c4a8   /* tape green */
--gold:            #d4b078   /* tape gold */

/* phase colors — warm-shifted from the current palette */
--phase-beijing:   #1f5b8e
--phase-xian:      #b8541a
--phase-northwest: #2f8550
--phase-chengdu:   #c0392b
--phase-yunnan:    #6b5b8e
```

Dark-mode classes and tokens are removed. The `theme-toggle` button is removed from `Base.astro`.

### Texture and atmosphere

- Paper background: solid `--paper` plus a subtle SVG noise overlay (inline data URL, ~6% opacity).
- Soft radial vignettes on the homepage hero only (warmth without dirtying every page).
- Cards have a 2–3px offset drop shadow with no blur (paper-on-paper feel, not floating).

### Primitive components (new)

These live in `src/components/primitives/` and are tiny, focused, reusable:

- **`Tape.astro`** — `<Tape rotate={-3} color="sage|gold" />` renders a small SVG strip with semi-transparent stripes.
- **`Stamp.astro`** — bordered text element with rotation prop. Used for "22 DAYS", "MUST-DO", "OPTIONAL", etc.
- **`DayBadge.astro`** — circular vermillion number badge (Caveat) that can bleed into a card's left margin. Props: `number`, `bleed?`.
- **`Marginalia.astro`** — handwritten aside in Caveat that floats in a corner of its parent. Slot-based.
- **`DashedRoute.astro`** — SVG route-line that takes an array of `[x, y]` percentages and an optional list of labels.
- **`PaperCard.astro`** — base card with `--paper-card` background, 1px `--border`, offset shadow. Wraps day cards, phrase cards, etc.
- **`MiniMap.astro`** — small (~120×120 to ~200×200) Leaflet instance with all interaction disabled (`dragging: false`, no zoom controls, no scroll/touch zoom). Renders a custom vermillion pin at one or more lat/lngs. Reuses the same tile layer as `InteractiveMap` so we get caching and one tile-style decision. Fallback when no coords exist: a stylised SVG region shape (no real map). On the homepage we render 5 of these (one per phase card); profile after build to confirm the load is acceptable.
- **`Coords.astro`** — typeset "N 39.9° / E 116.4°" string in JetBrains Mono.

### Existing component changes

| Component | Change |
|---|---|
| `layouts/Base.astro` | Drop dark mode (HTML class, toggle button, `localStorage` script). Swap fonts. Paper background. Restyle nav with handwritten section labels. |
| `layouts/Destination.astro` | New header: Stamp + Coords + MiniMap. New body wrapper: room for Marginalia. |
| `components/TripCard.astro` | Rebuild as PaperCard with inline MiniMap, DayBadge phase number, Italian highlight line. |
| `components/DayCard.astro` | Rebuild around DayBadge bleed, JetBrains Mono times, Caveat marginalia slot. |
| `components/InteractiveMap.astro` | Keep functional. Restyle markers (vermillion pins with cream centers), restyle popups (PaperCard look), apply a CSS sepia/warm filter to tiles. |
| `components/TransportTable.astro` | Convert to ticket-stub cards (one per leg) — perforated edge, mono codes, Fraunces destination names. |
| `components/ImageGallery.astro` | Polaroid framing; first image of a row gets a slight rotation (≤2°). |
| `components/GoogleImagePreview.astro` | Polaroid framing. |
| `components/VideoGrid.astro` | Polaroid + Tape. |
| `components/MapDropdown.astro` | Restyle palette to journal tokens. |

## Information architecture

### Homepage (`pages/index.astro`)

Pattern C — no sticky map; each phase card carries its own mini-map.

1. **Hero**: handwritten eyebrow ("a trip across ~"), Fraunces italic title ("China, *2026*"), tape decorations, vermillion "22 DAYS" stamp, JetBrains Mono date range.
2. **Hero route SVG**: hand-drawn dashed line connecting the five phases, with handwritten city labels.
3. **"Today ~" section** *(conditional, client-side)*: if today's date is in the trip range, render the current day's card with extra emphasis. Otherwise, render the next upcoming day. Outside the trip window, hide this section.
4. **Phase cards** (5): each is a PaperCard with the phase MiniMap, DayBadge (phase number), date range, Fraunces title, Italian-translated highlight line, EN highlights, accommodation, transport.
5. **Full-trip route map** (the existing InteractiveMap, restyled, embedded inline — not a separate page).
6. **Transport connections** as ticket-stub cards (TransportTable redesign).
7. **Resources** list with handwritten section label.

### Phase pages (`pages/trips/{beijing,xian,northwest}.astro`)

Pattern A — collapsible split.

- **Default mobile layout**: map sticks to the top of the viewport at `50vh`; day list scrolls below it. A thin toolbar between them has two buttons: `[hide map]` `[hide list]`. Hiding the map collapses it to a 36px "show map" strip; hiding the list collapses the list to a single "N days · show" strip and the map fills the viewport.
- **Default desktop layout (≥1024px)**: left column = sticky map (≈45% width, full viewport height minus nav); right column = scrollable day list. Same hide/show buttons.
- **Coordination**:
  - Tap a day card → map pans/zooms to that day's bounding box and highlights its pin.
  - Tap a pin → list scrolls to that day, highlighted.
- **Day coordinates source**: each day in the trip data references one or more destination slugs. Day bounding box = bounding box of those destinations' coords from `src/data/locations.ts`. Days with no destination data fall back to the phase center. This requires extending `locations.ts` with a `days` array per phase (see Implementation order step 4).
- **State**: `localStorage` remembers the user's last hide/show preference per phase.
- **No URL params for state** (keep it simple). If we need shareable deep links later, that's a v2.

### Destination pages (`pages/{phase}/*.astro`, ≈25 pages)

- New header: Stamp ("must-do" / "optional"), Fraunces title with paired Chinese, Coords.
- Top-right: small MiniMap (or single-pin static map) showing where it is in the phase.
- Body: existing prose, restyled. Marginalia slot for tips/notes/warnings.
- Photos: polaroid framing.

### Resources

- `resources/useful-phrases.astro` — phrase cards in PaperCard. Each card: handwritten intent label ("how much?"), large Chinese (Noto Serif SC), pinyin (Fraunces italic), English (Inter), Italian (Inter italic muted), tap-to-play vermillion button.
- `resources/tips.astro` — sectioned with Stamp warnings ("BEWARE!"), Marginalia, Italian translation per section.
- `resources/packing-list.astro` — checklist with Tape-marked categories.
- `pages/map.astro` — full atlas; legend rebuilt in journal palette.

## Implementation order (single PR, multiple commits)

This is an order-of-operations, not a phasing for separate PRs:

1. Design tokens + global.css + font loading + drop dark mode.
2. Primitive components (`Tape`, `Stamp`, `DayBadge`, `Marginalia`, `DashedRoute`, `PaperCard`, `MiniMap`, `Coords`).
3. `Base.astro` and `Destination.astro` layouts.
4. Extend `src/data/locations.ts` with a `days` array per phase (date, slug or destination refs, English headline, Italian headline). This data is the substrate for both the homepage day card and phase-page coordination.
5. Homepage (`index.astro`): hero, route SVG, phase cards (with MiniMap), embedded route map, transport, resources block, "Today ~".
6. Phase pages: collapsible split (BJ → Xi'an → Northwest).
7. `InteractiveMap.astro` restyle (markers, popups, tile filter).
8. Destination pages: rolling per-page header restyle and photo polaroid pass.
9. Resources: phrases, tips, packing list, map page.
10. Italian copy: drafted alongside each step where day-card highlights / tips / phrases are touched. User reviews drafts before PR merge.

## Risks and non-goals

**Risks**

- **Caveat readability.** Confined to atmospheric uses only. If any user-test reveals a Caveat string blocking comprehension, swap it for Fraunces italic.
- **Performance.** Five font families is heavy; we subset weights and preload only Fraunces + Inter. Other faces load `font-display: swap`.
- **Map tile filter.** A CSS sepia filter on Leaflet tiles can wash out detail. Test on the densest map (Beijing) before committing.
- **Italian draft quality.** The 5 Italian travelers are the QA. User reviews drafts before merge.

**Out of scope**

- Italian on long body content (only phrases, tips, day-card highlight lines).
- Backend or content-pipeline changes; markdown/Astro structure stays.
- Offline / PWA support.
- New trip phases (Chengdu/Yunnan stay "coming soon").
- Automated tests (none today; not adding them in scope).
- Build/deploy changes.

## Validation

Manual test pass before PR review:

- Mobile (375px), tablet (768px), desktop (1280px) on:
  - Homepage with and without "Today" matching a trip date (mock the date for the off-trip case).
  - Each phase page, with map hidden, list hidden, and both visible.
  - Two destination pages (one image-heavy, one text-heavy).
  - Phrases, tips, packing-list, map.
- Lighthouse pass on homepage: confirm no font/render regressions vs. current (font weight should be similar with the subset).
- Print stylesheet not in scope.
