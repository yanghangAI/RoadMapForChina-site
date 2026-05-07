# China Trip Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current generic Tailwind look with a refined hand-made-journal aesthetic, integrate map and content (Pattern C on the homepage, collapsible Pattern A on phase pages), drop dark mode, and add Italian to phrases / tips / day-card highlight lines.

**Architecture:** Astro 6 + Tailwind 4. New design tokens live in `src/styles/global.css` `@theme` block and become Tailwind utilities. New primitive components in `src/components/primitives/` provide tape, stamps, day badges, marginalia, paper cards, mini-maps, etc. Existing content pages keep their structure but swap out cards, layouts, and the InteractiveMap styling. Day-level data is added to `src/data/locations.ts` so the phase-page split-view can drive both map and list from one source.

**Tech Stack:** Astro 6, Tailwind CSS 4 (`@tailwindcss/vite`), Leaflet 1.9.4 (existing, kept), Google Fonts (Fraunces, Inter, JetBrains Mono, Caveat, Noto Serif SC).

**Verification model:** This project has no automated test suite. Each task ends with a manual verification step: keep `npm run dev` running, refresh the relevant URL, observe the documented behaviour. Where logic is non-trivial (split-view coordination, "today" detection), the verification names specific things to look for.

---

## File Structure

**New files:**

- `src/styles/journal.css` — paper texture, marginalia, tape, stamp utilities. Imported from `global.css`.
- `src/components/primitives/Tape.astro`
- `src/components/primitives/Stamp.astro`
- `src/components/primitives/DayBadge.astro`
- `src/components/primitives/Marginalia.astro`
- `src/components/primitives/DashedRoute.astro`
- `src/components/primitives/PaperCard.astro`
- `src/components/primitives/MiniMap.astro`
- `src/components/primitives/Coords.astro`
- `src/components/PhraseCard.astro` — phrase card replacing the table rows on the phrases page
- `src/components/TicketStub.astro` — replaces TransportTable rows
- `src/components/SplitView.astro` — collapsible map+list shell used by phase pages

**Modified files (per-task detail in tasks):**

- `src/styles/global.css` — replace tokens, drop dark mode utilities
- `src/layouts/Base.astro` — drop dark mode, swap fonts, paper background, restyled nav
- `src/layouts/Destination.astro` — new header (Stamp + Coords + MiniMap), polaroid media
- `src/components/InteractiveMap.astro` — restyle markers, popups, tile filter, optionally accept a custom marker class for "active day"
- `src/components/TripCard.astro` — rebuild as PaperCard composition
- `src/components/DayCard.astro` — rebuild around DayBadge
- `src/components/TransportTable.astro` — re-export of TicketStub list (or delete and update callers — see Task 30)
- `src/components/ImageGallery.astro` — polaroid framing
- `src/components/GoogleImagePreview.astro` — polaroid framing
- `src/components/VideoGrid.astro` — polaroid + tape
- `src/components/MapDropdown.astro` — restyle palette
- `src/data/locations.ts` — add `days` array per phase
- `src/pages/index.astro` — full rebuild
- `src/pages/trips/beijing.astro`, `xian.astro`, `northwest.astro` — full rebuild as SplitView consumers
- `src/pages/resources/useful-phrases.astro` — full rebuild around PhraseCard
- `src/pages/resources/tips.astro` — restyle, add Italian
- `src/pages/resources/packing-list.astro` — restyle
- `src/pages/map.astro` — restyle (palette only)
- All ~25 destination pages — header restyle pass (low touch; layout does most of the work)

**Deleted:**
- Dark mode toggle script in `Base.astro` and the `.dark` selectors in `global.css`.

---

## Phase 1 — Foundation

### Task 1: Replace design tokens in `global.css`

**Files:**
- Modify: `src/styles/global.css` (full rewrite, ~85 → ~70 lines)
- Create: `src/styles/journal.css`

- [ ] **Step 1: Replace `src/styles/global.css` with the new token set**

```css
@import "tailwindcss";
@import "./journal.css";

@theme {
  /* paper / ink */
  --color-paper:        #f5ecd7;
  --color-paper-card:   #fffbef;
  --color-ink:          #2a2118;
  --color-ink-soft:     #5a4830;
  --color-muted:        #8a7050;
  --color-border:       #c8b690;
  --color-border-dash:  #b8a878;

  /* accents */
  --color-vermillion:      #c0392b;
  --color-vermillion-soft: #b8541a;
  --color-sage:            #b8c4a8;
  --color-gold:            #d4b078;

  /* phase colors — warm-shifted */
  --color-phase-beijing:   #1f5b8e;
  --color-phase-xian:      #b8541a;
  --color-phase-northwest: #2f8550;
  --color-phase-chengdu:   #c0392b;
  --color-phase-yunnan:    #6b5b8e;

  /* fonts */
  --font-display: 'Fraunces', Georgia, serif;
  --font-sans:    'Inter', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', 'IBM Plex Mono', monospace;
  --font-hand:    'Caveat', 'Bradley Hand', cursive;
  --font-zh:      'Noto Serif SC', 'Songti SC', 'STSong', serif;
}

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-sans);
  @apply text-ink bg-paper antialiased;
}

:is(h1, h2, h3, h4) {
  font-family: var(--font-display);
}

/* Prose styling for destination markdown bodies */
.prose h2 { @apply text-2xl font-semibold mt-10 mb-4 pb-2 border-b border-border-dash; font-family: var(--font-display); }
.prose h3 { @apply text-xl font-semibold mt-8 mb-3; font-family: var(--font-display); }
.prose p  { @apply mb-4 leading-relaxed; }
.prose ul { @apply list-disc pl-6 mb-4 space-y-1; }
.prose ol { @apply list-decimal pl-6 mb-4 space-y-1; }
.prose li { @apply leading-relaxed; }
.prose a  { @apply text-vermillion-soft underline decoration-vermillion-soft/40 underline-offset-2 hover:decoration-vermillion-soft transition-colors; }
.prose strong { @apply font-semibold; }
.prose blockquote { @apply border-l-4 border-border pl-4 italic text-ink-soft my-4; }
.prose table { @apply w-full text-sm border-collapse my-4; }
.prose th { @apply text-left font-semibold p-2 border-b-2 border-border bg-paper-card; }
.prose td { @apply p-2 border-b border-border-dash; }
.prose hr { @apply my-8 border-border-dash; }
```

- [ ] **Step 2: Create `src/styles/journal.css` with reusable journal effects**

```css
/* Paper texture, applied via the .paper class on backgrounds */
.paper {
  background-color: var(--color-paper);
  background-image:
    radial-gradient(circle at 18% 8%, rgba(192,57,43,.04) 0, transparent 38%),
    radial-gradient(circle at 82% 88%, rgba(139,90,43,.05) 0, transparent 38%),
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.6  0 0 0 0 0.45  0 0 0 0 0.25  0 0 0 0.06 0'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>");
}

/* PaperCard offset shadow */
.paper-card-shadow {
  box-shadow: 2px 3px 0 rgba(43,33,24,.08), 0 0 0 1px rgba(43,33,24,.04);
}

/* Dashed divider */
.dashed-divider {
  border-top: 1px dashed var(--color-border-dash);
}

/* Map dropdown — restyled to journal palette */
.map-dropdown { display: inline-block; position: relative; }
.map-dropdown summary { list-style: none; cursor: pointer; font-size: 1.25rem; user-select: none; }
.map-dropdown .map-links {
  position: absolute; top: 2rem; left: 0;
  background: var(--color-paper-card);
  border: 1px solid var(--color-border);
  padding: .75rem; z-index: 50;
  min-width: 180px; white-space: nowrap;
  box-shadow: 2px 3px 0 rgba(43,33,24,.12);
}
.map-dropdown .map-links a {
  display: block; padding: .25rem 0;
  font-size: .875rem; color: var(--color-ink);
  text-decoration: none;
}
.map-dropdown .map-links a:hover { color: var(--color-vermillion-soft); }
```

- [ ] **Step 3: Run dev server and confirm the page still loads (it'll look broken — that's expected; we just want a green build)**

```bash
npm run dev
```

Visit `http://localhost:4321/RoadMapForChina-site/`. Expected: page loads on a cream background, fonts fall back to system because we haven't loaded the new ones yet, dark mode classes don't crash anything yet (they'll be visually inconsistent until the next task).

- [ ] **Step 4: Commit**

```bash
git checkout -b redesign-journal
git add src/styles/global.css src/styles/journal.css
git commit -m "Add journal design tokens and paper utilities"
```

---

### Task 2: Swap font loading and drop dark mode in `Base.astro`

**Files:**
- Modify: `src/layouts/Base.astro` (full rewrite)

- [ ] **Step 1: Replace `src/layouts/Base.astro` end-to-end**

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'China Road Trip 2026 — 22 days across Beijing, Xi\'an, Northwest Loop, Chengdu & Yunnan' } = Astro.props;
const base = import.meta.env.BASE_URL;
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content={description} />
  <title>{title} · China 2026</title>
  <link rel="icon" type="image/png" href={`${base}static/icon.png`} />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    rel="preload" as="style"
    href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,800;1,400;1,600&family=Inter:wght@400;500;600&display=swap"
  />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,800;1,400;1,600&family=Inter:wght@400;500;600&display=swap"
  />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=JetBrains+Mono:wght@400;500&family=Noto+Serif+SC:wght@400;600&display=swap"
  />
</head>
<body class="paper min-h-screen flex flex-col text-ink">
  <nav class="sticky top-0 z-40 bg-paper/85 backdrop-blur-md border-b border-border-dash">
    <div class="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
      <a href={base} class="font-display italic font-semibold text-lg tracking-tight hover:text-vermillion-soft transition-colors">
        China, <span class="text-vermillion">2026</span>
      </a>
      <div class="flex items-center gap-4 text-sm">
        <a href={`${base}trips/beijing`} class="hidden sm:inline text-ink-soft hover:text-ink transition-colors">Beijing</a>
        <a href={`${base}trips/xian`} class="hidden sm:inline text-ink-soft hover:text-ink transition-colors">Xi'an</a>
        <a href={`${base}trips/northwest`} class="hidden sm:inline text-ink-soft hover:text-ink transition-colors">Northwest</a>
        <a href={`${base}map`} class="text-ink-soft hover:text-ink transition-colors">Map</a>
        <a href={`${base}resources/tips`} class="text-ink-soft hover:text-ink transition-colors">Resources</a>
      </div>
    </div>
  </nav>

  <main class="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
    <slot />
  </main>

  <footer class="border-t border-border-dash py-6 text-center text-sm text-muted">
    <div class="max-w-5xl mx-auto px-4 font-hand text-base">
      China Road Trip 2026 · 7 of us · 22 days
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 2: Verify in dev**

Refresh `http://localhost:4321/RoadMapForChina-site/`. Expected: cream paper background with subtle texture, italic Fraunces "China, 2026" wordmark in nav, no dark-mode toggle button, footer caption in handwriting font.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "Swap fonts and drop dark mode in Base layout"
```

---

## Phase 2 — Primitives

These eight components are tiny, single-purpose, slot-friendly. Each task creates one file plus a quick visual verification using a temporary debug route or by sticking it on the homepage.

### Task 3: `Tape.astro` primitive

**Files:**
- Create: `src/components/primitives/Tape.astro`

- [ ] **Step 1: Write the component**

```astro
---
interface Props {
  rotate?: number;        // degrees
  color?: 'sage' | 'gold' | 'red';
  width?: number;         // px
  class?: string;
}
const { rotate = -3, color = 'sage', width = 70, class: className = '' } = Astro.props;
const fill = {
  sage: 'rgba(184,196,168,.55)',
  gold: 'rgba(212,180,140,.55)',
  red:  'rgba(192,57,43,.35)',
}[color];
---
<span
  class={`block ${className}`}
  style={`width:${width}px;height:18px;background:${fill};transform:rotate(${rotate}deg);box-shadow:0 1px 2px rgba(0,0,0,.08);position:relative;`}
>
  <span style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 4px,rgba(255,255,255,.25) 4px 8px);"></span>
</span>
```

- [ ] **Step 2: Sanity-check render**

Temporarily add `<Tape />` to the top of `src/pages/index.astro` (above the `<Base>`'s `<h1>`), refresh. Expected: a small sage-green tape strip rotated -3°. Remove the temporary line before committing.

- [ ] **Step 3: Commit**

```bash
git add src/components/primitives/Tape.astro
git commit -m "Add Tape primitive"
```

---

### Task 4: `Stamp.astro` primitive

**Files:**
- Create: `src/components/primitives/Stamp.astro`

- [ ] **Step 1: Write the component**

```astro
---
interface Props {
  rotate?: number;
  color?: 'vermillion' | 'ink';
  class?: string;
}
const { rotate = 8, color = 'vermillion', class: className = '' } = Astro.props;
const tone = color === 'ink' ? 'var(--color-ink)' : 'var(--color-vermillion)';
---
<span
  class={`inline-block font-display font-extrabold uppercase tracking-[.15em] text-[10px] px-2 py-1 ${className}`}
  style={`border:2px solid ${tone};color:${tone};transform:rotate(${rotate}deg);opacity:.88;`}
>
  <slot />
