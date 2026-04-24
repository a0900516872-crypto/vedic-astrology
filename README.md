# 印占 · Vedic Astrology Web App

一个纯前端的印度占星排盘小工具。零依赖、离线可用、直接打开 HTML 就能跑。

## ✦ 功能

- **本命盘**：北印度菱形星盘图 + 九曜位置 + 月亮星宿 + 宫位分析
- **大运（Vimshottari Dasha）**：120 年人生周期主运 + 当前子运
- **合盘（Ashtakoot）**：8 项 36 分传统印度合盘匹配

## ✦ 本地预览

直接用浏览器打开 `index.html` 即可。

或通过现有 Flask 工作台：
```bash
cd D:\FP2026\web-app
python app.py
# 浏览器访问：http://localhost:8080/vedic-astrology/
```

## ✦ 上线部署（GitHub Pages）

把整个 `vedic-astrology/` 文件夹作为独立仓库推到 GitHub，在仓库设置里开启 Pages 即可获得链接。

```bash
# 进入文件夹
cd D:\FP2026\web-app\static\vedic-astrology

# 初始化仓库并推送
git init
git add .
git commit -m "init: vedic astrology app"
git branch -M main
git remote add origin git@github.com:a0900516872-crypto/vedic-astrology.git
git push -u origin main
```

然后在 GitHub 仓库 → Settings → Pages：
- Source: `Deploy from branch`
- Branch: `main` / `(root)`
- 保存后等 1-2 分钟，链接即为：
  `https://a0900516872-crypto.github.io/vedic-astrology/`

## ✦ 技术说明

- **黄道制**：恒星黄道（Sidereal），Lahiri Ayanamsa
- **宫位制**：Whole Sign（整宫制）
- **行星**：9 曜（Sun/Moon/Mars/Mercury/Jupiter/Venus/Saturn/Rahu/Ketu）
- **算法**：简化 VSOP87 + Meeus《Astronomical Algorithms》，精度 ±1°
- **定位**：学习参考 + 兴趣娱乐，非专业命理软件

## ✦ 文件结构

```
vedic-astrology/
├── index.html              主页面
├── css/style.css           样式（暗金轻奢风）
├── js/
│   ├── data.js             12 星座 / 27 星宿 / 9 行星数据
│   ├── astronomy.js        天文计算（儒略日、行星黄经、上升）
│   ├── vedic.js            印占逻辑（Ayanamsa、宫位、星宿、大运、合盘）
│   ├── chart.js            Canvas 绘制北印度星盘
│   └── app.js              主逻辑（表单 → 计算 → 渲染）
├── PLAN.md                 项目计划文档
└── README.md               使用说明
```

## ✦ License

© 2026 飞总（Larry）· 仅供学习交流
