// ==============================================
// 北印度星盘（菱形 + 四个三角形，12 宫）
// ==============================================

function drawNorthIndianChart(canvas, chart) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // 背景
  ctx.fillStyle = "#181b21";
  ctx.fillRect(0, 0, W, H);

  const pad = 30;
  const size = Math.min(W, H) - pad * 2;
  const x0 = (W - size) / 2, y0 = (H - size) / 2;
  const cx = W / 2, cy = H / 2;
  const mid = size / 2;

  // 金色描边
  ctx.strokeStyle = "#c9a96e";
  ctx.lineWidth = 1.5;

  // 外框正方形
  ctx.strokeRect(x0, y0, size, size);
  // 两条对角线
  ctx.beginPath();
  ctx.moveTo(x0, y0); ctx.lineTo(x0 + size, y0 + size);
  ctx.moveTo(x0 + size, y0); ctx.lineTo(x0, y0 + size);
  ctx.stroke();
  // 内部菱形（四边中点相连）
  ctx.beginPath();
  ctx.moveTo(cx, y0);
  ctx.lineTo(x0 + size, cy);
  ctx.lineTo(cx, y0 + size);
  ctx.lineTo(x0, cy);
  ctx.closePath();
  ctx.stroke();

  // 12 宫中心坐标 + 顺序（北印度标准：上中为 1 宫=上升，逆时针）
  // 宫位号 1 在顶部中央，2 在左上三角，3 在左中，4 在左中央（菱形左角），5 在左下，6 在下左三角，
  // 7 在底部中央（菱形下角），8 在下右三角，9 在右下，10 在右中央（菱形右角），11 在右上，12 在上右三角
  const q = size / 4;
  const positions = [
    { h: 1,  x: cx,         y: y0 + q * 0.9 },       // 顶部中央
    { h: 2,  x: x0 + q,     y: y0 + q * 0.5 },       // 上左三角
    { h: 3,  x: x0 + q * 0.5, y: y0 + q },            // 左上三角
    { h: 4,  x: x0 + q * 0.9, y: cy },                // 左中央（菱形左角）
    { h: 5,  x: x0 + q * 0.5, y: y0 + size - q },     // 左下三角
    { h: 6,  x: x0 + q,     y: y0 + size - q * 0.5 }, // 下左三角
    { h: 7,  x: cx,         y: y0 + size - q * 0.9 }, // 底部中央
    { h: 8,  x: x0 + size - q, y: y0 + size - q * 0.5 },
    { h: 9,  x: x0 + size - q * 0.5, y: y0 + size - q },
    { h: 10, x: x0 + size - q * 0.9, y: cy },
    { h: 11, x: x0 + size - q * 0.5, y: y0 + q },
    { h: 12, x: x0 + size - q,     y: y0 + q * 0.5 }
  ];

  // 计算每宫所在星座（从上升宫开始）
  const ascRashi = chart.ascRashi;
  const housesRashi = [];
  for (let i = 0; i < 12; i++) {
    housesRashi.push((ascRashi + i) % 12);
  }

  // 整理每宫行星
  const housesPlanets = Array.from({ length: 12 }, () => []);
  for (const key of Object.keys(chart.planets)) {
    const p = chart.planets[key];
    housesPlanets[p.house - 1].push(p);
  }
  // 上升也标记到 1 宫
  const ascMark = { short: "As", key: "Asc" };

  // 文字渲染
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const pos of positions) {
    const h = pos.h;
    const rashiIdx = housesRashi[h - 1];
    const rashi = RASHIS[rashiIdx];

    // 宫位号（角标，浅色）
    ctx.fillStyle = "#5a5f6a";
    ctx.font = "11px -apple-system, 'PingFang SC', sans-serif";
    ctx.fillText(String(h), pos.x, pos.y - 36);

    // 星座缩写（金色 serif）
    ctx.fillStyle = "#c9a96e";
    ctx.font = "italic 12px Georgia, 'Songti SC', serif";
    ctx.fillText(rashi.en.substring(0, 3), pos.x, pos.y - 20);

    // 行星列表
    const planets = [...housesPlanets[h - 1]];
    if (h === 1) planets.unshift(ascMark);

    ctx.fillStyle = "#e8c98a";
    ctx.font = "bold 13px -apple-system, 'PingFang SC', sans-serif";
    if (planets.length === 0) {
      // 空宫
    } else if (planets.length <= 3) {
      // 单行
      const text = planets.map(p => p.short).join("  ");
      ctx.fillText(text, pos.x, pos.y + 4);
    } else {
      // 多行
      const line1 = planets.slice(0, Math.ceil(planets.length / 2)).map(p => p.short).join("  ");
      const line2 = planets.slice(Math.ceil(planets.length / 2)).map(p => p.short).join("  ");
      ctx.fillText(line1, pos.x, pos.y - 2);
      ctx.fillText(line2, pos.x, pos.y + 14);
    }
  }

  // 中心装饰
  ctx.fillStyle = "#c9a96e";
  ctx.font = "italic 10px Georgia, serif";
  ctx.fillText("VEDIC", cx, cy - 6);
  ctx.fillStyle = "#8a8f9a";
  ctx.font = "9px -apple-system, sans-serif";
  ctx.fillText("North Indian", cx, cy + 8);
}