</span>
```

- [ ] **Step 2: Verify**

Temporarily add `<Stamp>22 DAYS</Stamp>` to `index.astro`. Refresh; expected: vermillion bordered, all-caps, slight rotation. Remove the temp line.

- [ ] **Step 3: Commit**

```bash
git add src/components/primitives/Stamp.astro
git commit -m "Add Stamp primitive"
```

---

### Task 5: `DayBadge.astro` primitive

**Files:**
- Create: `src/components/primitives/DayBadge.astro`

- [ ] **Step 1: Write the component**

```astro
---
interface Props {
  number: number | string;
  bleed?: boolean;   // when true, position absolutely with negative offset for "bleeding into margin" look
  size?: number;     // px diameter
  rotate?: number;
}
const { number, bleed = false, size = 36, rotate = -4 } = Astro.props;
---
<span
  class={`grid place-items-center font-hand font-bold text-[var(--color-paper-card)] ${bleed ? 'absolute -left-2.5 -top-2' : 'inline-grid'}`}
  style={`width:${size}px;height:${size}px;border-radius:50%;background:var(--color-vermillion);font-size:${Math.round(size*0.6)}px;transform:rotate(${rotate}deg);box-shadow:1px 2px 0 rgba(0,0,0,.1);line-height:1;`}
>{number}</span>
```

- [ ] **Step 2: Verify**

Temporarily add `<DayBadge number={3} />` to `index.astro`. Expected: red circle with handwritten "3", slight rotation.

- [ ] **Step 3: Commit**

```bash
git add src/components/primitives/DayBadge.astro
git commit -m "Add DayBadge primitive"
```

---

### Task 6: `Marginalia.astro` primitive

**Files:**
- Create: `src/components/primitives/Marginalia.astro`

- [ ] **Step 1: Write the component**

```astro
---
interface Props {
  position?: 'br' | 'bl' | 'tr' | 'tl';
  rotate?: number;
  color?: 'rust' | 'ink' | 'red';
  class?: string;
}
const { position = 'br', rotate = -2, color = 'rust', class: className = '' } = Astro.props;
const tone = color === 'red' ? 'var(--color-vermillion)' : color === 'ink' ? 'var(--color-ink)' : 'var(--color-vermillion-soft)';
const corners = {
  br: 'right-2 bottom-1',
  bl: 'left-2 bottom-1',
  tr: 'right-2 top-1',
  tl: 'left-2 top-1',
}[position];
---
<span
  class={`absolute font-hand text-[15px] leading-tight max-w-[42%] ${corners} ${className}`}
  style={`color:${tone};transform:rotate(${rotate}deg);text-align:right;`}
>
  <slot />
</span>
```

- [ ] **Step 2: Verify**

Drop a sample `<div class="relative paper-card-shadow border border-border bg-paper-card p-4 mt-4"><p>Sample card</p><Marginalia>bring sunblock!!</Marginalia></div>` into `index.astro`. Expected: handwritten rust note in the bottom-right corner of the sample card.

- [ ] **Step 3: Commit**

```bash
git add src/components/primitives/Marginalia.astro
git commit -m "Add Marginalia primitive"
```

---

### Task 7: `DashedRoute.astro` primitive

**Files:**
- Create: `src/components/primitives/DashedRoute.astro`

- [ ] **Step 1: Write the component**

```astro
---
interface RoutePoint {
  x: number;       // 0–100 (% of width)
  y: number;       // 0–100 (% of height)
  label?: string;
  labelPos?: 'above' | 'below';
}
interface Props {
  points: RoutePoint[];
  height?: number;     // px, used for label positioning math
  class?: string;
}
const { points, height = 60, class: className = '' } = Astro.props;
const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
---
<div class={`relative w-full ${className}`} style={`height:${height}px`}>
  <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="absolute inset-0 w-full h-full">
    <path d={path} stroke="var(--color-vermillion)" stroke-width="0.6" fill="none" stroke-dasharray="1.6 1.6" stroke-linecap="round" />
    {points.map(p => (
      <circle cx={p.x} cy={p.y} r="1.6" fill="var(--color-ink)" />
    ))}
  </svg>
  {points.map(p => p.label && (
    <span
      class="absolute font-hand text-[13px] text-ink whitespace-nowrap"
      style={`left:${p.x}%;top:${p.y}%;transform:translate(-50%, ${p.labelPos === 'above' ? '-130%' : '40%'});`}
    >{p.label}</span>
  ))}
</div>
```

- [ ] **Step 2: Verify**

Temporarily add `<DashedRoute points={[{x:5,y:60,label:'Beijing',labelPos:'below'},{x:30,y:40,label:"Xi'an"},{x:55,y:25,label:'Northwest!',labelPos:'above'},{x:78,y:55,label:'Chengdu'},{x:95,y:75,label:'Yunnan'}]} />` to `index.astro`. Expected: dashed vermillion line with handwritten city labels. Remove temp line.

- [ ] **Step 3: Commit**

```bash
git add src/components/primitives/DashedRoute.astro
git commit -m "Add DashedRoute primitive"
```

---

### Task 8: `PaperCard.astro` primitive

**Files:**
- Create: `src/components/primitives/PaperCard.astro`

- [ ] **Step 1: Write the component**

```astro
---
interface Props {
  href?: string;
  class?: string;
  padded?: boolean;
}
const { href, class: className = '', padded = true } = Astro.props;
const baseClasses = `relative bg-paper-card border border-border paper-card-shadow ${padded ? 'p-4' : ''} ${className}`;
---
{href ? (
  <a href={href} class={`block ${baseClasses} no-underline text-inherit hover:-translate-y-px transition-transform`}>
    <slot />
  </a>
) : (
  <div class={baseClasses}>
    <slot />
  </div>
)}
```

- [ ] **Step 2: Verify**

Add `<PaperCard><h3 class="font-display text-lg">Sample</h3><p class="text-sm">Card body</p></PaperCard>` to `index.astro`. Expected: cream card with 1px border, offset shadow, hover lift if href provided.

- [ ] **Step 3: Commit**

```bash
git add src/components/primitives/PaperCard.astro
git commit -m "Add PaperCard primitive"
```

---

### Task 9: `Coords.astro` primitive

**Files:**
- Create: `src/components/primitives/Coords.astro`

- [ ] **Step 1: Write the component**

```astro
---
interface Props {
  lat: number;
  lng: number;
  class?: string;
}
const { lat, lng, class: className = '' } = Astro.props;
const ns = lat >= 0 ? 'N' : 'S';
const ew = lng >= 0 ? 'E' : 'W';
const fmt = (v: number) => Math.abs(v).toFixed(2);
---
<span class={`font-mono text-[10px] tracking-[.18em] uppercase text-vermillion-soft ${className}`}>
  {ns} {fmt(lat)}° / {ew} {fmt(lng)}°
</span>
```

- [ ] **Step 2: Verify**

Add `<Coords lat={39.916} lng={116.390} />` to `index.astro`. Expected: small monospaced "N 39.92° / E 116.39°" in rust.

- [ ] **Step 3: Commit**

```bash
git add src/components/primitives/Coords.astro
git commit -m "Add Coords primitive"
```

---

### Task 10: `MiniMap.astro` primitive

**Files:**
- Create: `src/components/primitives/MiniMap.astro`

This component renders a small Leaflet instance with all interaction disabled, showing one or more pins. Reuses Leaflet from CDN (already used by InteractiveMap).

- [ ] **Step 1: Write the component**

```astro
---
interface Pin {
  lat: number;
  lng: number;
  color?: string;
}
interface Props {
  pins: Pin[];
  /** map id; must be unique per page */
  id: string;
  /** [lat, lng] center; if omitted, fit to pins */
  center?: [number, number];
  zoom?: number;
  height?: number;
  width?: number | 'full';
  /** rounded corners and 1px border use journal palette */
  class?: string;
}
const {
  pins,
  id,
  center,
  zoom = 8,
  height = 120,
  width = 'full',
  class: className = '',
} = Astro.props;

const widthStyle = width === 'full' ? 'width:100%' : `width:${width}px`;
---
<div
  id={id}
  class={`relative overflow-hidden border border-border ${className}`}
  style={`${widthStyle};height:${height}px;`}
></div>

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script is:inline define:vars={{ id, pins, center, zoom }}>
  function initMini() {
    if (typeof L === 'undefined') { setTimeout(initMini, 80); return; }
    var el = document.getElementById(id);
    if (!el || el._leaflet_id) return;

    var c = center || [pins[0].lat, pins[0].lng];
    var map = L.map(id, {
      zoomControl: false, attributionControl: false,
      dragging: false, scrollWheelZoom: false, doubleClickZoom: false,
      touchZoom: false, boxZoom: false, keyboard: false,
    }).setView(c, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);

    var bounds = [];
    pins.forEach(function(p) {
      var col = p.color || '#c0392b';
      var icon = L.divIcon({
        html: '<div style="background:' + col + ';width:12px;height:12px;border-radius:50%;border:2px solid #fffbef;box-shadow:0 1px 2px rgba(0,0,0,.3);"></div>',
        className: '', iconSize: [12,12], iconAnchor: [6,6]
      });
      L.marker([p.lat, p.lng], { icon: icon }).addTo(map);
      bounds.push([p.lat, p.lng]);
    });

    if (!center && bounds.length > 1) {
      map.fitBounds(bounds, { padding: [12, 12] });
    }

    setTimeout(function(){ map.invalidateSize(); }, 80);
  }

  if (typeof L === 'undefined') {
    if (!document.querySelector('script[data-leaflet]')) {
      var s = document.createElement('script');
      s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      s.setAttribute('data-leaflet','1');
      s.onload = function(){ window.dispatchEvent(new Event('leaflet-loaded')); };
      document.head.appendChild(s);
    }
    window.addEventListener('leaflet-loaded', initMini, { once: true });
  } else {
    initMini();
  }
</script>

<style>
  /* Sepia/warm filter on tile imagery — applied per-MiniMap instance */
  :global(.leaflet-tile-pane) {
    filter: sepia(.35) saturate(.85) hue-rotate(-12deg) brightness(.97);
  }
</style>
```

- [ ] **Step 2: Verify**

Temporarily add `<MiniMap id="test-mini" pins={[{lat:39.916,lng:116.390}]} center={[39.916,116.390]} zoom={11} height={140} />` to `index.astro`. Expected: a small map showing Beijing centered, sepia-tinted, with a vermillion pin, no zoom/scroll. Remove the temp line.

- [ ] **Step 3: Commit**

```bash
git add src/components/primitives/MiniMap.astro
git commit -m "Add MiniMap primitive (interactive-disabled Leaflet, sepia filter)"
```

---

## Phase 3 — Data extension

### Task 11: Add a `days` array per phase to `locations.ts`

The phase pages need day-level data with date, English headline, Italian headline, and the destination slugs that comprise the day. This task extends the data model. Italian headlines are draft; user reviews before merge.

**Files:**
- Modify: `src/data/locations.ts` (append, no rewrite of existing exports)

- [ ] **Step 1: Append the new types and `tripDays` export at the end of `src/data/locations.ts`**

```ts
export interface TripDay {
  /** ISO date, YYYY-MM-DD */
  date: string;
  /** Phase number, 1–5, matches tripPhases.num */
  phaseNum: number;
  /** Day index within the whole trip, 1-based */
  dayInTrip: number;
  /** Day index within the phase, 1-based */
  dayInPhase: number;
  /** English headline shown on day cards */
  headline: string;
  /** Italian headline (draft — user verifies) */
  headlineIt: string;
  /** Slugs of destinations that make up this day. Used for map bounding box. */
  destinationSlugs: string[];
  /** Optional fallback coordinates when destinationSlugs is empty (e.g. transit days) */
  fallbackCoords?: [number, number];
}

