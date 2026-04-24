// ==============================================
// 主逻辑：表单 → 计算 → 渲染
// ==============================================

let currentChart = null;

// ====== 标签切换 ======
document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("panel-" + btn.dataset.tab).classList.add("active");
    // 切到大运时刷新
    if (btn.dataset.tab === "dasha" && currentChart) {
      renderDasha();
    }
  });
});

// ====== 城市 autocomplete ======
// prefix: "s" / "a" / "b"；showCoord: 是否在 meta 里显示经纬度
function bindCityAutocomplete(prefix, showCoord = false) {
  const input = document.getElementById(prefix + "-city");
  const box = document.getElementById(prefix + "-city-suggest");
  const meta = document.getElementById(prefix + "-city-meta");
  const latEl = document.getElementById(prefix + "-lat");
  const lonEl = document.getElementById(prefix + "-lon");
  const tzEl = document.getElementById(prefix + "-tz");
  if (!input || !box) return;

  let activeIdx = -1;
  let currentList = [];

  function applyCity(c) {
    latEl.value = c[1];
    lonEl.value = c[2];
    tzEl.value = c[3];
    input.value = c[0];
    const tzStr = (c[3] >= 0 ? "+" : "") + c[3];
    meta.textContent = showCoord
      ? `${c[0]} · ${c[1].toFixed(2)}°${c[1]>=0?"N":"S"}, ${Math.abs(c[2]).toFixed(2)}°${c[2]>=0?"E":"W"} · UTC${tzStr}`
      : `${c[0]} · UTC${tzStr}`;
    box.classList.remove("show");
    activeIdx = -1;
  }

  function render(list) {
    currentList = list;
    if (list.length === 0) { box.classList.remove("show"); return; }
    box.innerHTML = list.map((c, i) => {
      const tzStr = (c[3] >= 0 ? "+" : "") + c[3];
      return `<div class="city-suggest-item${i === activeIdx ? " active" : ""}" data-idx="${i}">
        <span>${c[0]}</span>
        <span class="coord">UTC${tzStr}</span>
      </div>`;
    }).join("");
    box.classList.add("show");
    box.querySelectorAll(".city-suggest-item").forEach(el => {
      el.addEventListener("mousedown", (e) => {
        e.preventDefault();
        applyCity(currentList[+el.dataset.idx]);
      });
    });
  }

  input.addEventListener("input", () => {
    const q = input.value.trim();
    if (!q) { box.classList.remove("show"); return; }
    render(searchCities(q, 8));
  });

  input.addEventListener("focus", () => {
    if (input.value.trim()) render(searchCities(input.value.trim(), 8));
  });

  input.addEventListener("blur", () => {
    setTimeout(() => {
      box.classList.remove("show");
      const c = findCity(input.value);
      if (c) applyCity(c);
    }, 150);
  });

  input.addEventListener("keydown", (e) => {
    if (!box.classList.contains("show")) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIdx = Math.min(activeIdx + 1, currentList.length - 1);
      render(currentList);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIdx = Math.max(activeIdx - 1, 0);
      render(currentList);
    } else if (e.key === "Enter") {
      if (activeIdx >= 0) {
        e.preventDefault();
        applyCity(currentList[activeIdx]);
      }
    } else if (e.key === "Escape") {
      box.classList.remove("show");
    }
  });

  // 手动修改高级经纬度时，清空 meta 提示
  [latEl, lonEl, tzEl].forEach(el => {
    if (el && el.type !== "hidden") {
      el.addEventListener("input", () => {
        meta.textContent = `自定义 · ${latEl.value}°, ${lonEl.value}° · UTC${tzEl.value}`;
      });
    }
  });
}

bindCityAutocomplete("s", true);
bindCityAutocomplete("a", false);
bindCityAutocomplete("b", false);

// ====== 本命盘表单 ======
document.getElementById("form-single").addEventListener("submit", (e) => {
  e.preventDefault();
  const date = document.getElementById("s-date").value;
  const time = document.getElementById("s-time").value;
  const lat = parseFloat(document.getElementById("s-lat").value);
  const lon = parseFloat(document.getElementById("s-lon").value);
  const tz = parseFloat(document.getElementById("s-tz").value);
  const name = document.getElementById("s-name").value || "";

  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);

  const chart = castChart(y, m, d, hh, mm, lat, lon, tz);
  currentChart = { chart, birthDate: new Date(y, m - 1, d, hh, mm), name };

  renderSingle(currentChart);
});

// ====== 合盘表单 ======
document.getElementById("form-synastry").addEventListener("submit", (e) => {
  e.preventDefault();
  const A = readPerson("a");
  const B = readPerson("b");
  const chartA = castChart(A.y, A.m, A.d, A.hh, A.mm, A.lat, A.lon, A.tz);
  const chartB = castChart(B.y, B.m, B.d, B.hh, B.mm, B.lat, B.lon, B.tz);
  const result = computeSynastry(chartA, chartB);
  renderSynastry(result, A.name, B.name, chartA, chartB);
});

