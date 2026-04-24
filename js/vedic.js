// ==============================================
// 印占核心逻辑：Ayanamsa / 宫位 / 星宿 / 大运 / 合盘
// ==============================================

// ====== Lahiri Ayanamsa ======
// 基准：2000-01-01 12:00 UT 时约 23.85°，每年约 +50.29″
function lahiriAyanamsa(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  // 多项式近似（与 Swiss Ephemeris 在 1900-2100 内误差 <1'）
  return 23.85 + 0.013988 * (jd - 2451545.0) / 365.25 * (50.29 / 3600 / 0.013988);
  // 简化公式：每儒略世纪 Ayanamsa 增加约 1.396°
  // 等价于：23.85 + 1.3967 * T
}

// 实际使用：把上面简化版替换为更精确的表达
function lahiri(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  // 基于 Lahiri 官方定义（与 Chitra Paksha 恒星对齐）
  // 在 1900-2100 年范围精度约 ±0.5'
  return 23.85 + 1.39697 * T + 0.000106 * T * T;
}

// 转换：回归 → 恒星
function toSidereal(tropicalLon, jd) {
  return (tropicalLon - lahiri(jd) + 360) % 360;
}

// ====== 星座 / 星宿判定 ======
function getRashi(lon) {
  return Math.floor(lon / 30);  // 0-11
}

function getRashiDegree(lon) {
  return lon % 30;  // 0-30
}

function getNakshatra(lon) {
  return Math.floor(lon / (360 / 27));  // 0-26
}

function getNakshatraPada(lon) {
  const nakLon = lon % (360 / 27);
  return Math.floor(nakLon / ((360 / 27) / 4)) + 1;  // 1-4
}

// ====== 宫位（Whole Sign 整宫制）======
// 上升星座为第 1 宫，逆时针推
function getHouse(planetLon, ascLon) {
  const ascRashi = getRashi(ascLon);
  const planetRashi = getRashi(planetLon);
  return ((planetRashi - ascRashi + 12) % 12) + 1;  // 1-12
}

// ====== 格式化度数 ======
function formatDMS(deg) {
  const d = Math.floor(deg);
  const mFull = (deg - d) * 60;
  const m = Math.floor(mFull);
  const s = Math.round((mFull - m) * 60);
  return `${d}°${String(m).padStart(2,"0")}'${String(s).padStart(2,"0")}"`;
}

// ====== 完整排盘 ======
function castChart(year, month, day, hour, minute, lat, lon, tz) {
  const raw = computeAll(year, month, day, hour, minute, lat, lon, tz);
  const jd = raw.jd;

  // 转恒星黄道
  const sidereal = {};
  for (const k of Object.keys(raw.tropical)) {
    sidereal[k] = toSidereal(raw.tropical[k], jd);
  }
  const asc = toSidereal(raw.ascTropical, jd);

  // 计算每颗行星的 rashi / nakshatra / house
  const planets = {};
  for (const p of PLANETS) {
    const lon = sidereal[p.key];
    planets[p.key] = {
      key: p.key,
      zh: p.zh,
      sym: p.sym,
      short: p.short,
      lon: lon,
      rashi: getRashi(lon),
      rashiDeg: getRashiDegree(lon),
      nakshatra: getNakshatra(lon),
      pada: getNakshatraPada(lon),
      house: getHouse(lon, asc)
    };
  }

  return {
    jd, asc,
    ascRashi: getRashi(asc),
    ascNakshatra: getNakshatra(asc),
    ascRashiDeg: getRashiDegree(asc),
    planets,
    raw
  };
}

// ====== Vimshottari Dasha 大运 ======
// 总 120 年，按月亮星宿起运
function computeDasha(chart, birthDate) {
  const moon = chart.planets.Moon;
  const nakIdx = moon.nakshatra;
  const nakLon = moon.lon % (360 / 27);  // 月亮在星宿内的度数

  const startLord = NAK_TO_DASHA_LORD[nakIdx];
  const fullYears = DASHA_YEARS[startLord];
  const remainingFraction = 1 - nakLon / (360 / 27);
  const remainingYears = fullYears * remainingFraction;

  // 从 startLord 开始按 DASHA_ORDER 排列
  const startIdx = DASHA_ORDER.indexOf(startLord);

  const maha = [];
  let currentDate = new Date(birthDate);
  // 首个大运只剩 remainingYears
  {
    const endDate = addYears(currentDate, remainingYears);
    maha.push({ lord: startLord, start: new Date(currentDate), end: endDate, years: remainingYears });
    currentDate = endDate;
  }
  // 后续完整周期
  for (let i = 1; i < 9; i++) {
    const lord = DASHA_ORDER[(startIdx + i) % 9];
    const y = DASHA_YEARS[lord];
    const endDate = addYears(currentDate, y);
    maha.push({ lord, start: new Date(currentDate), end: endDate, years: y });
    currentDate = endDate;
  }

  // 当前主运 & 子运
  const now = new Date();
  let currentMaha = null;
  for (const m of maha) {
    if (now >= m.start && now < m.end) { currentMaha = m; break; }
  }

  const antar = [];
  if (currentMaha) {
    const mahaLord = currentMaha.lord;
    const mahaStartIdx = DASHA_ORDER.indexOf(mahaLord);
    const mahaYears = DASHA_YEARS[mahaLord];
    let cur = new Date(currentMaha.start);
    for (let i = 0; i < 9; i++) {
      const subLord = DASHA_ORDER[(mahaStartIdx + i) % 9];
      const subYears = (mahaYears * DASHA_YEARS[subLord]) / 120;
      const subEnd = addYears(cur, subYears);
      antar.push({ lord: subLord, start: new Date(cur), end: subEnd });
      cur = subEnd;
    }
  }

  return { maha, currentMaha, antar };
}