export const tripDays: TripDay[] = [
  // ===== Beijing =====
  { date: '2026-07-14', phaseNum: 1, dayInTrip: 1, dayInPhase: 1,
    headline: 'Arrival, Panjiayuan & 798',
    headlineIt: 'Arrivo, Panjiayuan e 798',
    destinationSlugs: ['panjiayuan', '798-art'] },
  { date: '2026-07-15', phaseNum: 1, dayInTrip: 2, dayInPhase: 2,
    headline: 'Great Wall at Mutianyu',
    headlineIt: 'La Grande Muraglia a Mutianyu',
    destinationSlugs: ['great-wall'] },
  { date: '2026-07-16', phaseNum: 1, dayInTrip: 3, dayInPhase: 3,
    headline: 'Forbidden City, Hutongs & night train',
    headlineIt: 'Città Proibita, Hutong e treno notturno',
    destinationSlugs: ['tiananmen', 'forbidden-city', 'hutongs'] },

  // ===== Xi'an =====
  { date: '2026-07-17', phaseNum: 2, dayInTrip: 4, dayInPhase: 1,
    headline: 'Terracotta Warriors, City Wall, Muslim Quarter',
    headlineIt: 'Esercito di Terracotta, Mura, Quartiere Musulmano',
    destinationSlugs: ['terracotta-warriors', 'city-wall', 'muslim-quarter', 'tang-mall'] },

  // ===== Northwest Loop =====
  { date: '2026-07-18', phaseNum: 3, dayInTrip: 5, dayInPhase: 1,
    headline: "Train to Xining, Riyueshan, Qinghai Lake",
    headlineIt: 'Treno per Xining, Riyueshan, Lago Qinghai',
    destinationSlugs: ['riyueshan', 'qinghai-lake'] },
  { date: '2026-07-19', phaseNum: 3, dayInTrip: 6, dayInPhase: 2,
    headline: 'Chaka Salt Lake & on to Delingha',
    headlineIt: 'Lago Salato di Chaka e Delingha',
    destinationSlugs: ['chaka-salt-lake', 'delingha'] },
  { date: '2026-07-20', phaseNum: 3, dayInTrip: 7, dayInPhase: 3,
    headline: 'Feicui Hu emerald lake, drive to Dunhuang',
    headlineIt: 'Lago smeraldo Feicui Hu, viaggio a Dunhuang',
    destinationSlugs: ['feicui-hu'],
    fallbackCoords: [39.5, 95.5] },
  { date: '2026-07-21', phaseNum: 3, dayInTrip: 8, dayInPhase: 4,
    headline: 'Mogao Caves, Mingsha dunes, night market',
    headlineIt: 'Grotte di Mogao, dune di Mingsha, mercato notturno',
    destinationSlugs: ['mogao-caves', 'mingsha-dunes', 'dunhuang-night-market'] },
  { date: '2026-07-22', phaseNum: 3, dayInTrip: 9, dayInPhase: 5,
    headline: 'Yardang geopark & Jiayuguan Fort',
    headlineIt: 'Geoparco di Yardang e Forte di Jiayuguan',
    destinationSlugs: ['yardang', 'jiayuguan-fort'] },
  { date: '2026-07-23', phaseNum: 3, dayInTrip: 10, dayInPhase: 6,
    headline: 'Qicai Danxia rainbow mountains',
    headlineIt: 'Montagne arcobaleno di Qicai Danxia',
    destinationSlugs: ['qicai-danxia', 'shandan-horse-farm'] },
  { date: '2026-07-24', phaseNum: 3, dayInTrip: 11, dayInPhase: 7,
    headline: 'Qilian grasslands, Zhuoer mountain, fly to Chengdu',
    headlineIt: 'Praterie di Qilian, monte Zhuoer, volo a Chengdu',
    destinationSlugs: ['qilian-grassland', 'zhuoer-mountain', 'menyuan-flowers'] },

  // ===== Chengdu (placeholder days; pages don't exist yet) =====
  { date: '2026-07-25', phaseNum: 4, dayInTrip: 12, dayInPhase: 1,
    headline: 'Pandas at the Giant Panda Base',
    headlineIt: 'Panda alla Base dei Panda Giganti',
    destinationSlugs: [], fallbackCoords: [30.733, 104.143] },
  { date: '2026-07-26', phaseNum: 4, dayInTrip: 13, dayInPhase: 2,
    headline: 'Jinli Old Street & Sichuan cuisine',
    headlineIt: 'Antica strada Jinli e cucina del Sichuan',
    destinationSlugs: [], fallbackCoords: [30.642, 104.046] },

  // ===== Yunnan (placeholder days) =====
  { date: '2026-07-27', phaseNum: 5, dayInTrip: 14, dayInPhase: 1,
    headline: 'High-speed train to Kunming',
    headlineIt: 'Treno ad alta velocità per Kunming',
    destinationSlugs: [], fallbackCoords: [25.046, 102.706] },
  { date: '2026-07-28', phaseNum: 5, dayInTrip: 15, dayInPhase: 2,
    headline: 'Stone Forest day trip',
    headlineIt: 'Gita alla Foresta di Pietra',
    destinationSlugs: [], fallbackCoords: [24.816, 103.327] },
  { date: '2026-07-29', phaseNum: 5, dayInTrip: 16, dayInPhase: 3,
    headline: 'Train to Dali',
    headlineIt: 'Treno per Dali',
    destinationSlugs: [], fallbackCoords: [25.611, 100.232] },
  { date: '2026-07-30', phaseNum: 5, dayInTrip: 17, dayInPhase: 4,
    headline: 'Dali old town & Erhai Lake',
    headlineIt: 'Centro storico di Dali e lago Erhai',
    destinationSlugs: [], fallbackCoords: [25.694, 100.181] },
  { date: '2026-07-31', phaseNum: 5, dayInTrip: 18, dayInPhase: 5,
    headline: 'Train to Lijiang',
    headlineIt: 'Treno per Lijiang',
    destinationSlugs: [], fallbackCoords: [26.872, 100.225] },
  { date: '2026-08-01', phaseNum: 5, dayInTrip: 19, dayInPhase: 6,
    headline: 'Lijiang old town',
    headlineIt: 'Centro storico di Lijiang',
    destinationSlugs: [], fallbackCoords: [26.872, 100.225] },
  { date: '2026-08-02', phaseNum: 5, dayInTrip: 20, dayInPhase: 7,
    headline: 'Tiger Leaping Gorge',
    headlineIt: 'Gola del Salto della Tigre',
    destinationSlugs: [], fallbackCoords: [27.196, 100.073] },
  { date: '2026-08-03', phaseNum: 5, dayInTrip: 21, dayInPhase: 8,
    headline: 'Return to Kunming',
    headlineIt: 'Ritorno a Kunming',
    destinationSlugs: [], fallbackCoords: [25.046, 102.706] },
  { date: '2026-08-04', phaseNum: 5, dayInTrip: 22, dayInPhase: 9,
    headline: 'Departure',
    headlineIt: 'Partenza',
    destinationSlugs: [], fallbackCoords: [25.046, 102.706] },
];

/** Helper: get pins (lat/lng) for a given TripDay using locations + fallback */
export function dayPins(day: TripDay): Array<{ lat: number; lng: number; slug: string }> {
  const pins = day.destinationSlugs
    .map((s) => locations[s])
    .filter(Boolean)
    .map((l) => ({ lat: l.lat, lng: l.lng, slug: l.slug }));
  if (pins.length === 0 && day.fallbackCoords) {
    return [{ lat: day.fallbackCoords[0], lng: day.fallbackCoords[1], slug: '' }];
  }
  return pins;
}
```

- [ ] **Step 2: Verify the build still type-checks**

```bash
npm run astro check
```

Expected: 0 errors. (If `astro check` is not installed, `npm run dev` should also reload without errors.)

- [ ] **Step 3: Commit**

```bash
git add src/data/locations.ts
git commit -m "Add tripDays data with EN/IT headlines and dayPins helper"
```

---

## Phase 4 — Homepage redesign (Pattern C)

### Task 12: Rebuild `TripCard.astro` as a journal phase card with inline mini-map

**Files:**
- Modify: `src/components/TripCard.astro` (full rewrite)

The phase card now shows: phase mini-map (top), DayBadge phase number, dates, Fraunces title, Italian highlight line, EN highlights, accommodation, transport. Used on the homepage.

- [ ] **Step 1: Replace `src/components/TripCard.astro`**

```astro
---
import PaperCard from './primitives/PaperCard.astro';
import DayBadge from './primitives/DayBadge.astro';
import MiniMap from './primitives/MiniMap.astro';
import { locations } from '../data/locations';

interface Props {
  num: number;
  title: string;
  titleIt?: string;
  href: string;
  dates: string;
  transport: string;
  highlights: string;
  accommodation: string;
  phase: 'beijing' | 'xian' | 'northwest' | 'chengdu' | 'yunnan';
  /** Slugs to drop pins for; empty array → no map (used when no destination data exists yet) */
  pinSlugs?: string[];
  /** Fallback coords if pinSlugs are empty */
  fallbackCoords?: [number, number];
}

const { num, title, titleIt, href, dates, transport, highlights, accommodation, phase, pinSlugs = [], fallbackCoords } = Astro.props;
const base = import.meta.env.BASE_URL;
const fullHref = href.startsWith('http') ? href : `${base}${href}`;

const pins = pinSlugs
  .map(s => locations[s])
  .filter(Boolean)
  .map(l => ({ lat: l.lat, lng: l.lng }));

if (pins.length === 0 && fallbackCoords) {
  pins.push({ lat: fallbackCoords[0], lng: fallbackCoords[1] });
}

const phaseColor = `var(--color-phase-${phase})`;
const miniId = `mini-phase-${num}`;
---

<a href={fullHref} class="block no-underline text-inherit group">
  <PaperCard padded={false} class="overflow-hidden">
    {pins.length > 0 ? (
      <MiniMap id={miniId} pins={pins.map(p => ({ ...p, color: phaseColor }))} height={110} />
    ) : (
      <div class="h-[110px] bg-paper flex items-center justify-center font-hand text-muted text-sm">phase map · coming soon</div>
    )}

    <div class="relative p-4">
      <DayBadge number={num} bleed size={32} />
      <div class="ml-7">
        <div class="font-mono uppercase tracking-[.14em] text-[10px] text-muted">{dates}</div>
        <h3 class="font-display text-[18px] font-semibold leading-tight mt-0.5 group-hover:text-vermillion-soft transition-colors">{title}</h3>
        {titleIt && <div class="font-display italic text-[13px] text-ink-soft mt-0.5">{titleIt}</div>}
      </div>
      <div class="mt-3 text-[13px] text-ink-soft">{highlights}</div>
      <div class="mt-2 text-[12px] text-muted">{transport}</div>
      <div class="mt-1 text-[12px] text-muted">{accommodation}</div>
    </div>
  </PaperCard>
</a>
```

- [ ] **Step 2: Skip homepage verification for now — TripCard's call sites change in Task 13**

- [ ] **Step 3: Commit**

```bash
git add src/components/TripCard.astro
git commit -m "Rebuild TripCard as journal phase card with inline mini-map"
```

---

### Task 13: Rewrite the homepage (`pages/index.astro`)

**Files:**
- Modify: `src/pages/index.astro` (full rewrite)

- [ ] **Step 1: Replace `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import TripCard from '../components/TripCard.astro';
import InteractiveMap from '../components/InteractiveMap.astro';
import TicketStub from '../components/TicketStub.astro';
import PaperCard from '../components/primitives/PaperCard.astro';
import Tape from '../components/primitives/Tape.astro';
import Stamp from '../components/primitives/Stamp.astro';
import DashedRoute from '../components/primitives/DashedRoute.astro';
import DayBadge from '../components/primitives/DayBadge.astro';
import Marginalia from '../components/primitives/Marginalia.astro';
import { tripPhases, tripDays, dayPins } from '../data/locations';

const base = import.meta.env.BASE_URL;

const mainMarkers = tripPhases.map(p => ({
  name: `${p.name} · ${p.nameCn}`,
  coords: p.coords,
  color: `var(--color-phase-${['', 'beijing','xian','northwest','chengdu','yunnan'][p.num]})`,
  label: p.num,
  phase: p.phase,
  dates: p.dates,
  transport: `${p.num <= 1 ? '✈️' : '🚄'} ${p.transport}`,
  href: p.slug || undefined,
}));

const heroRoutePoints = [
  { x: 6,  y: 70, label: 'Beijing', labelPos: 'below' as const },
  { x: 28, y: 50, label: "Xi'an" },
  { x: 50, y: 30, label: 'Northwest!', labelPos: 'above' as const },
  { x: 76, y: 60, label: 'Chengdu' },
  { x: 95, y: 80, label: 'Yunnan', labelPos: 'below' as const },
];

const transportLegs = [
  { from: 'Beijing', to: "Xi'an", mode: 'T231 night train', modeEmoji: '🚄', duration: '~13h overnight', notes: 'Departs Beijing West 6:26pm · Jul 16' },
  { from: "Xi'an", to: 'Xining', mode: "D2685 from Xi'an North", modeEmoji: '🚄', duration: '~4h', notes: 'Departs 9:00am · arrives 12:49pm · Jul 18' },
  { from: 'Xining', to: 'Chengdu', mode: 'Fly', modeEmoji: '✈️', duration: '~2h', notes: 'Evening flight · Jul 24' },
  { from: 'Chengdu', to: 'Kunming', mode: 'High-speed (if direct G train)', modeEmoji: '🚄', duration: '~4-5h', notes: 'Jul 27 · verify on 12306' },
];

// "Today" detection: server side picks today's day if today is in trip range, otherwise the next upcoming day, otherwise null.
const tripStart = new Date('2026-07-14');
const tripEnd = new Date('2026-08-04');
const today = new Date();
let highlightDay = null as null | (typeof tripDays)[number];
if (today >= tripStart && today <= tripEnd) {
  highlightDay = tripDays.find(d => d.date === today.toISOString().slice(0, 10)) || null;
} else if (today < tripStart) {
  highlightDay = tripDays[0];
}
const highlightPins = highlightDay ? dayPins(highlightDay) : [];

const phaseSlugs: Record<number, string[]> = {
  1: ['panjiayuan','798-art','great-wall','tiananmen','forbidden-city','hutongs'],
  2: ['terracotta-warriors','city-wall','muslim-quarter','tang-mall'],
  3: ['qinghai-lake','chaka-salt-lake','mogao-caves','jiayuguan-fort','qicai-danxia'],
  4: [],
  5: [],
};

