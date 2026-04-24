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
