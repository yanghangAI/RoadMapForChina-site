export interface Location {
  name: string;
  nameCn: string;
  lat: number;
  lng: number;
  region: 'beijing' | 'xian' | 'northwest' | 'chengdu' | 'yunnan';
  slug: string;
}

export const locations: Record<string, Location> = {
  'forbidden-city': {
    name: 'Forbidden City',
    nameCn: '故宫博物院',
    lat: 39.916,
    lng: 116.390,
    region: 'beijing',
    slug: 'beijing/forbidden-city',
  },
  'great-wall': {
    name: 'Great Wall (Mutianyu)',
    nameCn: '慕田峪长城',
    lat: 40.432,
    lng: 116.564,
    region: 'beijing',
    slug: 'beijing/great-wall',
  },
  'tiananmen': {
    name: 'Tiananmen Square',
    nameCn: '天安门广场',
    lat: 39.903,
    lng: 116.391,
    region: 'beijing',
    slug: 'beijing/tiananmen',
  },
  '798-art': {
    name: '798 Art District',
    nameCn: '798艺术区',
    lat: 39.984,
    lng: 116.494,
    region: 'beijing',
    slug: 'beijing/798-art-district',
  },
  'panjiayuan': {
    name: 'Panjiayuan Market',
    nameCn: '潘家园旧货市场',
    lat: 39.871,
    lng: 116.463,
    region: 'beijing',
    slug: 'beijing/panjiayuan',
  },
  'hutongs': {
    name: 'Hutongs',
    nameCn: '胡同',
    lat: 39.937,
    lng: 116.391,
    region: 'beijing',
    slug: 'beijing/hutongs',
  },
  'terracotta-warriors': {
    name: 'Terracotta Warriors',
    nameCn: '秦始皇兵马俑',
    lat: 34.384,
    lng: 109.278,
    region: 'xian',
    slug: 'xian/terracotta-warriors',
  },
  'city-wall': {
    name: "Xi'an City Wall",
    nameCn: '西安城墙',
    lat: 34.260,
    lng: 108.946,
    region: 'xian',
    slug: 'xian/city-wall',
  },
  'muslim-quarter': {
    name: 'Muslim Quarter',
    nameCn: '回民街',
    lat: 34.264,
    lng: 108.940,
    region: 'xian',
    slug: 'xian/muslim-quarter',
  },
  'tang-mall': {
    name: 'Tang All-Day Mall',
    nameCn: '大唐不夜城',
    lat: 34.219,
    lng: 108.960,
    region: 'xian',
    slug: 'xian/tang-mall',
  },
  'riyueshan': {
    name: 'Riyueshan Pass',
    nameCn: '日月山',
    lat: 36.650,
    lng: 101.093,
    region: 'northwest',
    slug: 'northwest/riyueshan',
  },
  'qinghai-lake': {
    name: 'Qinghai Lake',
    nameCn: '青海湖',
    lat: 36.884,
    lng: 100.135,
    region: 'northwest',
    slug: 'northwest/qinghai-lake',
  },
  'chaka-salt-lake': {
    name: 'Chaka Salt Lake',
    nameCn: '茶卡盐湖',
    lat: 36.720,
    lng: 99.082,
    region: 'northwest',
    slug: 'northwest/chaka-salt-lake',
  },
  'feicui-hu': {
    name: 'Feicui Hu',
    nameCn: '翡翠湖',
    lat: 37.250,
    lng: 95.880,
    region: 'northwest',
    slug: 'northwest/feicui-hu',
  },
  'delingha': {
    name: 'Delingha',
    nameCn: '德令哈',
    lat: 37.370,
    lng: 97.361,
    region: 'northwest',
    slug: 'northwest/delingha',
  },
  'dunhuang-night-market': {
    name: 'Dunhuang Night Market',
    nameCn: '敦煌夜市',
    lat: 40.142,
    lng: 94.662,
    region: 'northwest',
    slug: 'northwest/dunhuang-night-market',
  },
  'mogao-caves': {
    name: 'Mogao Caves',
    nameCn: '莫高窟',
    lat: 40.036,
    lng: 94.802,
    region: 'northwest',
    slug: 'northwest/mogao-caves',
  },
  'mingsha-dunes': {
    name: 'Mingsha Dunes',
    nameCn: '鸣沙山',
    lat: 40.082,
    lng: 94.671,
    region: 'northwest',
    slug: 'northwest/mingsha-dunes',
  },
  'jiayuguan-fort': {
    name: 'Jiayuguan Fort',
    nameCn: '嘉峪关',
    lat: 39.811,
    lng: 98.226,
    region: 'northwest',
    slug: 'northwest/jiayuguan-fort',
  },
  'qicai-danxia': {
    name: 'Qicai Danxia',
    nameCn: '七彩丹霞',
    lat: 38.914,
    lng: 100.105,
    region: 'northwest',
    slug: 'northwest/qicai-danxia',
  },
  'qilian-grassland': {
    name: 'Qilian Grassland',
    nameCn: '祁连草原',
    lat: 38.180,
    lng: 100.250,
    region: 'northwest',
    slug: 'northwest/qilian-grassland',
  },
  'shandan-horse-farm': {
    name: 'Shandan Horse Farm',
    nameCn: '山丹军马场',
    lat: 38.560,
    lng: 100.850,
    region: 'northwest',
    slug: 'northwest/shandan-horse-farm',
  },
  'menyuan-flowers': {
    name: 'Menyuan Rapeseed Flowers',
    nameCn: '门源油菜花',
    lat: 37.376,
    lng: 101.615,
    region: 'northwest',
    slug: 'northwest/menyuan-flowers',
  },
  'zhuoer-mountain': {
    name: 'Zhuoer Mountain',
    nameCn: '卓尔山',
    lat: 38.204,
    lng: 100.217,
    region: 'northwest',
    slug: 'northwest/zhuoer-mountain',
  },
  'yardang': {
    name: 'Yardang National Geopark',
    nameCn: '雅丹国家地质公园',
    lat: 40.525,
    lng: 93.303,
    region: 'northwest',
    slug: 'northwest/yardang',
  },
  'taer-monastery': {
    name: "Ta'er Monastery",
    nameCn: '塔尔寺',
    lat: 36.479,
    lng: 101.578,
    region: 'northwest',
    slug: 'northwest/taer-monastery',
  },
};