const phaseHighlights: Record<number, { en: string; it: string }> = {
  1: { en: 'Great Wall · Forbidden City · Tiananmen · 798 · Hutongs', it: 'Grande Muraglia · Città Proibita · Tiananmen · 798 · Hutong' },
  2: { en: "Terracotta Warriors · City Wall · Muslim Quarter", it: "Esercito di Terracotta · Mura · Quartiere Musulmano" },
  3: { en: 'Qinghai Lake · Dunhuang · Jiayuguan · Danxia · Qilian', it: 'Lago Qinghai · Dunhuang · Jiayuguan · Danxia · Qilian' },
  4: { en: 'Giant Panda Base · Jinli Old Street · Sichuan cuisine', it: 'Base dei Panda Giganti · Antica strada Jinli · cucina del Sichuan' },
  5: { en: 'Kunming · Stone Forest · Dali · Lijiang · Tiger Leaping Gorge', it: 'Kunming · Foresta di Pietra · Dali · Lijiang · Gola del Salto della Tigre' },
};
---
<Base title="Full Trip Overview">

  <!-- HERO -->
  <section class="relative pt-4 pb-2">
    <Tape class="absolute -top-1 left-[28%]" rotate={-3} color="sage" />
    <Tape class="absolute -top-1 right-[18%]" rotate={2} color="gold" />
    <Stamp class="absolute top-2 right-2" rotate={6}>22 days</Stamp>

    <span class="font-hand text-[18px] text-vermillion-soft inline-block -rotate-1">a trip across ~</span>
    <h1 class="font-display italic font-semibold text-[44px] sm:text-[52px] leading-none tracking-tight mt-1">
      China, <span class="font-hand not-italic text-vermillion text-[56px] sm:text-[64px]">2026</span>
    </h1>
    <p class="mt-2 max-w-prose text-ink-soft text-[14px] leading-relaxed">
      <strong class="text-ink">Jul 14 – Aug 4</strong> · 7 of us, one big loop<br />
      <span class="font-mono uppercase text-[10px] tracking-[.06em]">BJ → XI'AN → XINING → NW LOOP → CHENGDU → KUNMING</span>
    </p>

    <div class="mt-6">
      <DashedRoute points={heroRoutePoints} height={70} />
    </div>
  </section>

  <hr class="my-6 dashed-divider" />

  {highlightDay && (
    <section class="mb-6">
      <span class="font-hand text-[18px] text-vermillion-soft inline-block -rotate-1">today ~</span>
      <PaperCard padded={false} class="mt-1 overflow-hidden">
        {highlightPins.length > 0 && (
          <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr]">
            <div class="h-[120px] sm:h-auto">
              <MiniMap id="today-mini" pins={highlightPins.map(p => ({ lat: p.lat, lng: p.lng, color: 'var(--color-vermillion)' }))} height={120} />
            </div>
            <div class="relative p-4">
              <DayBadge number={highlightDay.dayInTrip} bleed />
              <div class="ml-7">
                <div class="font-mono uppercase tracking-[.14em] text-[10px] text-muted">{highlightDay.date} · day {highlightDay.dayInTrip} of 22</div>
                <h3 class="font-display text-[20px] font-semibold leading-tight mt-0.5">{highlightDay.headline}</h3>
                <div class="font-display italic text-[13px] text-ink-soft">{highlightDay.headlineIt}</div>
              </div>
              <Marginalia position="br" rotate={-2}>have a great day!</Marginalia>
            </div>
          </div>
        )}
      </PaperCard>
    </section>
  )}

  <!-- PHASE CARDS -->
  <h2 class="font-display text-2xl font-bold mb-4">Trip at a glance</h2>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {tripPhases.map((p) => {
      const phaseKey = ['', 'beijing','xian','northwest','chengdu','yunnan'][p.num] as 'beijing'|'xian'|'northwest'|'chengdu'|'yunnan';
      const slugs = phaseSlugs[p.num] || [];
      const hl = phaseHighlights[p.num];
      return (
        <TripCard
          num={p.num}
          title={`${p.name} · ${p.nameCn}`}
          href={p.slug ?? '#'}
          dates={p.dates}
          transport={`${p.num <= 1 ? '✈️' : '🚄'} ${p.transport}`}
          highlights={hl.en}
          titleIt={hl.it}
          accommodation=""
          phase={phaseKey}
          pinSlugs={slugs}
          fallbackCoords={p.coords}
        />
      );
    })}
  </div>

  <hr class="my-8 dashed-divider" />

  <!-- ROUTE MAP -->
  <h2 class="font-display text-2xl font-bold mb-4">Full route</h2>
  <PaperCard padded={false} class="overflow-hidden">
    <InteractiveMap markers={mainMarkers} center={[33, 108]} zoom={5} height="460px" />
  </PaperCard>
  <p class="text-sm text-muted mt-2 font-hand text-[15px]">click any marker for dates, transport, and the day plan ~</p>

  <hr class="my-8 dashed-divider" />

  <!-- TRANSPORT -->
  <h2 class="font-display text-2xl font-bold mb-4">Transport connections</h2>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {transportLegs.map(l => <TicketStub leg={l} />)}
  </div>
  <p class="mt-3 font-hand text-vermillion-soft text-[16px] -rotate-1 inline-block">book early! July is peak ~</p>

  <hr class="my-8 dashed-divider" />

  <!-- RESOURCES -->
  <h2 class="font-display text-2xl font-bold mb-4">Resources</h2>
  <ul class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[15px]">
    <li><a href={`${base}resources/tips`} class="text-vermillion-soft hover:underline">💡 Travel tips</a></li>
    <li><a href={`${base}resources/packing-list`} class="text-vermillion-soft hover:underline">🎒 Packing list</a></li>
    <li><a href={`${base}resources/useful-phrases`} class="text-vermillion-soft hover:underline">🗣 Useful phrases (EN · 中文 · IT)</a></li>
    <li><a href={`${base}map`} class="text-vermillion-soft hover:underline">🗺 Interactive route map</a></li>
  </ul>
</Base>
```

- [ ] **Step 2: Verify in dev**

Refresh `http://localhost:4321/RoadMapForChina-site/`. Expected: paper hero with tape, "22 days" stamp, dashed route with handwritten labels, "today ~" card showing the next upcoming trip day, 5 phase cards with sepia-tinted mini-maps. The full-route InteractiveMap below still shows pins and routes (it'll be restyled in Task 23).

The page **will reference `TicketStub` which doesn't exist yet** — that's intentional, the next task creates it. If the dev server errors here, leave the import line commented and uncomment after Task 14.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "Rebuild homepage with hero route, today card, phase cards"
```

---

### Task 14: Create `TicketStub.astro` for transport legs

**Files:**
- Create: `src/components/TicketStub.astro`

- [ ] **Step 1: Write the component**

```astro
---
interface Leg {
  from: string;
  to: string;
  mode: string;
  modeEmoji: string;
  duration: string;
  notes: string;
}
interface Props { leg: Leg }
const { leg } = Astro.props;
---
<div class="relative bg-paper-card border border-border paper-card-shadow flex">
  <!-- Perforated edge -->
  <div class="w-3 border-r border-dashed border-border-dash"
       style="background-image:radial-gradient(circle,#f5ecd7 2px,transparent 2.5px);background-size:8px 8px;background-position:center;"></div>
  <div class="flex-1 p-3">
    <div class="flex items-center gap-2 font-mono uppercase text-[10px] tracking-[.16em] text-muted">
      <span>{leg.modeEmoji}</span><span>{leg.mode}</span>
    </div>
    <div class="font-display text-[18px] font-semibold leading-tight mt-1">
      {leg.from} <span class="text-vermillion-soft">→</span> {leg.to}
    </div>
    <div class="font-mono text-[11px] text-muted mt-1">{leg.duration}</div>
    <div class="text-[12px] text-ink-soft mt-1">{leg.notes}</div>
  </div>
</div>
```

- [ ] **Step 2: Verify on the homepage**

If you commented out the import in Task 13, uncomment it. Refresh the homepage — expected: 4 ticket-stub cards with perforated left edge, mono mode label, Fraunces from-to with vermillion arrow.

- [ ] **Step 3: Commit**

```bash
git add src/components/TicketStub.astro
git commit -m "Add TicketStub for transport legs"
```

---

## Phase 5 — Phase pages (Pattern A: collapsible split)

### Task 15: Create `SplitView.astro` shell

**Files:**
- Create: `src/components/SplitView.astro`

This is the responsive map+list shell that phase pages will use. Map and list are siblings; toolbar between them controls visibility; state persists per-phase in `localStorage`.

- [ ] **Step 1: Write the component**

```astro
---
interface Props {
  /** Used as the localStorage key suffix */
  phaseKey: string;
}
const { phaseKey } = Astro.props;
const stateKey = `splitview:${phaseKey}`;
---
<div
  class="split-view grid lg:grid-cols-[45%_1fr] gap-0 lg:gap-4"
  data-state-key={stateKey}
>
  <div class="split-map relative lg:sticky lg:top-16 lg:self-start lg:max-h-[calc(100vh-5rem)] h-[50vh] lg:h-[calc(100vh-5rem)]">
    <div class="absolute inset-0">
      <slot name="map" />
    </div>
  </div>

  <div class="split-toolbar lg:hidden flex items-center justify-between text-[11px] uppercase tracking-[.14em] font-mono text-muted py-2 px-1 dashed-divider border-t-0">
    <span class="font-hand text-[15px] text-ink normal-case tracking-normal">days ~</span>
    <div class="flex gap-2">
      <button type="button" class="hide-map px-2 py-1 border border-border rounded-none hover:bg-paper-card transition-colors">[hide map]</button>
      <button type="button" class="hide-list px-2 py-1 border border-border rounded-none hover:bg-paper-card transition-colors">[hide list]</button>
    </div>
  </div>

  <div class="split-list">
    <slot name="list" />
  </div>
</div>

<style>
  .split-view.map-hidden .split-map,
  .split-view.list-hidden .split-list { display: none; }

  .split-view.list-hidden .split-map { height: calc(100vh - 5rem); }

  .split-view.map-hidden .split-toolbar .hide-map { display: none; }
  .split-view.list-hidden .split-toolbar .hide-list { display: none; }

  .split-view.map-hidden .split-toolbar::before {
    content: 'show map';
    font-family: var(--font-hand);
    text-transform: none;
    letter-spacing: normal;
    font-size: 15px;
    color: var(--color-vermillion-soft);
    cursor: pointer;
  }
</style>

<script is:inline define:vars={{ stateKey }}>
  (function() {
    const view = document.querySelector(`[data-state-key="${stateKey}"]`);
    if (!view) return;
    const saved = localStorage.getItem(stateKey);
    if (saved === 'map-hidden') view.classList.add('map-hidden');
    if (saved === 'list-hidden') view.classList.add('list-hidden');

    function setState(s) {
      view.classList.remove('map-hidden', 'list-hidden');
      if (s) view.classList.add(s);
      if (s) localStorage.setItem(stateKey, s); else localStorage.removeItem(stateKey);
      // Tell any embedded Leaflet maps to re-measure
      window.dispatchEvent(new Event('resize'));
    }

    view.querySelector('.hide-map')?.addEventListener('click', () => setState('map-hidden'));
    view.querySelector('.hide-list')?.addEventListener('click', () => setState('list-hidden'));

    // Tap on the "show map" pseudo-element area when hidden
    view.querySelector('.split-toolbar')?.addEventListener('click', (e) => {
      if (view.classList.contains('map-hidden') && e.target.classList.contains('split-toolbar')) {
        setState(null);
      }
    });
  })();
</script>
```

- [ ] **Step 2: Skip standalone verification — exercised in the next task**

- [ ] **Step 3: Commit**

```bash
git add src/components/SplitView.astro
git commit -m "Add SplitView responsive collapsible shell"
```

---

### Task 16: Rebuild `DayCard.astro` around `DayBadge`

**Files:**
- Modify: `src/components/DayCard.astro` (full rewrite)

The new DayCard supports: number badge, date, English headline, Italian headline, route summary (mode emoji + one-line), highlights as a list, accommodation, optional marginalia note, optional `data-day-anchor` for the SplitView coordination.

- [ ] **Step 1: Replace `src/components/DayCard.astro`**

```astro
---
import PaperCard from './primitives/PaperCard.astro';
import DayBadge from './primitives/DayBadge.astro';
import Marginalia from './primitives/Marginalia.astro';

interface Props {
  day: number;
  dayInPhase?: number;
  date: string;
  headline: string;
  headlineIt?: string;
  route?: string;
  highlights: Array<{ name: string; href?: string }>;
  accommodation?: string;
  note?: string;
  /** Used by SplitView to scroll/highlight this card when its pin is tapped */
  anchorId?: string;
}
const { day, dayInPhase, date, headline, headlineIt, route, highlights, accommodation, note, anchorId } = Astro.props;
const base = import.meta.env.BASE_URL;
---
<PaperCard class="mb-4 day-card" {...(anchorId ? { id: anchorId } : {})}>
  <DayBadge number={dayInPhase ?? day} bleed />
  <div class="ml-7">
    <div class="font-mono uppercase tracking-[.14em] text-[10px] text-muted">
      {date} · day {day}{dayInPhase ? ` · phase day ${dayInPhase}` : ''}
    </div>
    <h3 class="font-display text-[18px] font-semibold leading-tight mt-0.5">{headline}</h3>
    {headlineIt && <div class="font-display italic text-[13px] text-ink-soft">{headlineIt}</div>}
    {route && <div class="font-hand text-[15px] text-vermillion-soft mt-2 -rotate-[.5deg] inline-block">{route}</div>}

    <ul class="mt-2 text-[13px] leading-relaxed space-y-1">
      {highlights.map(h => (
        <li>
          {h.href
            ? <a href={`${base}${h.href}`} class="text-ink hover:text-vermillion-soft no-underline">{h.name}</a>
            : <span>{h.name}</span>}
        </li>
      ))}
    </ul>

    {accommodation && <div class="mt-2 font-mono text-[10px] uppercase tracking-[.14em] text-muted">🛏 {accommodation}</div>}
  </div>
  {note && <Marginalia position="br" rotate={-2}>{note}</Marginalia>}
