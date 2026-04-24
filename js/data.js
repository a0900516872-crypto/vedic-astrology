// ==============================================
// 印占核心数据表
// ==============================================

// 12 星座（Rashi）—— 中英文 + 梵文
const RASHIS = [
  { idx: 0,  en: "Aries",       sa: "Mesha",       zh: "白羊",   lord: "Mars" },
  { idx: 1,  en: "Taurus",      sa: "Vrishabha",   zh: "金牛",   lord: "Venus" },
  { idx: 2,  en: "Gemini",      sa: "Mithuna",     zh: "双子",   lord: "Mercury" },
  { idx: 3,  en: "Cancer",      sa: "Karka",       zh: "巨蟹",   lord: "Moon" },
  { idx: 4,  en: "Leo",         sa: "Simha",       zh: "狮子",   lord: "Sun" },
  { idx: 5,  en: "Virgo",       sa: "Kanya",       zh: "处女",   lord: "Mercury" },
  { idx: 6,  en: "Libra",       sa: "Tula",        zh: "天秤",   lord: "Venus" },
  { idx: 7,  en: "Scorpio",     sa: "Vrischika",   zh: "天蝎",   lord: "Mars" },
  { idx: 8,  en: "Sagittarius", sa: "Dhanu",       zh: "射手",   lord: "Jupiter" },
  { idx: 9,  en: "Capricorn",   sa: "Makara",      zh: "摩羯",   lord: "Saturn" },
  { idx: 10, en: "Aquarius",    sa: "Kumbha",      zh: "水瓶",   lord: "Saturn" },
  { idx: 11, en: "Pisces",      sa: "Meena",       zh: "双鱼",   lord: "Jupiter" }
];

// 27 星宿（Nakshatra），每宿 13°20' = 13.3333°
const NAKSHATRAS = [
  { idx: 0,  sa: "Ashwini",      zh: "娄宿",   lord: "Ketu" },
  { idx: 1,  sa: "Bharani",      zh: "胃宿",   lord: "Venus" },
  { idx: 2,  sa: "Krittika",     zh: "昴宿",   lord: "Sun" },
  { idx: 3,  sa: "Rohini",       zh: "毕宿",   lord: "Moon" },
  { idx: 4,  sa: "Mrigashira",   zh: "觜宿",   lord: "Mars" },
  { idx: 5,  sa: "Ardra",        zh: "参宿",   lord: "Rahu" },
  { idx: 6,  sa: "Punarvasu",    zh: "井宿",   lord: "Jupiter" },
  { idx: 7,  sa: "Pushya",       zh: "鬼宿",   lord: "Saturn" },
  { idx: 8,  sa: "Ashlesha",     zh: "柳宿",   lord: "Mercury" },
  { idx: 9,  sa: "Magha",        zh: "星宿",   lord: "Ketu" },
  { idx: 10, sa: "P.Phalguni",   zh: "张宿",   lord: "Venus" },
  { idx: 11, sa: "U.Phalguni",   zh: "翼宿",   lord: "Sun" },
  { idx: 12, sa: "Hasta",        zh: "轸宿",   lord: "Moon" },
  { idx: 13, sa: "Chitra",       zh: "角宿",   lord: "Mars" },
  { idx: 14, sa: "Swati",        zh: "亢宿",   lord: "Rahu" },
  { idx: 15, sa: "Vishakha",     zh: "氐宿",   lord: "Jupiter" },
  { idx: 16, sa: "Anuradha",     zh: "房宿",   lord: "Saturn" },
  { idx: 17, sa: "Jyeshtha",     zh: "心宿",   lord: "Mercury" },
  { idx: 18, sa: "Mula",         zh: "尾宿",   lord: "Ketu" },
  { idx: 19, sa: "P.Ashadha",    zh: "箕宿",   lord: "Venus" },
  { idx: 20, sa: "U.Ashadha",    zh: "斗宿",   lord: "Sun" },
  { idx: 21, sa: "Shravana",     zh: "牛宿",   lord: "Moon" },
  { idx: 22, sa: "Dhanishta",    zh: "女宿",   lord: "Mars" },
  { idx: 23, sa: "Shatabhisha",  zh: "虚宿",   lord: "Rahu" },
  { idx: 24, sa: "P.Bhadrapada", zh: "室宿",   lord: "Jupiter" },
  { idx: 25, sa: "U.Bhadrapada", zh: "壁宿",   lord: "Saturn" },
  { idx: 26, sa: "Revati",       zh: "奎宿",   lord: "Mercury" }
];

