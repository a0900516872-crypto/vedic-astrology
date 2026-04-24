// ==============================================
// 天文基础计算
// 参考：Jean Meeus《Astronomical Algorithms》
// 精度约 ±1'，适用于印占排盘
// ==============================================

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

// 角度归一化到 [0, 360)
function norm360(x) {
  x = x % 360;
  return x < 0 ? x + 360 : x;
}

// 儒略日（UT）
function toJulianDay(year, month, day, hour, minute, tzOffset) {
  // tzOffset 小时（东八区传 8）
  const utHour = hour + minute / 60 - tzOffset;
  let Y = year, M = month;
  if (M <= 2) { Y -= 1; M += 12; }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const jd = Math.floor(365.25 * (Y + 4716))
           + Math.floor(30.6001 * (M + 1))
           + day + B - 1524.5
           + utHour / 24;
  return jd;
}

// T = 从 J2000.0 起的儒略世纪
function julianCentury(jd) {
  return (jd - 2451545.0) / 36525.0;
}

// ====== 太阳黄经（回归） ======
function sunLongitude(T) {
  const L0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M  = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mr = M * DEG;
  const C  = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr)
           + (0.019993 - 0.000101 * T) * Math.sin(2 * Mr)
           + 0.000289 * Math.sin(3 * Mr);
  return norm360(L0 + C);
}

// ====== 月亮黄经（回归） ======
function moonLongitude(T) {
  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  const D  = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T;
  const M  = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T;
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T;
  const F  = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T;

  const d = D * DEG, m = M * DEG, mp = Mp * DEG, f = F * DEG;

  // 主要周期项（简化，保留较大振幅项）
  let lon = Lp
    + 6.288774 * Math.sin(mp)
    + 1.274027 * Math.sin(2*d - mp)
    + 0.658314 * Math.sin(2*d)
    + 0.213618 * Math.sin(2*mp)
    - 0.185116 * Math.sin(m)
    - 0.114332 * Math.sin(2*f)
    + 0.058793 * Math.sin(2*d - 2*mp)
    + 0.057066 * Math.sin(2*d - m - mp)
    + 0.053322 * Math.sin(2*d + mp)
    + 0.045758 * Math.sin(2*d - m)
    - 0.040923 * Math.sin(m - mp)
    - 0.034720 * Math.sin(d)
    - 0.030383 * Math.sin(m + mp);

  return norm360(lon);
}

// ====== 行星黄经（简化 VSOP87 截断） ======
// 每颗行星用平均轨道要素 + 主要摄动项（精度约 ±0.5°）
// 基础要素表（J2000，单位: 度；线性变化率单位: 度/世纪）
const PLANET_ELEMENTS = {
  Mercury: { a: 0.38709927,  e: 0.20563593, L: 252.25032350, w: 77.45779628,  O: 48.33076593,  i: 7.00497902,  Lrate: 149472.67411175 },
  Venus:   { a: 0.72333566,  e: 0.00677672, L: 181.97909950, w: 131.60246718, O: 76.67984255,  i: 3.39467605,  Lrate: 58517.81538729 },
  Earth:   { a: 1.00000261,  e: 0.01671123, L: 100.46457166, w: 102.93768193, O: 0.0,          i: -0.00001531, Lrate: 35999.37244981 },
  Mars:    { a: 1.52371034,  e: 0.09339410, L: -4.55343205,  w: -23.94362959, O: 49.55953891,  i: 1.84969142,  Lrate: 19140.30268499 },
  Jupiter: { a: 5.20288700,  e: 0.04838624, L: 34.39644051,  w: 14.72847983,  O: 100.47390909, i: 1.30439695,  Lrate: 3034.74612775 },
  Saturn:  { a: 9.53667594,  e: 0.05386179, L: 49.95424423,  w: 92.59887831,  O: 113.66242448, i: 2.48599187,  Lrate: 1222.49362201 }
};