</PaperCard>
```

- [ ] **Step 2: Verify**

DayCard isn't used anywhere right now (Beijing/Xi'an/Northwest pages have inline day markup). Verification happens in Task 17 when we wire it up.

- [ ] **Step 3: Commit**

```bash
git add src/components/DayCard.astro
git commit -m "Rebuild DayCard around DayBadge with Italian headline"
```

---

### Task 17: Rebuild `pages/trips/beijing.astro` as a SplitView consumer

**Files:**
- Modify: `src/pages/trips/beijing.astro` (full rewrite of the rendered structure; preserve existing prose content blocks for Day 1/2/3 as-is, just hosted inside DayCard children where reasonable)

This task is the largest in the plan. Beijing's existing page has rich prose for each day. We keep that prose, but lift the day-overview cards (lines 56-114 in the original) into DayCards inside the SplitView's right pane, with the InteractiveMap in the left pane.

- [ ] **Step 1: Replace `src/pages/trips/beijing.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import InteractiveMap from '../../components/InteractiveMap.astro';
import SplitView from '../../components/SplitView.astro';
import DayCard from '../../components/DayCard.astro';
import PaperCard from '../../components/primitives/PaperCard.astro';
import Stamp from '../../components/primitives/Stamp.astro';
import Marginalia from '../../components/primitives/Marginalia.astro';
import { tripDays } from '../../data/locations';

const base = import.meta.env.BASE_URL;
const phaseDays = tripDays.filter(d => d.phaseNum === 1);

const mapMarkers = [
  { name: 'Home Base · Jiangtai Lu', coords: [39.97, 116.48] as [number, number], color: 'var(--color-phase-beijing)', label: '🏠', phase: 'Base' },
  { name: 'Panjiayuan · 潘家园', coords: [39.876, 116.461] as [number, number], color: 'var(--color-vermillion-soft)', label: '1', phase: 'Day 1', href: 'beijing/panjiayuan' },
  { name: '798 Art District · 大山子艺术区', coords: [39.984, 116.497] as [number, number], color: 'var(--color-vermillion-soft)', label: '1', phase: 'Day 1', href: 'beijing/798-art-district' },
  { name: 'Mutianyu Great Wall · 慕田峪长城', coords: [40.433, 116.567] as [number, number], color: 'var(--color-vermillion)', label: '2', phase: 'Day 2', href: 'beijing/mutianyu' },
  { name: 'Olympic Park · 奥林匹克公园', coords: [40.002, 116.392] as [number, number], color: 'var(--color-vermillion)', label: '2', phase: 'Day 2' },
  { name: 'Tiananmen · 天安门广场', coords: [39.905, 116.391] as [number, number], color: 'var(--color-phase-yunnan)', label: '3', phase: 'Day 3', href: 'beijing/tiananmen' },
  { name: 'Forbidden City · 故宫博物院', coords: [39.916, 116.390] as [number, number], color: 'var(--color-phase-yunnan)', label: '3', phase: 'Day 3', href: 'beijing/forbidden-city' },
  { name: 'Nanluoguxiang · 南锣鼓巷', coords: [39.937, 116.399] as [number, number], color: 'var(--color-phase-yunnan)', label: '3', phase: 'Day 3', href: 'beijing/nanluoguxiang' },
];
---

<Base title="Beijing · 北京 · July 14–16">

  <header class="mb-4">
    <a href={base} class="text-sm text-muted hover:text-vermillion-soft">← Full trip overview</a>
    <h1 class="font-display italic font-semibold text-[36px] leading-none mt-2">
      Beijing <span class="font-zh not-italic text-[28px] text-ink-soft">北京</span>
    </h1>
    <div class="font-mono uppercase text-[11px] tracking-[.14em] text-muted mt-1">PHASE 1 · JUL 14 – JUL 16 · 6 PEOPLE</div>
    <p class="mt-3 max-w-prose text-[14px] text-ink-soft">
      Base near 丽都饭店, Jiangtai Lu, Chaoyang. Rental car driven by the Chinese friend (foreign licenses not valid). Drop the car at Beijing West for the night train.
    </p>
  </header>

  <SplitView phaseKey="beijing">
    <div slot="map" class="h-full">
      <InteractiveMap id="beijing-map" markers={mapMarkers} center={[39.95, 116.42]} zoom={10} height="100%" />
    </div>

    <div slot="list">
      {phaseDays.map(d => (
        <DayCard
          day={d.dayInTrip}
          dayInPhase={d.dayInPhase}
          date={d.date}
          headline={d.headline}
          headlineIt={d.headlineIt}
          route={d.dayInPhase === 1 ? '✈️ arrive Daxing 12:10 · afternoon only'
              : d.dayInPhase === 2 ? '🚗 ~150km round trip'
              : '🚄 T231 night train at 18:26'}
          highlights={d.destinationSlugs.map(s => ({ name: s.replace(/-/g, ' '), href: s.startsWith('beijing') ? s : `beijing/${s}` }))}
          accommodation={d.dayInPhase < 3 ? 'Jiangtai Lu' : 'on T231'}
          note={d.dayInPhase === 2 ? 'arrive by 9am to beat the buses!' : undefined}
          anchorId={`day-${d.dayInTrip}`}
        />
      ))}

      <PaperCard class="mt-6 bg-paper">
        <Stamp rotate={-3}>book now</Stamp>
        <ul class="list-disc pl-5 mt-3 text-[13px] space-y-1">
          <li><strong>Forbidden City</strong> — 40,000/day cap; sells out weeks ahead → <a href="https://gugong.dpm.org.cn" target="_blank" class="text-vermillion-soft underline">gugong.dpm.org.cn</a></li>
          <li><strong>T231 Beijing West → Xi'an</strong> — 6 people, 2 soft-sleeper compartments → <a href="https://www.12306.cn" target="_blank" class="text-vermillion-soft underline">12306.cn</a></li>
          <li><strong>Rental car</strong> — 6–7 seat MPV at Daxing</li>
        </ul>
        <Marginalia position="br" rotate={-2}>do this first!!</Marginalia>
      </PaperCard>
    </div>
  </SplitView>

  <hr class="my-8 dashed-divider" />

  <h2 class="font-display text-2xl font-bold mb-4">Day-by-day detail</h2>

  <article class="prose">
    <h3 id="day-1-detail">Day 1 · July 14 · Arrival afternoon</h3>
    <p class="italic text-muted">Arrive Daxing 12:10 · ~4 usable hours · 30–36°C</p>
    <ul>
      <li><strong>12:10</strong> Land at Daxing International (PKX)</li>
      <li><strong>~14:00</strong> Customs, luggage, pick up rental car</li>
      <li><strong>~14:30–15:30</strong> <a href={`${base}beijing/panjiayuan`}>Panjiayuan Antique Market</a> — Beijing's biggest flea market. Buy something small and eccentric.</li>
      <li><strong>~16:00</strong> Drop bags at Jiangtai Lu</li>
      <li><strong>16:30–18:00</strong> <a href={`${base}beijing/798-art-district`}>798 Art District</a> — easy jet-lag walk through galleries and Bauhaus warehouses.</li>
      <li><strong>19:30</strong> Peking duck at <strong>Da Dong (大董)</strong>, Gongti Beilu branch.</li>
    </ul>

    <h3 id="day-2-detail">Day 2 · July 15 · Great Wall</h3>
    <p class="italic text-muted">Full day · ~75km each way · 30–36°C</p>
    <ul>
      <li><strong>07:30</strong> Depart Jiangtai Lu → <a href={`${base}beijing/mutianyu`}>Mutianyu Great Wall</a> (~1.5h)</li>
      <li><strong>09:00</strong> Buy cable car tickets at the booth (¥35 up, ¥25 down, ¥55 combo with toboggan)</li>
      <li><strong>09:15–12:30</strong> Walk the restored 3.5km section. Take the toboggan down — fastest 10 minutes of the trip.</li>
      <li><strong>13:00</strong> Lunch at <strong>Brickyard Restaurant</strong> — international-friendly, garden setting.</li>
      <li><strong>15:00</strong> Drive south, stop at <strong>Olympic Park</strong>: Bird's Nest + Water Cube from the plaza, 30min photo stop.</li>
      <li><strong>19:30</strong> Hotpot at <strong>Haidilao (海底捞)</strong>, Sanlitun branch.</li>
    </ul>

    <h3 id="day-3-detail">Day 3 · July 16 · Imperial Beijing & night train</h3>
    <p class="italic text-muted">Morning + afternoon · T231 departs 18:26 · 30–36°C</p>
    <ul>
      <li><strong>08:00</strong> Drive to Tiananmen — park at Jingshan Park lot.</li>
      <li><strong>08:30–10:00</strong> <a href={`${base}beijing/tiananmen`}>Tiananmen Square</a> before heat and crowd peak.</li>
      <li><strong>10:00–13:00</strong> <a href={`${base}beijing/forbidden-city`}>Forbidden City</a> — pre-booked tickets only. South–north axis + one side courtyard. Cloakroom at south gate (¥10).</li>
      <li><strong>13:30</strong> Lunch on Wangfujing pedestrian street.</li>
      <li><strong>15:00–16:00</strong> <a href={`${base}beijing/nanluoguxiang`}>Nanluoguxiang hutongs</a> — courtyard homes, ice cream, optional rickshaw.</li>
      <li><strong>16:30</strong> Drop rental car near Beijing West (北京西站).</li>
      <li><strong>18:26</strong> Board T231 night train · 2 soft-sleeper compartments.</li>
      <li class="italic text-muted">Arrives Xi'an Station ~07:35 July 17.</li>
    </ul>
  </article>

  <hr class="my-8 dashed-divider" />

  <p class="text-sm space-x-2">
    <a href={base} class="text-vermillion-soft hover:underline">← Full trip overview</a>
    <span class="text-muted">·</span>
    <a href={`${base}trips/xian`} class="text-vermillion-soft hover:underline">Phase 2 · Xi'an →</a>
  </p>
</Base>
```

- [ ] **Step 2: Verify in dev**

Visit `http://localhost:4321/RoadMapForChina-site/trips/beijing`. Expected:
- On mobile width (devtools, 375×667): map fills the top 50vh, day list scrolls below; toolbar shows `[hide map]` `[hide list]` buttons; tapping `[hide map]` collapses the map and shows a "show map" handwritten link; refresh persists the state.
- On desktop width (1280px): sticky map on the left ~45%, day list scrolls on the right.
- DayCards show vermillion DayBadge bleeding into margin, mono date strip, EN+IT headlines.
- Marginalia "arrive by 9am to beat the buses!" appears on Day 2.

- [ ] **Step 3: Commit**

```bash
git add src/pages/trips/beijing.astro
git commit -m "Rebuild Beijing phase page with SplitView and DayCards"
```

---

### Task 18: SplitView coordination — tapping a day pans the map; tapping a pin scrolls the list

**Files:**
- Modify: `src/components/SplitView.astro` (extend the inline script)
- Modify: `src/components/InteractiveMap.astro` (expose marker objects via a window registry keyed by id)

The map and the list are currently two siblings. We need a thin coordination layer: clicking a DayCard pans/zooms the InteractiveMap to that day's bounds; clicking a marker scrolls the corresponding `#day-N` anchor into view and highlights it.

- [ ] **Step 1: Augment `InteractiveMap.astro` to expose its map instance and markers**

After the existing `setTimeout(function() { map.invalidateSize(); }, 100);` line (around line 128), and **before** the closing `}` of `initMap`, add:

```js
    // Expose for SplitView coordination
    window.__maps = window.__maps || {};
    window.__maps[id] = { map: map, markers: {} };
    markers.forEach(function(m, i) {
      // Track marker by phase/dates string (cheap unique-ish key) — SplitView matches by data-day attribute
    });
```

Then, replace the line `L.marker(m.coords, { icon: icon }).addTo(map).bindPopup(popup, { maxWidth: 260 });` with:

```js
      var ml = L.marker(m.coords, { icon: icon }).addTo(map).bindPopup(popup, { maxWidth: 260 });
      var dayKey = (m.phase || '').match(/Day (\d+)/);
      if (dayKey) {
        window.__maps[id].markers['day-' + dayKey[1]] = ml;
        ml.on('click', function() {
          var anchor = document.getElementById('day-' + dayKey[1]);
          if (anchor) {
            anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
            anchor.classList.add('day-card-flash');
            setTimeout(function(){ anchor.classList.remove('day-card-flash'); }, 1200);
          }
        });
      }
```

- [ ] **Step 2: Add the day-card-flash style to `journal.css`**

Append to `src/styles/journal.css`:

```css
.day-card-flash { box-shadow: 0 0 0 3px var(--color-vermillion); transition: box-shadow .25s; }
```

- [ ] **Step 3: Wire DayCard taps in `SplitView.astro`'s script**

Replace the existing `<script is:inline ...>` block in `SplitView.astro` with:

```astro
<script is:inline define:vars={{ stateKey }}>
  (function() {
    const view = document.querySelector(`[data-state-key="${stateKey}"]`);
    if (!view) return;
    const saved = localStorage.getItem(stateKey);
    if (saved === 'map-hidden') view.classList.add('map-hidden');
    if (saved === 'list-hidden') view.classList.add('list-hidden');

    function setState(s) {
      view.classList.remove('map-hidden', 'list-hidden');
      if (s) view.classList.add(s);
      if (s) localStorage.setItem(stateKey, s); else localStorage.removeItem(stateKey);
      window.dispatchEvent(new Event('resize'));
    }

    view.querySelector('.hide-map')?.addEventListener('click', () => setState('map-hidden'));
    view.querySelector('.hide-list')?.addEventListener('click', () => setState('list-hidden'));

    view.querySelector('.split-toolbar')?.addEventListener('click', (e) => {
      if (view.classList.contains('map-hidden') && e.target.classList.contains('split-toolbar')) {
        setState(null);
      }
    });

    // Day-card → map coordination
    view.querySelectorAll('.day-card[id^="day-"]').forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        // Don't hijack clicks on links inside the card
        if (e.target.closest('a, button')) return;
        const dayId = card.id;
        const maps = window.__maps || {};
        Object.keys(maps).forEach(mapId => {
          const m = maps[mapId];
          const marker = m.markers[dayId];
          if (marker && m.map) {
            m.map.panTo(marker.getLatLng(), { animate: true });
            marker.openPopup();
          }
        });
      });
    });
  })();
</script>
```

- [ ] **Step 4: Verify**

Reload `/trips/beijing`. Expected:
- Click a Day-2 card → map pans to the Mutianyu marker, popup opens.
- Click the Mutianyu pin → page scrolls to the Day 2 card and the card briefly flashes a vermillion outline.
- Clicking links inside a card (e.g. "great wall") still navigates without panning the map.

- [ ] **Step 5: Commit**

```bash
git add src/components/SplitView.astro src/components/InteractiveMap.astro src/styles/journal.css
git commit -m "Coordinate SplitView day cards with InteractiveMap markers"
```

---

### Task 19: Rebuild `pages/trips/xian.astro` as a SplitView consumer

**Files:**
- Modify: `src/pages/trips/xian.astro` (full rewrite, same shape as Beijing)

- [ ] **Step 1: Read the existing Xi'an page to capture its prose content**

```bash
cat src/pages/trips/xian.astro
```

- [ ] **Step 2: Rewrite `src/pages/trips/xian.astro`** mirroring the Beijing structure (header → SplitView with map slot + DayCard list slot → prose detail section). Use `tripDays.filter(d => d.phaseNum === 2)` for day data. Map markers come from the existing `mapMarkers` array in the file (preserve coords; replace colors with `var(--color-phase-xian)` for main and `var(--color-muted)` for optional). Day-by-day prose sections preserved verbatim, just placed inside a `<article class="prose">` block under a "Day-by-day detail" heading.

- [ ] **Step 3: Verify**

Visit `/trips/xian`. Expected: same SplitView behaviour as Beijing; phase badge colour is rust/xian; DayCard list shows Xi'an's single full day with destination links.

- [ ] **Step 4: Commit**

```bash
git add src/pages/trips/xian.astro
git commit -m "Rebuild Xi'an phase page with SplitView and DayCards"
```

---

### Task 20: Rebuild `pages/trips/northwest.astro` as a SplitView consumer

**Files:**
- Modify: `src/pages/trips/northwest.astro` (full rewrite — mirror the Beijing pattern)

- [ ] **Step 1: Read the existing Northwest page**

```bash
cat src/pages/trips/northwest.astro
```

- [ ] **Step 2: Rewrite the Northwest page** following the Beijing template. Filter `tripDays.filter(d => d.phaseNum === 3)` for the 7 day cards. Map markers carry colour `var(--color-phase-northwest)`. Preserve the full day-by-day prose under "Day-by-day detail".

- [ ] **Step 3: Verify**

Visit `/trips/northwest`. Expected: 7 DayCards in the list, each with EN+IT headlines, the map shows pins across Qinghai/Gansu, marker↔card coordination works.

- [ ] **Step 4: Commit**

```bash
git add src/pages/trips/northwest.astro
git commit -m "Rebuild Northwest phase page with SplitView and DayCards"
```

---

## Phase 6 — InteractiveMap restyle

### Task 21: Restyle InteractiveMap markers and popups

**Files:**
- Modify: `src/components/InteractiveMap.astro` (only the `divIcon` HTML and the popup string)

- [ ] **Step 1: In `InteractiveMap.astro`, replace the two `divIcon` HTML strings**

Find:

```js
      if (m.optional) {
        icon = L.divIcon({
          html: '<div style="background:' + m.color + '; color:white; width:22px; height:22px; transform:rotate(45deg); display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 2px 6px rgba(0,0,0,0.3); cursor:pointer;"></div>',
```

Replace with:

```js
      if (m.optional) {
        icon = L.divIcon({
          html: '<div style="background:' + m.color + '; width:14px; height:14px; transform:rotate(45deg); border:2px solid #fffbef; box-shadow:0 1px 3px rgba(0,0,0,0.25); cursor:pointer;"></div>',
```

And find:

```js
      } else {
        icon = L.divIcon({
          html: '<div style="background:' + m.color + '; color:white; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:bold; border:2px solid white; box-shadow:0 2px 8px rgba(0,0,0,0.4); cursor:pointer;">' + m.label + '</div>',
```

Replace with:

```js
      } else {
        icon = L.divIcon({
          html: '<div style="background:' + m.color + '; color:#fffbef; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:Caveat,cursive; font-size:18px; font-weight:700; border:2px solid #fffbef; box-shadow:1px 2px 0 rgba(43,33,24,0.25); cursor:pointer; transform:rotate(-4deg);">' + m.label + '</div>',
```

- [ ] **Step 2: Restyle popup HTML**

Find the `var popup =` block (around line 115) and replace the entire popup string with:

```js
      var popup =
        '<div style="font-family:Inter,system-ui,sans-serif; min-width:180px; color:#2a2118;">' +
        '<div style="font-family:Fraunces,Georgia,serif; font-weight:600; font-size:15px; margin-bottom:2px;">' + m.name + '</div>' +
        (m.phase ? '<div style="font-family:JetBrains Mono,monospace; font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:#8a7050; margin-bottom:2px;">' + m.phase + (m.dates ? ' · ' + m.dates : '') + '</div>' : '') +
        (m.transport ? '<div style="color:#5a4830; font-size:12px; margin-bottom:4px;">' + m.transport + '</div>' : '') +
        optionalBadge +
        planLink +
        mapLinks +
        '</div>';
```

- [ ] **Step 3: Restyle the legend container** by replacing lines 39–52 of `InteractiveMap.astro` with:

```astro
  {legend && (
    <div class="absolute bottom-3 left-3 z-[1000] bg-paper-card border border-border paper-card-shadow px-3 py-2 text-[11px] leading-loose">
      {legend.map((l) => (
        <div class="flex items-center gap-1.5">
          {l.diamond ? (
            <span class="inline-block w-2.5 h-2.5 rotate-45" style={`background:${l.color}`}></span>
          ) : (
            <span class="inline-block w-2.5 h-2.5 rounded-full" style={`background:${l.color}`}></span>
          )}
          <span class="text-ink-soft">{l.label}</span>
        </div>
      ))}
    </div>
  )}
```

- [ ] **Step 4: Add tile sepia filter** by adding to the existing `<style>` block at the bottom of `InteractiveMap.astro` (or appending one if absent):

```html
<style>
  :global(.leaflet-tile-pane) {
    filter: sepia(.35) saturate(.85) hue-rotate(-12deg) brightness(.97);
  }
  :global(.leaflet-popup-content-wrapper) {
    background: var(--color-paper-card) !important;
    color: var(--color-ink) !important;
    border-radius: 0 !important;
    border: 1px solid var(--color-border) !important;
    box-shadow: 2px 3px 0 rgba(43,33,24,.15) !important;
  }
  :global(.leaflet-popup-tip) { background: var(--color-paper-card) !important; }
</style>
```

- [ ] **Step 5: Verify**

Refresh the homepage and any phase page. Expected:
- Map tiles look sepia/warm.
- Numbered markers are vermillion circles with handwritten Caveat numbers, slight rotation.
- Optional markers are vermillion-soft diamonds with cream borders.
- Popups are paper cards with offset shadow, Fraunces title, mono uppercase phase line.
- Legend is a paper-coloured chip.

- [ ] **Step 6: Commit**

```bash
git add src/components/InteractiveMap.astro
git commit -m "Restyle InteractiveMap markers, popups, legend, tile filter"
```

---

## Phase 7 — Destination layout + media

### Task 22: Restyle `Destination.astro` layout

**Files:**
- Modify: `src/layouts/Destination.astro` (restyle the header)

- [ ] **Step 1: Replace `src/layouts/Destination.astro`**

```astro
---
import Base from './Base.astro';
import MapDropdown from '../components/MapDropdown.astro';
import VideoGrid from '../components/VideoGrid.astro';
import GoogleImagePreview from '../components/GoogleImagePreview.astro';
import MiniMap from '../components/primitives/MiniMap.astro';
import Coords from '../components/primitives/Coords.astro';
import Stamp from '../components/primitives/Stamp.astro';
import Tape from '../components/primitives/Tape.astro';

interface Video { id: string; title: string; caption?: string; }
interface Props {
  title: string;
  titleCn: string;
  lat: number;
  lng: number;
  imageQuery?: string;
  images?: Array<{ src: string; alt: string }>;
  videos?: Video[];
  backLink: { href: string; label: string };
  /** "must-do" | "optional" | "if time" — surfaces as a stamp */
  badge?: string;
}

const { title, titleCn, lat, lng, imageQuery, images = [], videos = [], backLink, badge } = Astro.props;
const base = import.meta.env.BASE_URL;
const miniId = `mini-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
---

<Base title={`${title} · ${titleCn}`}>
  <div class="mb-4">
    <a href={`${base}${backLink.href}`} class="text-sm text-muted hover:text-vermillion-soft transition-colors">
      ← {backLink.label}
    </a>
  </div>

  <header class="relative grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-4 mb-6">
    <div class="relative">
      {badge && <Stamp class="mb-2" rotate={-3}>{badge}</Stamp>}
      <h1 class="font-display italic font-semibold text-[34px] leading-none">
        {title}
      </h1>
      <div class="font-zh text-[22px] text-ink-soft mt-1">{titleCn}</div>
      <div class="mt-2"><Coords lat={lat} lng={lng} /></div>
      <div class="mt-2"><MapDropdown lat={lat} lng={lng} name={title} nameCn={titleCn} imageQuery={imageQuery} /></div>
    </div>
    <div class="relative">
      <Tape class="absolute -top-1 left-2 z-10" rotate={-4} color="gold" />
      <MiniMap id={miniId} pins={[{ lat, lng, color: 'var(--color-vermillion)' }]} center={[lat, lng]} zoom={12} height={160} />
    </div>
  </header>

  {imageQuery && (
    <GoogleImagePreview query={imageQuery} title={`${title} ${titleCn}`} images={images} />
  )}

  {videos.length > 0 && (
    <>
      <h2 class="font-display text-2xl font-bold mt-8 mb-4">Videos</h2>
      <VideoGrid videos={videos} />
    </>
  )}

  <div class="prose mt-8">
    <slot />
  </div>
</Base>
```

- [ ] **Step 2: Verify**

Visit `/beijing/forbidden-city`. Expected: stamp (if `badge` was set, otherwise omitted), Fraunces italic title, Songti Chinese subtitle, Coords line, mini-map in the top-right with gold tape.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Destination.astro
git commit -m "Restyle Destination layout with stamp, mini-map, coords"
```

---

### Task 23: Polaroid framing for `ImageGallery` and `GoogleImagePreview`

**Files:**
- Modify: `src/components/ImageGallery.astro`
- Modify: `src/components/GoogleImagePreview.astro` (only the local-images grid section)

- [ ] **Step 1: Replace `src/components/ImageGallery.astro`**

```astro
---
interface Props {
  images: Array<{ src: string; alt: string }>;
}
const { images } = Astro.props;
const base = import.meta.env.BASE_URL;
const rotates = [-1.5, 0.8, -0.6, 1.2, -0.4, 0.9];
---
{images.length === 1 ? (
  <figure class="my-4 inline-block bg-paper-card p-2 paper-card-shadow border border-border max-w-full">
    <img src={`${base}${images[0].src}`} alt={images[0].alt} class="w-full block" loading="lazy" />
    {images[0].alt && <figcaption class="font-hand text-[15px] text-ink-soft mt-1 px-1">{images[0].alt}</figcaption>}
  </figure>
) : (
  <div class={`grid gap-3 my-4 ${images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
    {images.map((img, i) => (
      <figure class="bg-paper-card p-2 paper-card-shadow border border-border" style={`transform:rotate(${rotates[i % rotates.length]}deg)`}>
        <img src={`${base}${img.src}`} alt={img.alt} class="w-full h-44 object-cover block" loading="lazy" />
        {img.alt && <figcaption class="font-hand text-[14px] text-ink-soft mt-1 px-1 truncate">{img.alt}</figcaption>}
      </figure>
    ))}
  </div>
)}
```

- [ ] **Step 2: In `GoogleImagePreview.astro`, replace the local-photos grid (lines 29–40)** with:

```astro
  {images.length > 0 && (
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
      {images.map((img, i) => (
        <figure class="bg-paper-card p-2 paper-card-shadow border border-border" style={`transform:rotate(${[-1.5, 0.8, -0.6, 1.2, -0.4, 0.9][i % 6]}deg)`}>
          <img src={`${base}${img.src}`} alt={img.alt} class="w-full h-44 object-cover block cursor-zoom-in photo-thumb" loading="lazy" />
        </figure>
      ))}
    </div>
  )}