// 9 曜（Navagraha）
const PLANETS = [
  { key: "Sun",     zh: "太阳", sym: "☉", short: "Su" },
  { key: "Moon",    zh: "月亮", sym: "☽", short: "Mo" },
  { key: "Mars",    zh: "火星", sym: "♂", short: "Ma" },
  { key: "Mercury", zh: "水星", sym: "☿", short: "Me" },
  { key: "Jupiter", zh: "木星", sym: "♃", short: "Ju" },
  { key: "Venus",   zh: "金星", sym: "♀", short: "Ve" },
  { key: "Saturn",  zh: "土星", sym: "♄", short: "Sa" },
  { key: "Rahu",    zh: "罗睺", sym: "☊", short: "Ra" },
  { key: "Ketu",    zh: "计都", sym: "☋", short: "Ke" }
];

// Vimshottari Dasha 周期：总计 120 年
const DASHA_YEARS = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17
};
const DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

// 星宿 → 起运行星（每 3 个星宿循环）
const NAK_TO_DASHA_LORD = [
  "Ketu", "Venus", "Sun",           // 0-2
  "Moon", "Mars", "Rahu",           // 3-5
  "Jupiter", "Saturn", "Mercury",   // 6-8
  "Ketu", "Venus", "Sun",           // 9-11
  "Moon", "Mars", "Rahu",           // 12-14
  "Jupiter", "Saturn", "Mercury",   // 15-17
  "Ketu", "Venus", "Sun",           // 18-20
  "Moon", "Mars", "Rahu",           // 21-23
  "Jupiter", "Saturn", "Mercury"    // 24-26
];

// 合盘 Ashtakoot（八项匹配，总分 36）
const KOOT_MAX = {
  Varna: 1, Vashya: 2, Tara: 3, Yoni: 4,
  Graha: 5, Gana: 6, Bhakoot: 7, Nadi: 8
};

// Yoni（星宿对应的动物，14 种）
const NAK_YONI = [
  "Horse","Elephant","Sheep","Serpent","Serpent","Dog","Cat","Sheep","Cat",
  "Rat","Rat","Cow","Buffalo","Tiger","Buffalo","Tiger","Deer","Deer",
  "Dog","Monkey","Mongoose","Monkey","Lion","Horse","Lion","Cow","Elephant"
];

// Gana（星宿属性：Deva神/Manushya人/Rakshasa罗刹）
const NAK_GANA = [
  "Deva","Manushya","Rakshasa","Manushya","Deva","Manushya","Deva","Deva","Rakshasa",
  "Rakshasa","Manushya","Manushya","Deva","Rakshasa","Deva","Rakshasa","Deva","Rakshasa",
  "Rakshasa","Manushya","Manushya","Deva","Rakshasa","Rakshasa","Manushya","Manushya","Deva"
];

// Nadi（3 种：Adi/Madhya/Antya，循环）
const NAK_NADI = [
  "Adi","Madhya","Antya","Antya","Madhya","Adi","Adi","Madhya","Antya",
  "Antya","Madhya","Adi","Adi","Madhya","Antya","Antya","Madhya","Adi",
  "Adi","Madhya","Antya","Antya","Madhya","Adi","Adi","Madhya","Antya"
];

// Tara（月亮星宿吉凶）
const TARA_TYPES = ["Janma","Sampat","Vipat","Kshema","Pratyak","Sadhaka","Vadha","Mitra","Ati-Mitra"];
const TARA_GOOD = [true, true, false, true, false, true, false, true, true];