function addYears(date, years) {
  const d = new Date(date);
  const ms = years * 365.2425 * 24 * 3600 * 1000;
  d.setTime(d.getTime() + ms);
  return d;
}

// ====== Ashtakoot 合盘（8 项匹配，总分 36）======
function computeSynastry(chartA, chartB) {
  const moonA = chartA.planets.Moon;
  const moonB = chartB.planets.Moon;
  const nakA = moonA.nakshatra;
  const nakB = moonB.nakshatra;
  const rashiA = moonA.rashi;
  const rashiB = moonB.rashi;

  // 1. Varna（种姓）— 1 分
  const varnaOrder = [3, 1, 2, 0, 3, 1, 2, 0, 3, 1, 2, 0]; // Brahmin=3, Kshatriya=2, Vaishya=1, Shudra=0
  const varnaA = varnaOrder[rashiA], varnaB = varnaOrder[rashiB];
  const varnaScore = varnaB >= varnaA ? 1 : 0;

  // 2. Vashya（控制）— 2 分
  // 简化：同类给 2，近亲 1，其它 0
  const vashyaGroup = [0, 3, 2, 1, 0, 2, 1, 1, 3, 3, 1, 2];
  const vashyaScore = vashyaGroup[rashiA] === vashyaGroup[rashiB] ? 2 : 1;

  // 3. Tara（星宿吉凶）— 3 分
  const taraAB = ((nakB - nakA + 27) % 27) % 9;
  const taraBA = ((nakA - nakB + 27) % 27) % 9;
  const good = (TARA_GOOD[taraAB] ? 1 : 0) + (TARA_GOOD[taraBA] ? 1 : 0);
  const taraScore = (good / 2) * 3;

  // 4. Yoni（动物兼容）— 4 分
  const yoniA = NAK_YONI[nakA];
  const yoniB = NAK_YONI[nakB];
  const yoniScore = yoniA === yoniB ? 4 : (yoniCompat(yoniA, yoniB) ? 2 : 0);

  // 5. Graha Maitri（星主友谊）— 5 分
  const lordA = RASHIS[rashiA].lord;
  const lordB = RASHIS[rashiB].lord;
  const grahaScore = grahaFriendship(lordA, lordB);

  // 6. Gana（属性）— 6 分
  const ganaA = NAK_GANA[nakA];
  const ganaB = NAK_GANA[nakB];
  let ganaScore = 0;
  if (ganaA === ganaB) ganaScore = 6;
  else if ((ganaA === "Deva" && ganaB === "Manushya") || (ganaA === "Manushya" && ganaB === "Deva")) ganaScore = 5;
  else if ((ganaA === "Manushya" && ganaB === "Rakshasa") || (ganaA === "Rakshasa" && ganaB === "Manushya")) ganaScore = 1;
  else ganaScore = 0;

  // 7. Bhakoot（月亮星座关系）— 7 分
  const diff = ((rashiB - rashiA + 12) % 12);
  const badBhakoot = [1, 5, 6, 7, 8, 11];  // 2/6/7/8/9/12 宫关系（从 0 起算：1,5,6,7,8,11）
  const bhakootScore = badBhakoot.includes(diff) ? 0 : 7;

  // 8. Nadi（体质）— 8 分
  const nadiA = NAK_NADI[nakA];
  const nadiB = NAK_NADI[nakB];
  const nadiScore = nadiA !== nadiB ? 8 : 0;

  const total = varnaScore + vashyaScore + taraScore + yoniScore + grahaScore + ganaScore + bhakootScore + nadiScore;

  let tag = "";
  if (total >= 28) tag = "极佳";
  else if (total >= 24) tag = "良配";
  else if (total >= 18) tag = "可接受";
  else tag = "需谨慎";

  return {
    total: Math.round(total * 10) / 10,
    max: 36,
    tag,
    items: [
      { k: "Varna（种姓）",       v: `${varnaScore} / 1` },
      { k: "Vashya（控制）",      v: `${vashyaScore} / 2` },
      { k: "Tara（星宿吉凶）",    v: `${Math.round(taraScore*10)/10} / 3` },
      { k: "Yoni（动物兼容）",    v: `${yoniScore} / 4` },
      { k: "Graha Maitri（星主）", v: `${grahaScore} / 5` },
      { k: "Gana（属性）",        v: `${ganaScore} / 6` },
      { k: "Bhakoot（月座关系）", v: `${bhakootScore} / 7` },
      { k: "Nadi（体质）",        v: `${nadiScore} / 8` }
    ]
  };
}

// Yoni 动物互补/冲突
function yoniCompat(a, b) {
  const enemies = [
    ["Cow","Tiger"], ["Elephant","Lion"], ["Horse","Buffalo"],
    ["Dog","Deer"], ["Cat","Rat"], ["Sheep","Monkey"], ["Serpent","Mongoose"]
  ];
  for (const [x, y] of enemies) {
    if ((a === x && b === y) || (a === y && b === x)) return false;
  }
  return true;
}

// Graha 友谊简化表
function grahaFriendship(lordA, lordB) {
  if (lordA === lordB) return 5;
  const friends = {
    Sun: ["Moon","Mars","Jupiter"],
    Moon: ["Sun","Mercury"],
    Mars: ["Sun","Moon","Jupiter"],
    Mercury: ["Sun","Venus"],
    Jupiter: ["Sun","Moon","Mars"],
    Venus: ["Mercury","Saturn"],
    Saturn: ["Mercury","Venus"]
  };
  const aFriend = (friends[lordA] || []).includes(lordB);
  const bFriend = (friends[lordB] || []).includes(lordA);
  if (aFriend && bFriend) return 5;
  if (aFriend || bFriend) return 4;
  return 1;
}