```

(Leave the Wikimedia Commons grid below it alone — those are external images and can stay rectangular for now.)

- [ ] **Step 3: Verify**

Visit a destination page with `images=` props (e.g. `/beijing/forbidden-city` if it has any, or `/northwest/mogao-caves`). Expected: each image sits in a cream paper frame with a tiny rotation, slight offset shadow, handwritten caption.

- [ ] **Step 4: Commit**

```bash
git add src/components/ImageGallery.astro src/components/GoogleImagePreview.astro
git commit -m "Add polaroid framing to image components"
```

---

### Task 24: Polaroid + tape frames on `VideoGrid`

**Files:**
- Modify: `src/components/VideoGrid.astro`

- [ ] **Step 1: Replace the file**

```astro
---
import Tape from './primitives/Tape.astro';

interface Video { id: string; title: string; caption?: string; }
interface Props { videos: Video[] }
const { videos } = Astro.props;
const rotates = [-1.2, 0.6, -0.8, 1.0];
---
<div class="grid grid-cols-1 sm:grid-cols-2 gap-5 my-4">
  {videos.map((v, i) => (
    <figure class="relative bg-paper-card p-2 paper-card-shadow border border-border" style={`transform:rotate(${rotates[i % rotates.length]}deg)`}>
      <Tape class="absolute -top-1 left-1/3" rotate={i % 2 === 0 ? -3 : 3} color={i % 2 === 0 ? 'sage' : 'gold'} />
      <iframe
        width="100%" height="200"
        src={`https://www.youtube-nocookie.com/embed/${v.id}`}
        title={v.title}
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen loading="lazy"
        class="block"
      ></iframe>
      {v.caption && <figcaption class="font-hand text-[15px] text-ink-soft mt-1 px-1">{v.caption}</figcaption>}
    </figure>
  ))}
</div>
```

- [ ] **Step 2: Verify**

Visit a destination with videos (e.g. `/beijing/mutianyu` or `/northwest/qinghai-lake` — check which pages have `videos` in their frontmatter via `grep -l "videos=" src/pages`). Expected: each video sits in a paper frame with a tape strip on top, slight rotation.

- [ ] **Step 3: Commit**

```bash
git add src/components/VideoGrid.astro
git commit -m "Add polaroid and tape framing to VideoGrid"
```

---

## Phase 8 — Resources

### Task 25: Build `PhraseCard.astro` and rewrite `useful-phrases.astro`

**Files:**
- Create: `src/components/PhraseCard.astro`
- Modify: `src/pages/resources/useful-phrases.astro` (full rewrite around the new PhraseCard)

- [ ] **Step 1: Write `src/components/PhraseCard.astro`**

```astro
---
interface Props {
  intent: string;       // handwritten label, e.g. "how much?"
  zh: string;           // 多少钱
  pinyin: string;
  en: string;
  it: string;
}
const { intent, zh, pinyin, en, it } = Astro.props;
---
<div class="relative bg-paper-card border border-border paper-card-shadow p-4 pr-14">
  <span class="font-hand text-[16px] text-vermillion-soft inline-block -rotate-1">{intent}</span>
  <div class="font-zh text-[26px] font-semibold text-ink mt-1 leading-tight">{zh}</div>
  <div class="font-display italic text-[13px] text-ink-soft mt-0.5">{pinyin}</div>
  <div class="text-[14px] text-ink mt-1">{en}</div>
  <div class="text-[12px] italic text-muted mt-0.5">{it}</div>
  <button
    type="button"
    aria-label={`Speak: ${zh}`}
    class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center bg-vermillion text-paper-card rounded-full paper-card-shadow"
    data-speak={zh}
  >▶</button>
</div>
```

- [ ] **Step 2: Replace `src/pages/resources/useful-phrases.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import PhraseCard from '../../components/PhraseCard.astro';
import Stamp from '../../components/primitives/Stamp.astro';

const base = import.meta.env.BASE_URL;

const sections = [
  {
    label: 'essentials ~',
    items: [
      { intent: 'thank you',           zh: '谢谢',         pinyin: 'Xiè xiè',                     en: 'Thank you',               it: 'Grazie' },
      { intent: 'hello',               zh: '你好',         pinyin: 'Nǐ hǎo',                       en: 'Hello',                   it: 'Ciao / Salve' },
      { intent: 'sorry / excuse me',   zh: '不好意思',     pinyin: 'Bù hǎo yìsi',                  en: 'Excuse me / sorry',        it: 'Mi scusi' },
      { intent: 'yes',                 zh: '对',           pinyin: 'Duì',                          en: 'Yes / correct',           it: 'Sì / esatto' },
      { intent: 'no',                  zh: '不对',         pinyin: 'Bù duì',                       en: 'No / not right',          it: 'No / sbagliato' },
      { intent: "I don't understand",  zh: '我听不懂',     pinyin: 'Wǒ tīng bù dǒng',              en: "I don't understand",      it: 'Non capisco' },
      { intent: 'do you speak English?', zh: '你会说英语吗？', pinyin: 'Nǐ huì shuō Yīngyǔ ma?',  en: 'Do you speak English?',   it: 'Parla inglese?' },
      { intent: 'please speak slowly', zh: '请说慢一点',   pinyin: 'Qǐng shuō màn yīdiǎn',         en: 'Please speak slowly',      it: 'Per favore parli più lentamente' },
    ],
  },
  {
    label: 'at the hotel ~',
    items: [
      { intent: 'I have a reservation', zh: '我有预订',   pinyin: 'Wǒ yǒu yùdìng',                en: 'I have a reservation',    it: 'Ho una prenotazione' },
      { intent: 'my passport',         zh: '我的护照',     pinyin: 'Wǒ de hùzhào',                 en: 'My passport',             it: 'Il mio passaporto' },
      { intent: 'where is the room?',  zh: '房间在哪里？', pinyin: 'Fángjiān zài nǎlǐ?',            en: 'Where is the room?',      it: "Dov'è la stanza?" },
      { intent: 'no hot water',        zh: '热水没有',     pinyin: 'Rè shuǐ méiyǒu',               en: "Hot water doesn't work", it: "Non c'è acqua calda" },
      { intent: 'wifi password?',      zh: 'WiFi密码是什么？', pinyin: 'WiFi mìmǎ shì shénme?',  en: 'WiFi password?',          it: 'Qual è la password del WiFi?' },
    ],
  },
  {
    label: 'food & shopping ~',
    items: [
      { intent: 'how much?',           zh: '多少钱？',     pinyin: 'Duōshǎo qián?',                en: 'How much does it cost?',  it: 'Quanto costa?' },
      { intent: 'too expensive',       zh: '太贵了',       pinyin: 'Tài guì le',                   en: 'Too expensive',           it: 'Troppo caro' },
      { intent: 'no spicy please',     zh: '不要辣',       pinyin: 'Bù yào là',                    en: 'No spicy, please',        it: 'Non piccante, per favore' },
      { intent: 'the menu, please',    zh: '请给我菜单',   pinyin: 'Qǐng gěi wǒ càidān',           en: 'The menu, please',        it: 'Il menù, per favore' },
      { intent: 'cheers!',             zh: '干杯！',       pinyin: 'Gānbēi!',                       en: 'Cheers!',                 it: 'Cin cin!' },
    ],
  },
  {
    label: 'getting around ~',
    items: [
      { intent: 'where is …?',         zh: '…在哪里？',    pinyin: '… zài nǎlǐ?',                  en: 'Where is …?',             it: "Dov'è …?" },
      { intent: 'taxi, please',        zh: '我要打车',     pinyin: 'Wǒ yào dǎchē',                 en: 'I need a taxi',           it: 'Mi serve un taxi' },
      { intent: 'go to this address',  zh: '去这个地址',   pinyin: 'Qù zhège dìzhǐ',               en: 'Go to this address',      it: 'A questo indirizzo' },
      { intent: 'is it far?',          zh: '远吗？',       pinyin: 'Yuǎn ma?',                     en: 'Is it far?',              it: 'È lontano?' },
      { intent: 'help!',               zh: '救命！',       pinyin: 'Jiùmìng!',                      en: 'Help!',                   it: 'Aiuto!' },
    ],
  },
];
---
<Base title="Useful phrases · 中文 / English / Italiano">
  <div class="mb-4"><a href={base} class="text-sm text-muted hover:text-vermillion-soft">← Full trip overview</a></div>

  <header class="relative">
    <Stamp rotate={-3}>survival kit</Stamp>
    <h1 class="font-display italic font-semibold text-[36px] leading-none mt-2">Useful phrases</h1>
    <p class="font-mono uppercase text-[10px] tracking-[.14em] text-muted mt-1">中文 · ENGLISH · ITALIANO</p>
    <p class="mt-3 max-w-prose text-[14px] text-ink-soft">
      The Chinese members handle most communication. These are for when you're separated, ordering food alone, or just want to connect with locals. Tap ▶ to hear pronunciation.
    </p>
  </header>

  {sections.map(s => (
    <section class="mt-8">
      <span class="font-hand text-[20px] text-vermillion-soft inline-block -rotate-1">{s.label}</span>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
        {s.items.map(p => <PhraseCard {...p} />)}
      </div>
    </section>
  ))}

  <hr class="my-8 dashed-divider" />
  <p class="text-sm text-muted">Pronunciation: <strong>ǐ</strong> = short "ee", <strong>ü</strong> = like French "u", <strong>zh</strong> = "j" in "judge", <strong>x</strong> = soft "sh", <strong>q</strong> = light "ch", <strong>c</strong> = "ts"</p>

  <script is:inline>
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-speak]');
      if (!btn) return;
      const text = btn.getAttribute('data-speak');
      if (!('speechSynthesis' in window) || !text) return;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN'; u.rate = 0.85;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    });
  </script>
</Base>
```

- [ ] **Step 3: Verify**

Visit `/resources/useful-phrases`. Expected: stamp + Fraunces title; sections labelled in handwriting ("essentials ~", etc.); each phrase as a card with handwritten intent, large 中文 (Noto Serif SC), italic pinyin, English, italic muted Italian, and a vermillion ▶ button. Click ▶ — Chinese pronunciation plays via SpeechSynthesis.

- [ ] **Step 4: Commit**

```bash
git add src/components/PhraseCard.astro src/pages/resources/useful-phrases.astro
git commit -m "Rebuild useful-phrases with PhraseCard and Italian translations"
```

---

### Task 26: Restyle `tips.astro` with stamps, marginalia, and per-section Italian

**Files:**
- Modify: `src/pages/resources/tips.astro` (full rewrite — preserve original tip text)

- [ ] **Step 1: Read the existing tips page to capture the tip text**

```bash
cat src/pages/resources/tips.astro
```

- [ ] **Step 2: Rewrite `src/pages/resources/tips.astro`** with the following pattern: a header (stamp "field tips" + title + handwritten subtitle), then sections wrapped in `<PaperCard>` with handwritten section labels above each card. Inside each card, English first, then a smaller italic Italian translation. Use `<Stamp rotate={-3}>warning</Stamp>` for any "BEWARE" tips. Include `<Marginalia>` for one-liner asides. Keep all tip content from the original; the structure and chrome are what change.

The exact tip content lives in the existing file — preserve it verbatim, just re-host inside the new chrome. Italian translations: draft them and mark each with a `data-it-draft` attribute so the user can find them on review.

```astro
---
import Base from '../../layouts/Base.astro';
import PaperCard from '../../components/primitives/PaperCard.astro';
import Stamp from '../../components/primitives/Stamp.astro';
import Marginalia from '../../components/primitives/Marginalia.astro';

const base = import.meta.env.BASE_URL;
---
<Base title="Travel tips · suggerimenti">
  <div class="mb-4"><a href={base} class="text-sm text-muted hover:text-vermillion-soft">← Full trip overview</a></div>

  <header class="relative">
    <Stamp rotate={-2}>field tips</Stamp>
    <h1 class="font-display italic font-semibold text-[36px] leading-none mt-2">Travel tips</h1>
    <p class="font-mono uppercase text-[10px] tracking-[.14em] text-muted mt-1">things we wish we'd known</p>
  </header>

  <!-- For each section in the original tips.astro, render: -->
  <!--
  <section class="mt-8">
    <span class="font-hand text-[20px] text-vermillion-soft inline-block -rotate-1">{label}</span>
    <PaperCard class="mt-2 relative">
      <h3 class="font-display text-lg font-semibold mb-1">{englishTitle}</h3>
      <p class="text-[14px] leading-relaxed">{englishBody}</p>
      <p data-it-draft class="font-display italic text-[13px] text-ink-soft mt-2">{italianBody}</p>
      {warning && <Marginalia position="br" rotate={-2} color="red">careful!</Marginalia>}
    </PaperCard>
  </section>
  -->

  <!-- ... real sections go here, ported from the original file ... -->