export const tripPhases = [
  {
    name: 'Beijing',
    nameCn: '北京',
    phase: 'Phase 1',
    dates: 'Jul 14-16',
    transport: 'Arrive Daxing 12:10',
    coords: [39.905, 116.391] as [number, number],
    color: '#2b6cb0',
    num: 1,
    slug: 'trips/beijing',
  },
  {
    name: "Xi'an",
    nameCn: '西安',
    phase: 'Phase 2',
    dates: 'Jul 17',
    transport: 'Night train from Beijing (~11h)',
    coords: [34.341, 108.940] as [number, number],
    color: '#c07a10',
    num: 2,
    slug: 'trips/xian',
  },
  {
    name: 'Xining',
    nameCn: '西宁',
    phase: 'Phase 3 - Northwest Loop',
    dates: 'Jul 18-24',
    transport: 'High-speed from Xi\'an (~4h)',
    coords: [36.617, 101.778] as [number, number],
    color: '#2f855a',
    num: 3,
    slug: 'trips/northwest',
  },
  {
    name: 'Chengdu',
    nameCn: '成都',
    phase: 'Phase 4',
    dates: 'Jul 25-26',
    transport: 'Fly from Xining (~2h)',
    coords: [30.657, 104.066] as [number, number],
    color: '#c05621',
    num: 4,
    slug: null,
  },
  {
    name: 'Kunming',
    nameCn: '昆明',
    phase: 'Phase 5 - Yunnan',
    dates: 'Jul 27 - Aug 3',
    transport: 'High-speed from Chengdu (~4-5h)',
    coords: [25.046, 102.706] as [number, number],
    color: '#6b46c1',
    num: 5,
    slug: null,
  },
];

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