// ============================================
// 城市数据库（name, lat, lon, tz）
// 涵盖中国地级市 + 主要县市 + 海外主要城市
// ============================================
const CITIES = [
  // === 直辖市 ===
  ["北京", 39.9042, 116.4074, 8],
  ["上海", 31.2304, 121.4737, 8],
  ["天津", 39.0842, 117.2009, 8],
  ["重庆", 29.5630, 106.5516, 8],

  // === 省会 / 副省级 ===
  ["广州", 23.1291, 113.2644, 8],
  ["深圳", 22.5431, 114.0579, 8],
  ["成都", 30.5728, 104.0668, 8],
  ["杭州", 30.2741, 120.1551, 8],
  ["武汉", 30.5928, 114.3055, 8],
  ["西安", 34.3416, 108.9398, 8],
  ["南京", 32.0603, 118.7969, 8],
  ["苏州", 31.2989, 120.5853, 8],
  ["郑州", 34.7466, 113.6253, 8],
  ["长沙", 28.2282, 112.9388, 8],
  ["青岛", 36.0671, 120.3826, 8],
  ["沈阳", 41.8057, 123.4315, 8],
  ["宁波", 29.8683, 121.5440, 8],
  ["东莞", 23.0207, 113.7518, 8],
  ["无锡", 31.4912, 120.3119, 8],
  ["合肥", 31.8206, 117.2272, 8],
  ["佛山", 23.0218, 113.1215, 8],
  ["济南", 36.6512, 117.1201, 8],
  ["大连", 38.9140, 121.6147, 8],
  ["哈尔滨", 45.8038, 126.5350, 8],
  ["昆明", 24.8801, 102.8329, 8],
  ["福州", 26.0745, 119.2965, 8],
  ["厦门", 24.4798, 118.0819, 8],
  ["太原", 37.8706, 112.5489, 8],
  ["长春", 43.8171, 125.3235, 8],
  ["温州", 27.9939, 120.6993, 8],
  ["石家庄", 38.0428, 114.5149, 8],
  ["南昌", 28.6820, 115.8579, 8],
  ["贵阳", 26.6470, 106.6302, 8],
  ["南宁", 22.8170, 108.3669, 8],
  ["兰州", 36.0611, 103.8343, 8],
  ["乌鲁木齐", 43.8256, 87.6168, 8],
  ["呼和浩特", 40.8428, 111.7490, 8],
  ["银川", 38.4872, 106.2309, 8],
  ["西宁", 36.6232, 101.7804, 8],
  ["拉萨", 29.6500, 91.1000, 8],
  ["海口", 20.0170, 110.3492, 8],

  // === 重要地级市 ===
  ["珠海", 22.2707, 113.5767, 8],
  ["中山", 22.5175, 113.3928, 8],
  ["惠州", 23.1117, 114.4152, 8],
  ["汕头", 23.3535, 116.6820, 8],
  ["江门", 22.5787, 113.0819, 8],
  ["湛江", 21.2707, 110.3594, 8],
  ["泉州", 24.8741, 118.6757, 8],
  ["漳州", 24.5130, 117.6471, 8],
  ["莆田", 25.4540, 119.0077, 8],
  ["三亚", 18.2528, 109.5119, 8],
  ["烟台", 37.4638, 121.4479, 8],
  ["潍坊", 36.7069, 119.1620, 8],
  ["威海", 37.5137, 122.1205, 8],
  ["淄博", 36.8131, 118.0549, 8],
  ["临沂", 35.1045, 118.3564, 8],
  ["常州", 31.8122, 119.9741, 8],
  ["徐州", 34.2618, 117.1887, 8],
  ["南通", 31.9802, 120.8943, 8],
  ["扬州", 32.3947, 119.4142, 8],
  ["盐城", 33.3476, 120.1617, 8],
  ["镇江", 32.2049, 119.4528, 8],
  ["泰州", 32.4849, 119.9229, 8],
  ["绍兴", 30.0300, 120.5800, 8],
  ["金华", 29.0784, 119.6472, 8],
  ["嘉兴", 30.7460, 120.7550, 8],
  ["台州", 28.6562, 121.4208, 8],
  ["湖州", 30.8703, 120.0933, 8],
  ["丽水", 28.4670, 119.9229, 8],
  ["舟山", 29.9853, 122.2072, 8],
  ["衢州", 28.9417, 118.8718, 8],
  ["芜湖", 31.3526, 118.4330, 8],
  ["蚌埠", 32.9164, 117.3890, 8],
  ["安庆", 30.5088, 117.0490, 8],
  ["洛阳", 34.6197, 112.4540, 8],
  ["开封", 34.7973, 114.3071, 8],
  ["南阳", 32.9908, 112.5283, 8],
  ["宜昌", 30.7020, 111.2865, 8],
  ["襄阳", 32.0091, 112.1226, 8],
  ["株洲", 27.8279, 113.1511, 8],
  ["湘潭", 27.8293, 112.9445, 8],
  ["衡阳", 26.8943, 112.5722, 8],
  ["岳阳", 29.3570, 113.1289, 8],
  ["桂林", 25.2736, 110.2907, 8],
  ["柳州", 24.3263, 109.4284, 8],
  ["北海", 21.4733, 109.1195, 8],
  ["绵阳", 31.4678, 104.6795, 8],
  ["宜宾", 28.7603, 104.6396, 8],
  ["德阳", 31.1277, 104.3980, 8],
  ["遵义", 27.7066, 106.9377, 8],
  ["曲靖", 25.4900, 103.7961, 8],
  ["大理", 25.6065, 100.2679, 8],
  ["丽江", 26.8721, 100.2299, 8],
  ["鄂尔多斯", 39.6086, 109.7814, 8],
  ["包头", 40.6574, 109.8404, 8],
  ["秦皇岛", 39.9354, 119.6005, 8],
  ["唐山", 39.6306, 118.1800, 8],
  ["保定", 38.8671, 115.4842, 8],
  ["廊坊", 39.5369, 116.6834, 8],
  ["邯郸", 36.6253, 114.5390, 8],
  ["大同", 40.0903, 113.3000, 8],
  ["吉林", 43.8436, 126.5498, 8],
  ["鞍山", 41.1088, 122.9946, 8],

  // === 港澳台 ===
  ["香港", 22.3193, 114.1694, 8],
  ["澳门", 22.1987, 113.5439, 8],
  ["台北", 25.0330, 121.5654, 8],
  ["高雄", 22.6273, 120.3014, 8],
  ["台中", 24.1477, 120.6736, 8],
  ["台南", 22.9999, 120.2270, 8],

  // === 海外主要城市 ===
  ["东京", 35.6762, 139.6503, 9],
  ["大阪", 34.6937, 135.5023, 9],
  ["首尔", 37.5665, 126.9780, 9],
  ["新加坡", 1.3521, 103.8198, 8],
  ["曼谷", 13.7563, 100.5018, 7],
  ["吉隆坡", 3.1390, 101.6869, 8],
  ["雅加达", -6.2088, 106.8456, 7],
  ["马尼拉", 14.5995, 120.9842, 8],
  ["胡志明市", 10.8231, 106.6297, 7],
  ["河内", 21.0285, 105.8542, 7],
  ["迪拜", 25.2048, 55.2708, 4],
  ["孟买", 19.0760, 72.8777, 5.5],
  ["新德里", 28.6139, 77.2090, 5.5],
  ["加尔各答", 22.5726, 88.3639, 5.5],
  ["伦敦", 51.5074, -0.1278, 0],
  ["巴黎", 48.8566, 2.3522, 1],
  ["柏林", 52.5200, 13.4050, 1],
  ["罗马", 41.9028, 12.4964, 1],
  ["马德里", 40.4168, -3.7038, 1],
  ["莫斯科", 55.7558, 37.6173, 3],
  ["伊斯坦布尔", 41.0082, 28.9784, 3],
  ["纽约", 40.7128, -74.0060, -5],
  ["洛杉矶", 34.0522, -118.2437, -8],
  ["旧金山", 37.7749, -122.4194, -8],
  ["芝加哥", 41.8781, -87.6298, -6],
  ["西雅图", 47.6062, -122.3321, -8],
  ["波士顿", 42.3601, -71.0589, -5],
  ["华盛顿", 38.9072, -77.0369, -5],
  ["温哥华", 49.2827, -123.1207, -8],
  ["多伦多", 43.6532, -79.3832, -5],
  ["悉尼", -33.8688, 151.2093, 10],
  ["墨尔本", -37.8136, 144.9631, 10],
  ["奥克兰", -36.8485, 174.7633, 12]
];

// 城市查找（支持模糊匹配：输入"深圳"、"深"、"shenzhen" 都能匹配）
function findCity(query) {
  if (!query) return null;
  const q = query.trim().toLowerCase();
  // 精确匹配优先
  for (const c of CITIES) {
    if (c[0] === query.trim()) return c;
  }
  // 前缀匹配
  for (const c of CITIES) {
    if (c[0].startsWith(query.trim())) return c;
  }
  // 包含匹配
  for (const c of CITIES) {
    if (c[0].includes(query.trim())) return c;
  }
  return null;
}

// 模糊搜索（返回多个匹配，用于下拉提示）
function searchCities(query, limit = 8) {
  if (!query) return [];
  const q = query.trim();
  const results = [];
  for (const c of CITIES) {
    if (c[0].startsWith(q)) results.push(c);
    if (results.length >= limit) return results;
  }
  for (const c of CITIES) {
    if (!c[0].startsWith(q) && c[0].includes(q)) results.push(c);
    if (results.length >= limit) return results;
  }
  return results;
}