</Base>
```

The agent doing this task should read the original `tips.astro`, port each existing section into the pattern above, and draft an Italian paragraph for each. **Italian drafts go in `data-it-draft` paragraphs so the user can find them with a single grep before merge.**

- [ ] **Step 3: Verify**

Visit `/resources/tips`. Expected: handwritten labels above paper cards, English then italic Italian per section, occasional "careful!" marginalia, no broken layout, all original tip content preserved.

- [ ] **Step 4: Commit**

```bash
git add src/pages/resources/tips.astro
git commit -m "Restyle tips page with stamps, marginalia, and Italian drafts"
```

---

### Task 27: Restyle `packing-list.astro`

**Files:**
- Modify: `src/pages/resources/packing-list.astro` (preserve all items, restyle chrome)

- [ ] **Step 1: Read the existing file** with `cat src/pages/resources/packing-list.astro` to capture all items and category groupings.

- [ ] **Step 2: Rewrite `src/pages/resources/packing-list.astro`** as a header (stamp "kit list" + title), then for each category render a section like:

```astro
<section class="mt-8">
  <div class="relative inline-block">
    <Tape class="absolute -top-1 -left-2 z-10" rotate={-3} color="sage" />
    <h2 class="font-display text-2xl font-bold pl-3 pr-2">{categoryName}</h2>
  </div>
  <ul class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
    {items.map(item => (
      <li class="flex gap-2 items-start text-[14px]">
        <span class="font-mono text-muted text-[10px] mt-1.5">☐</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
</section>
```

Preserve all original items; only the chrome changes.

- [ ] **Step 3: Verify**

Visit `/resources/packing-list`. Expected: each category heading sports a tape strip; items listed as a checklist with a mono `☐` marker.

- [ ] **Step 4: Commit**

```bash
git add src/pages/resources/packing-list.astro
git commit -m "Restyle packing-list with tape category headers"
```

---

### Task 28: Restyle `pages/map.astro` (palette only)

**Files:**
- Modify: `src/pages/map.astro`

- [ ] **Step 1: Read the existing file** with `cat src/pages/map.astro`.

- [ ] **Step 2: Update header chrome only** — the existing InteractiveMap call already gets the new tile filter and marker styles from Task 21. Wrap the page header in:

```astro
<header class="relative">
  <Stamp rotate={-2}>atlas</Stamp>
  <h1 class="font-display italic font-semibold text-[36px] leading-none mt-2">All routes</h1>
  <p class="font-mono uppercase text-[10px] tracking-[.14em] text-muted mt-1">22 days · 5 phases · ~4,200km</p>
</header>
```

Replace any existing legend boxes' Tailwind classes with the journal palette (`bg-paper-card`, `border-border`, `text-ink-soft`).

- [ ] **Step 3: Verify**

Visit `/map`. Expected: stamp + Fraunces title, sepia-tinted map, journal-coloured legend.

- [ ] **Step 4: Commit**

```bash
git add src/pages/map.astro
git commit -m "Restyle map page header and legend"
```

---

### Task 29: Restyle `MapDropdown.astro` palette

**Files:**
- Modify: `src/components/MapDropdown.astro` (only Tailwind class names — the journal CSS in Task 1 already provides the dropdown shell)

- [ ] **Step 1: Replace `src/components/MapDropdown.astro`**

```astro
---
interface Props {
  lat: number;
  lng: number;
  name: string;
  nameCn?: string;
  imageQuery?: string;
}
const { lat, lng, name, nameCn, imageQuery } = Astro.props;
const displayName = nameCn || name;
---
<div class="inline-flex items-center gap-2 mb-2">
  <details class="map-dropdown">
    <summary class="text-vermillion-soft">📍 open in maps</summary>
    <div class="map-links">
      <div class="font-mono uppercase tracking-[.14em] text-[10px] text-muted mb-2">choose a map app</div>
      <a href={`https://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(name)}`} target="_blank">🍎 Apple Maps</a>
      <a href={`https://www.google.com/maps?q=${lat},${lng}`} target="_blank">🌐 Google Maps</a>
      <a href={`https://uri.amap.com/marker?position=${lng},${lat}&name=${encodeURIComponent(displayName)}`} target="_blank">🗺 高德地图 (Amap)</a>
      <a href={`https://api.map.baidu.com/marker?location=${lat},${lng}&title=${encodeURIComponent(displayName)}&output=html`} target="_blank">🔵 百度地图 (Baidu)</a>
    </div>
  </details>
  {imageQuery && (
    <a href={`https://www.google.com/search?q=${encodeURIComponent(imageQuery)}&tbm=isch`}
       target="_blank" class="text-xl no-underline" title="Search images">🖼</a>
  )}
</div>
```

- [ ] **Step 2: Verify on a destination page** — open the dropdown and confirm the journal-coloured menu appears.

- [ ] **Step 3: Commit**

```bash
git add src/components/MapDropdown.astro
git commit -m "Restyle MapDropdown palette and copy"
```

---

## Phase 9 — Cleanup, Italian QA, final pass

### Task 30: Delete or replace `TransportTable.astro`

`TransportTable` is no longer used by the homepage (Task 13 swapped it for `TicketStub`). Confirm no callers remain, then delete.

- [ ] **Step 1: Search for callers**

```bash
grep -rn "TransportTable" src/
```

Expected output: no matches outside the component file itself. If matches exist, port those callers to `TicketStub` first.

- [ ] **Step 2: Delete the component file**

```bash
git rm src/components/TransportTable.astro
```

- [ ] **Step 3: Commit**

```bash
git commit -m "Remove TransportTable, replaced by TicketStub"
```

---

### Task 31: Sweep destination pages — confirm the layout-driven restyle is enough

**Files:**
- Read: each `src/pages/{beijing,xian,northwest}/*.astro`
- Modify: any destination page whose body uses dark-mode classes that no longer exist

- [ ] **Step 1: Find dark-mode classes still in destination pages**

```bash
grep -rn "dark:" src/pages/{beijing,xian,northwest}
```

Expected: many matches (e.g. `dark:text-gray-400`). These are now no-ops since we dropped dark mode but they don't break anything. Leave them for now to keep the diff small.

- [ ] **Step 2: For each destination page, confirm the page renders correctly**

Spot-check 4 pages: `/beijing/forbidden-city`, `/beijing/mutianyu`, `/xian/terracotta-warriors`, `/northwest/qinghai-lake`. Expected: new Destination layout header (stamp/coords/mini-map), polaroid photos, prose body unchanged, bottom prose still readable.

- [ ] **Step 3: If a page looks visually wrong**, fix only that page in this task (do not over-edit). Commit any fixes.

```bash
git add src/pages/<phase>/<slug>.astro
git commit -m "Fix destination page <slug> for journal layout"
```

If no fixes are needed, this task is documentation-only — no commit.

---

### Task 32: "Today" landing — client-side check that the day matches the user's local date

The Task 13 implementation uses **server-render** time for "today", which is wrong if the site is built ahead and served statically (the rendered "today" sticks to build day). Add a tiny client-side script that re-evaluates which day card to highlight at page load.

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: At the bottom of `index.astro`**, after the closing `</Base>` tag is impossible because slot content sits inside Base — instead, add the script as the last child of `<Base>`'s slot:

```astro
<script is:inline>
  (function() {
    const tripStart = new Date('2026-07-14');
    const tripEnd = new Date('2026-08-04');
    const today = new Date();
    if (today < tripStart || today > tripEnd) return;
    const iso = today.toISOString().slice(0, 10);
    document.querySelectorAll('[data-trip-day]').forEach(el => {
      if (el.getAttribute('data-trip-day') === iso) {
        el.classList.add('day-card-flash');
      }
    });
  })();
</script>
```

- [ ] **Step 2: Add `data-trip-day={d.date}` to each DayCard rendered on phase pages**

Open `src/components/DayCard.astro` and add `data-trip-day={date}` as an attribute on the outer `<PaperCard>` (passing it through means PaperCard needs to spread unknown props — update PaperCard to accept and apply `...rest`):

In `src/components/primitives/PaperCard.astro`, change the props interface to:

```astro
---
interface Props {
  href?: string;
  class?: string;
  padded?: boolean;
  [key: string]: any;
}
const { href, class: className = '', padded = true, ...rest } = Astro.props;
const baseClasses = `relative bg-paper-card border border-border paper-card-shadow ${padded ? 'p-4' : ''} ${className}`;
---
{href ? (
  <a href={href} class={`block ${baseClasses} no-underline text-inherit hover:-translate-y-px transition-transform`} {...rest}>
    <slot />
  </a>
) : (
  <div class={baseClasses} {...rest}>
    <slot />
  </div>
)}
```

Then in `DayCard.astro`, change the PaperCard invocation:

```astro
<PaperCard class="mb-4 day-card" {...(anchorId ? { id: anchorId } : {})} data-trip-day={date}>
```

- [ ] **Step 3: Verify**

Open devtools, set Date.now() override (Sources → Overrides → use a small snippet, or change your machine clock to 2026-07-15) and visit a phase page. Expected: that day's card has the vermillion flash outline.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro src/components/primitives/PaperCard.astro src/components/DayCard.astro
git commit -m "Highlight today's day card based on the user's local date"
```

---

### Task 33: Italian copy review pass

**Files:**
- All files containing `data-it-draft` or `headlineIt`

- [ ] **Step 1: List all places where Italian copy lives**

```bash
grep -rn "data-it-draft\|headlineIt" src/
```

- [ ] **Step 2: Ask the user to review**

Send the user a list of files + count of strings. Wait for the user's review comments and apply them. **Do not merge until this step is signed off.**

- [ ] **Step 3: Commit any user-requested fixes**

```bash
git add -p
git commit -m "Italian copy review fixes"
```

---

### Task 34: Final QA pass

**Files:** none (manual verification only)

- [ ] **Step 1: Boot the dev server and walk every route at three widths**

```bash
npm run dev
```

Pages × widths matrix:

| URL | 375px | 768px | 1280px |
|---|---|---|---|
| `/` | ✓ | ✓ | ✓ |
| `/trips/beijing` | ✓ + hide-map + hide-list | ✓ | ✓ |
| `/trips/xian` | ✓ | ✓ | ✓ |
| `/trips/northwest` | ✓ | ✓ | ✓ |
| `/beijing/forbidden-city` | ✓ | ✓ | ✓ |
| `/beijing/mutianyu` (image-heavy) | ✓ | ✓ | ✓ |
| `/northwest/qinghai-lake` | ✓ | ✓ | ✓ |
| `/resources/useful-phrases` (tap a ▶) | ✓ | ✓ | ✓ |
| `/resources/tips` | ✓ | ✓ | ✓ |
| `/resources/packing-list` | ✓ | ✓ | ✓ |
| `/map` | ✓ | ✓ | ✓ |

Look for: layout breaks, missing fonts, console errors, broken map markers, broken phase-page coordination, mojibake on Chinese text.

- [ ] **Step 2: Run a production build**

```bash
npm run build
```

Expected: clean build, no warnings about missing fonts or invalid CSS. If there are warnings, fix them.

- [ ] **Step 3: Confirm `npm run preview` serves the built site correctly**

```bash
npm run preview
```

Visit `http://localhost:4321/RoadMapForChina-site/` and re-walk the matrix above briefly.

- [ ] **Step 4: Open the PR**

```bash
git push -u origin redesign-journal
gh pr create --title "Redesign: refined hand-made journal aesthetic" --body "$(cat <<'EOF'
## Summary
- Refined hand-made journal aesthetic: paper background, Fraunces / Inter / JetBrains Mono / Caveat / Noto Serif SC
- Drops dark mode (single light theme)
- New IA: Pattern A (collapsible map+list) on phase pages, Pattern C (inline mini-maps in phase cards) on the homepage
- New primitives in `src/components/primitives/`: Tape, Stamp, DayBadge, Marginalia, DashedRoute, PaperCard, MiniMap, Coords
- Italian translations on phrases, tips, and day-card highlights (5 of 7 travelers are Italian)

## Test plan
- [x] All pages render at 375 / 768 / 1280px
- [x] Phase pages: hide-map and hide-list persist via localStorage
- [x] Day-card ↔ map marker coordination works
- [x] Phrases ▶ button speaks Chinese via SpeechSynthesis
- [x] Today's day card is highlighted on phase pages
- [x] Italian drafts reviewed by the user

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Return the PR URL.

---

## Self-review (writer's check, performed once after the plan is written)

**Spec coverage:**
- Aesthetic system (fonts, colors, paper, primitives) → Tasks 1, 2, 3–10
- Drop dark mode → Tasks 1, 2 (and called out in Task 31)
- Pattern C on homepage → Tasks 12, 13, 14
- Pattern A on phase pages, with hide-map / hide-list and localStorage → Tasks 15, 17, 18, 19, 20
- Day-coord source from `locations.ts` → Task 11
- InteractiveMap restyle → Task 21
- Destination layout new header + polaroid media → Tasks 22, 23, 24
- Resources rebuild (phrases, tips, packing-list, map) → Tasks 25, 26, 27, 28, 29
- Italian on phrases / tips / day-card highlights → Tasks 11, 25, 26, 33
- Italian draft review gate before merge → Task 33
- Single PR rollout → Task 34
- "Today" detection client-side → Task 32

**Placeholder scan:** every step shows the actual code or the actual command. Tasks 19, 20, 26, 27, 28 reference "preserve original prose / items" because the source content is in the existing files; the agent reads those files in step 1 before rewriting. That's not a placeholder — that's a real "read first, then transform" instruction. No "TBD" / "TODO" / "implement later" in the plan.

**Type consistency:** primitives' prop names (`rotate`, `color`, `class`, `pins`, `id`, `bleed`, `number`) are used consistently across producer (Tasks 3–10) and consumer (Tasks 12, 13, 22, 25, etc.). `tripDays` shape declared in Task 11 matches the consumption in Tasks 13, 17, 19, 20.

Plan complete.