function readPerson(prefix) {
  const date = document.getElementById(prefix + "-date").value;
  const time = document.getElementById(prefix + "-time").value;
  const lat = parseFloat(document.getElementById(prefix + "-lat").value);
  const lon = parseFloat(document.getElementById(prefix + "-lon").value);
  const tz = parseFloat(document.getElementById(prefix + "-tz").value);
  const name = document.getElementById(prefix + "-name").value || prefix.toUpperCase();
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return { y, m, d, hh, mm, lat, lon, tz, name };
}

// ====== 渲染：本命盘 ======
function renderSingle({ chart, birthDate, name }) {
  // 顶部标题
  document.getElementById("chart-name").textContent = name ? "· " + name : "";

  // 星盘图
  drawNorthIndianChart(document.getElementById("chart-canvas"), chart);

  // 核心信息
  const ascR = RASHIS[chart.ascRashi];
  const moon = chart.planets.Moon;
  const sun = chart.planets.Sun;
  const moonNak = NAKSHATRAS[moon.nakshatra];
  const moonR = RASHIS[moon.rashi];
  const sunR = RASHIS[sun.rashi];

  setText("sum-asc", `${ascR.zh} ${ascR.sa}`);
  setText("sum-moon", `${moonR.zh} ${moonR.sa}`);
  setText("sum-sun", `${sunR.zh} ${sunR.sa}`);
  setText("sum-nak", `${moonNak.zh} ${moonNak.sa} (Pada ${moon.pada})`);
  setText("sum-lord", ascR.lord);
  setText("sum-naklord", moonNak.lord);

  // 行星表
  const tbody = document.getElementById("planet-rows");
  tbody.innerHTML = "";
  for (const p of PLANETS) {
    const pd = chart.planets[p.key];
    const r = RASHIS[pd.rashi];
    const n = NAKSHATRAS[pd.nakshatra];
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="accent">${p.sym} ${p.zh}</td>
      <td>${r.zh} ${r.sa}</td>
      <td>${formatDMS(pd.rashiDeg)}</td>
      <td>${pd.house}</td>
      <td>${n.zh} ${n.sa}/${pd.pada}</td>
      <td>${n.lord}</td>
    `;
    tbody.appendChild(tr);
  }
}

// ====== 渲染：大运 ======
function renderDasha() {
  if (!currentChart) return;
  const { chart, birthDate } = currentChart;
  const { maha, currentMaha, antar } = computeDasha(chart, birthDate);

  const mahaBody = document.getElementById("dasha-maha");
  mahaBody.innerHTML = "";
  for (const m of maha) {
    const isCurrent = currentMaha && m.start.getTime() === currentMaha.start.getTime();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="${isCurrent ? 'accent' : ''}">${m.lord}${isCurrent ? ' ◆' : ''}</td>
      <td>${fmtDate(m.start)}</td>
      <td>${fmtDate(m.end)}</td>
      <td>${m.years.toFixed(1)}</td>
    `;
    mahaBody.appendChild(tr);
  }

  const antarBody = document.getElementById("dasha-antar");
  antarBody.innerHTML = "";
  const now = new Date();
  for (const a of antar) {
    const isCurrent = now >= a.start && now < a.end;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="${isCurrent ? 'accent' : ''}">${a.lord}${isCurrent ? ' ◆' : ''}</td>
      <td>${fmtDate(a.start)}</td>
      <td>${fmtDate(a.end)}</td>
    `;
    antarBody.appendChild(tr);
  }
}

// ====== 渲染：合盘 ======
function renderSynastry(result, nameA, nameB, chartA, chartB) {
  const html = `
    <div class="syn-score">
      <div><span class="num">${result.total}</span><span class="unit">/ ${result.max}</span></div>
      <div class="tag">${result.tag}</div>
      <div class="muted" style="margin-top:8px;font-size:0.85rem;">${nameA} × ${nameB}</div>
    </div>
    ${result.items.map(it => `<div class="syn-item"><span class="k">${it.k}</span><span class="v">${it.v}</span></div>`).join("")}
    <div class="syn-note">
      <strong>参考说明：</strong>Ashtakoot 八项合盘总分 36，印度传统婚姻合盘通常以 18 分为及格线、24 分以上为良配。
      其中 Nadi（体质）最重，若同 Nadi 则 0 分，传统上认为应慎重考虑。本结果仅基于月亮星宿计算，完整合盘还应参考行星互动、大运同步等因素。
    </div>
  `;
  document.getElementById("synastry-result").innerHTML = html;
}

// ====== 工具 ======
function setText(id, txt) {
  document.getElementById(id).textContent = txt;
}
function fmtDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

// ====== 初始自动排盘（页面加载完立即执行一次）======
// 脚本在 body 末尾加载，此时 DOM 已就绪，直接触发即可
document.getElementById("form-single").dispatchEvent(new Event("submit"));
