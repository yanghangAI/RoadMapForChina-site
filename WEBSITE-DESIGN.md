# Website Design Summary

## Tech Stack
- **Generator:** Quartz v4 — converts Obsidian markdown to a static site
- **Hosting:** GitHub Pages, auto-deployed via GitHub Actions on every push to the `v4` branch
- **URL:** `https://yanghangai.github.io/RoadMapForChina-site/`

---

## Page Structure

```
/                  → index.md       (main itinerary)
/map               → map.md         (interactive route map)
/places/[name]     → 17 destination pages
/static/route-map.html             (standalone Leaflet map)
/photos/           → 50+ images
```

---

## Components & Features

### Trip Overview Cards (`index.md`)
- Responsive CSS Grid (`repeat(auto-fill, minmax(260px, 1fr))`) — works on mobile
- Each card: day title (links to that day's section via `#day-N` anchor), temperature badge, driving info, destination links, sleep location
- Every destination link has a 📍 map picker and 🖼 image search icon

### Place Detail Pages (`places/*.md`)
Each page follows this order:
1. 📍 map picker dropdown + 🖼 image search icon
2. Hero photo + 2-column photo grid
3. Embedded YouTube videos (inline iframes, responsive grid)
4. Overview
5. What to See & Do
6. Best Time to Visit
7. Practical Tips
8. Why It's Worth It

- 📍 opens a dropdown with 4 navigation options: Apple Maps, Google Maps, 高德 (Amap), 百度 (Baidu)
- 🖼 opens Google Image Search for that destination in a new tab
- YouTube videos embedded via `youtube-nocookie.com` iframes — play inline, no redirect to YouTube

### Optional Destinations (`index.md` bottom)
- Same card grid style as trip overview, grey left border to visually distinguish from main plan
- Each card links to the full destination page

### Interactive Route Map (`/static/route-map.html`)
- Built with Leaflet.js, embedded in `map.md` via `<iframe>`
- 12 numbered circular markers (color-coded by trip segment) + 5 grey diamond markers for optional stops
- Dashed red polyline connecting all main stops in route order
- Each marker popup: place name, day, **View Details** (navigates full page via `target="_top"`), + 4-option map picker

---

## Key Design Decisions

| Decision | Why |
|---|---|
| Standalone `route-map.html` in `/static/` | Quartz strips/rewrites scripts in markdown — iframe is the only reliable way to embed Leaflet |
| Absolute URL for iframe `src` | Quartz rewrites relative paths during build, breaking the iframe |
| `target="_top"` on map popup links | Links inside an iframe would open inside the iframe without it |
| `youtube-nocookie.com` embeds | Avoids tracking cookies; plays inline without leaving the page |
| 4-option map picker instead of Google Maps only | Google Maps is blocked in mainland China |
| CSS Grid cards instead of markdown tables | Markdown tables collapse poorly on mobile |
| `#day-N` anchor links in overview cards | Lets users jump directly from the overview to the detailed day section |

---

## File Reference

| File | Purpose |
|---|---|
| `content/index.md` | Main itinerary, trip overview cards, optional destinations |
| `content/map.md` | Route map page (embeds route-map.html via iframe) |
| `content/places/*.md` | 17 destination detail pages |
| `content/photos/` | 50+ destination photos (3 per place) |
| `quartz/static/route-map.html` | Standalone Leaflet interactive map |
| `quartz.config.ts` | Site title, base URL configuration |
| `.github/workflows/deploy.yml` | GitHub Actions: build + deploy to GitHub Pages on push to `v4` |
