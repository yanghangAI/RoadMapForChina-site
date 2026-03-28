---
title: Route Map
---

# Route Map · 路线地图

Click any marker to view the destination details.

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<div id="map" style="height: 600px; width: 100%; border-radius: 12px; margin: 1rem 0; z-index: 0;"></div>

<script>
const map = L.map('map').setView([38.5, 98.5], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 18
}).addTo(map);

const stops = [
  {
    name: "Xining · 西宁",
    day: "Start / End",
    coords: [36.617, 101.778],
    slug: null,
    color: "#2b6cb0"
  },
  {
    name: "Riyueshan Pass · 日月山",
    day: "Day 1",
    coords: [36.533, 101.083],
    slug: "places/riyueshan",
    color: "#2f855a"
  },
  {
    name: "Qinghai Lake · 青海湖",
    day: "Day 1",
    coords: [36.900, 100.183],
    slug: "places/qinghai-lake",
    color: "#2f855a"
  },
  {
    name: "Chaka Salt Lake · 茶卡盐湖",
    day: "Day 1–2",
    coords: [36.717, 99.083],
    slug: "places/chaka-salt-lake",
    color: "#2f855a"
  },
  {
    name: "Delingha · 德令哈",
    day: "Day 2",
    coords: [37.367, 97.367],
    slug: "places/delingha",
    color: "#2f855a"
  },
  {
    name: "Feicui Hu · 翡翠湖",
    day: "Day 2",
    coords: [37.850, 95.367],
    slug: "places/feicui-hu",
    color: "#2f855a"
  },
  {
    name: "Dunhuang · 敦煌",
    day: "Day 3–4",
    coords: [40.142, 94.662],
    slug: "places/dunhuang-night-market",
    color: "#c05621"
  },
  {
    name: "Mogao Caves · 莫高窟",
    day: "Day 4",
    coords: [40.038, 94.806],
    slug: "places/mogao-caves",
    color: "#c05621"
  },
  {
    name: "Mingsha Dunes · 鸣沙山",
    day: "Day 4",
    coords: [39.997, 94.680],
    slug: "places/mingsha-dunes",
    color: "#c05621"
  },
  {
    name: "Jiayuguan Fort · 嘉峪关",
    day: "Day 5",
    coords: [39.817, 98.300],
    slug: "places/jiayuguan-fort",
    color: "#6b46c1"
  },
  {
    name: "Qicai Danxia · 七彩丹霞",
    day: "Day 6",
    coords: [38.933, 100.467],
    slug: "places/qicai-danxia",
    color: "#6b46c1"
  },
  {
    name: "Menyuan Flowers · 门源油菜花",
    day: "Day 6",
    coords: [37.383, 101.617],
    slug: "places/menyuan-flowers",
    color: "#6b46c1"
  },
  {
    name: "Qilian Grassland · 祁连草原",
    day: "Day 6–7",
    coords: [38.183, 100.250],
    slug: "places/qilian-grassland",
    color: "#6b46c1"
  }
];

// Draw route polyline
const routeCoords = stops.map(s => s.coords);
L.polyline(routeCoords, {
  color: '#e53e3e',
  weight: 3,
  opacity: 0.7,
  dashArray: '8, 6'
}).addTo(map);

// Add markers
stops.forEach((stop, i) => {
  const markerHtml = `
    <div style="
      background: ${stop.color};
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    ">${i + 1}</div>
  `;

  const icon = L.divIcon({
    html: markerHtml,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16]
  });

  const popupContent = stop.slug
    ? `<div style="font-family: sans-serif; min-width: 160px;">
        <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${stop.name}</div>
        <div style="color: #666; font-size: 12px; margin-bottom: 8px;">${stop.day}</div>
        <a href="/${stop.slug}" style="
          background: ${stop.color};
          color: white;
          padding: 4px 10px;
          border-radius: 4px;
          text-decoration: none;
          font-size: 12px;
        ">View Details →</a>
      </div>`
    : `<div style="font-family: sans-serif;">
        <div style="font-weight: bold; font-size: 14px;">${stop.name}</div>
        <div style="color: #666; font-size: 12px;">${stop.day}</div>
      </div>`;

  L.marker(stop.coords, { icon })
    .addTo(map)
    .bindPopup(popupContent, { maxWidth: 220 });
});
</script>

---

| Color | Days |
|-------|------|
| 🔵 Blue | Start / End — Xining |
| 🟢 Green | Days 1–2 — Qinghai & Qaidam |
| 🟠 Orange | Days 3–4 — Dunhuang |
| 🟣 Purple | Days 5–7 — Hexi Corridor & Qilian |