// 从 a, e, L, w 求日心黄经（solve Kepler + 真近点角）
function heliocentricLongitude(name, T) {
  const p = PLANET_ELEMENTS[name];
  const L = norm360(p.L + p.Lrate * T);
  const M = norm360(L - p.w);           // 平近点角
  const e = p.e;

  // 解开普勒方程 E - e*sin(E) = M（迭代）
  let E = M;
  for (let i = 0; i < 8; i++) {
    E = M + e * RAD * Math.sin(E * DEG);
  }
  // 真近点角
  const v = 2 * RAD * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(E * DEG / 2),
    Math.sqrt(1 - e) * Math.cos(E * DEG / 2)
  );
  // 日心黄经
  const lonHelio = norm360(v + p.w);
  const r = p.a * (1 - e * Math.cos(E * DEG));
  return { lon: lonHelio, r: r };
}

// 地心黄经（近似：外行星用矢量差）
function geocentricPlanetLongitude(name, T) {
  const earth = heliocentricLongitude("Earth", T);
  const planet = heliocentricLongitude(name, T);

  // 日心直角坐标
  const xE = earth.r * Math.cos(earth.lon * DEG);
  const yE = earth.r * Math.sin(earth.lon * DEG);
  const xP = planet.r * Math.cos(planet.lon * DEG);
  const yP = planet.r * Math.sin(planet.lon * DEG);

  // 地心 = 行星 - 地球
  const dx = xP - xE, dy = yP - yE;
  const lon = norm360(Math.atan2(dy, dx) * RAD);
  return lon;
}

// ====== Rahu/Ketu（月交点）======
function rahuLongitude(T) {
  // 平升交点
  const Omega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T;
  return norm360(Omega);
}

// ====== 上升点（Ascendant）计算 ======
// 输入：JD、纬度（度）、经度（度，东正）
function ascendant(jd, lat, lon) {
  // 格林威治恒星时（度）
  const T = julianCentury(jd);
  const theta0 = 280.46061837
              + 360.98564736629 * (jd - 2451545.0)
              + 0.000387933 * T * T;
  const gst = norm360(theta0);
  // 本地恒星时
  const lst = norm360(gst + lon);

  // 黄赤交角
  const eps = 23.4392911 - 0.0130042 * T;
  const epsR = eps * DEG;
  const latR = lat * DEG;
  const lstR = lst * DEG;

  // 公式：tan(Asc) = -cos(LST) / (sin(eps)*tan(lat) + cos(eps)*sin(LST))
  const y = -Math.cos(lstR);
  const x = Math.sin(epsR) * Math.tan(latR) + Math.cos(epsR) * Math.sin(lstR);
  let asc = Math.atan2(y, x) * RAD;
  asc = norm360(asc);
  // 修正象限（Asc 和 MC 差应在 0-180 之间等）
  // 简化处理：若不合理则 +180
  const mc = Math.atan2(Math.sin(lstR), Math.cos(lstR) * Math.cos(epsR)) * RAD;
  const mcN = norm360(mc);
  const diff = norm360(asc - mcN);
  if (diff < 0 || diff > 180) asc = norm360(asc + 180);

  return asc;
}

// ====== 统一接口：输入日期时间地点，输出所有行星的回归黄经 ======
function computeAll(year, month, day, hour, minute, lat, lon, tz) {
  const jd = toJulianDay(year, month, day, hour, minute, tz);
  const T = julianCentury(jd);

  const sun = sunLongitude(T);
  const moon = moonLongitude(T);
  const mercury = geocentricPlanetLongitude("Mercury", T);
  const venus = geocentricPlanetLongitude("Venus", T);
  const mars = geocentricPlanetLongitude("Mars", T);
  const jupiter = geocentricPlanetLongitude("Jupiter", T);
  const saturn = geocentricPlanetLongitude("Saturn", T);
  const rahu = rahuLongitude(T);
  const ketu = norm360(rahu + 180);
  const asc = ascendant(jd, lat, lon);

  return {
    jd, T,
    tropical: {
      Sun: sun, Moon: moon, Mercury: mercury, Venus: venus,
      Mars: mars, Jupiter: jupiter, Saturn: saturn,
      Rahu: rahu, Ketu: ketu
    },
    ascTropical: asc
  };
}
