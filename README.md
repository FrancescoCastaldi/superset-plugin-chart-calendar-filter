# 📅 Calendar Filter — Superset Chart Plugin

> An interactive, selectable calendar heatmap chart for **Apache Superset 6.1.0** that doubles as a **dashboard cross-filter**. Click dates, filter your dashboard.

[![Superset Version](https://img.shields.io/badge/Superset-6.1.0-blue)](https://superset.apache.org/)
[![License](https://img.shields.io/badge/License-Apache%202.0-green)](LICENSE)
[![Build](https://github.com/FrancescoCastaldi/superset-plugin-chart-calendar-filter/actions/workflows/ci.yml/badge.svg)](https://github.com/FrancescoCastaldi/superset-plugin-chart-calendar-filter/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-4.1-blue)
![React](https://img.shields.io/badge/React-17-61dafb)
![Tests](https://img.shields.io/badge/Tests-27%20passing-brightgreen)

---

<p align="center">
  <img src="demo/screenshot.png" alt="Calendar Filter — Month view" width="800" />
</p>

---


---

## 🚀 Quick Start — Add this chart to an EXISTING Superset

You already have a Superset project on disk (it contains a `superset/` backend folder
and a `superset-frontend/` folder). Just follow the steps below.

### ⚡ One-command install (Option A, fully automated)

Open a terminal **in the root folder of your cloned Superset project**
(the one that contains both `superset/` and `superset-frontend/`) and run
**a single command**. It will `npm install` the plugin and register it in
`MainPreset.ts` for you.

**Linux / macOS:**
```bash
curl -fsSL https://raw.githubusercontent.com/FrancescoCastaldi/superset-plugin-chart-calendar-filter/master/scripts/install-to-superset.sh | bash -s -- .
```

**Windows (PowerShell):**
```powershell
irm https://raw.githubusercontent.com/FrancescoCastaldi/superset-plugin-chart-calendar-filter/master/scripts/install-to-superset.ps1 | iex
```

That is all. After it finishes, rebuild the frontend (`npm run dev` or
`npm run build`) and restart the backend — the **Calendar Filter** chart will
appear in the picker.

> Prefer to run the script locally instead of from GitHub? Clone this repo and run
> `./scripts/install-to-superset.sh .` (or `.\scripts\install-to-superset.ps1`) from the
> Superset root.
### Option A — Install from npm (easiest, recommended for production)

1. **Open a terminal in your `superset-frontend/` folder** and install the plugin:

   ```bash
   npm install --save superset-plugin-chart-calendar-filter
   ```

2. **Register the chart.** Open `superset-frontend/src/visualizations/presets/MainPreset.ts`
   (it may be `MainPreset.js` in older Superset versions) and add the import + plugin:

   ```ts
   import { SupersetPluginChartCalendarFilter } from 'superset-plugin-chart-calendar-filter';

   // inside the preset constructor, alongside the other `new XxxPlugin()` lines:
   new SupersetPluginChartCalendarFilter().configure({
     key: 'superset-plugin-chart-calendar-filter',
   }),
   ```

3. **Rebuild & restart.** From `superset-frontend/`:

   ```bash
   npm run dev        # development (hot reload)
   # or, for production:
   npm run build
   ```

   Then restart the Flask backend (`superset run` / your dev server).

4. **Done!** Open Superset → **+ Chart** → you will find **Calendar Filter** under the
   *Other* category.

---

### Option B — Link a local clone (best for development / customizing)

1. **Clone this repo** next to your Superset folder (they should share the same parent):

   ```bash
   git clone https://github.com/FrancescoCastaldi/superset-plugin-chart-calendar-filter.git
   cd superset-plugin-chart-calendar-filter
   npm install
   npm run build
   ```

   Your layout should look like:

   ```
   some-folder/
   ├── superset/                      # backend
   ├── superset-frontend/             # frontend
   └── superset-plugin-chart-calendar-filter/   # this plugin (cloned)
   ```

2. **Point Superset at the local folder.** In `superset-frontend/package.json` add:

   ```json
   "dependencies": {
     "superset-plugin-chart-calendar-filter": "file:../../superset-plugin-chart-calendar-filter"
   }
   ```

3. **Install and register** (same registration snippet as Option A, step 2) and run
   `npm install` inside `superset-frontend/`.

4. **Restart** the frontend + backend. The chart now picks up your local source on every
   change (hot reload).

---

### ✅ Verify it works

1. Create a new chart, type = **Calendar Filter**.
2. Pick a dataset that has a **date column** (text or datetime) and a numeric **metric**.
3. Set *Group by* = your date column, *Metric* = e.g. `COUNT(*)`.
4. Click any day in the calendar → the other dashboard charts are cross-filtered.

If the chart does **not** appear, double-check the `key` string matches exactly
`superset-plugin-chart-calendar-filter` in both `MainPreset` and the plugin, then
restart the frontend once more.
## ✨ Features

### Month View — Heatmap at a Glance
Color-coded day cells show metric intensity. Navigate between months, jump to any year, or return to today with one click.

| Control | Description |
|---|---|
| ‹ / › | Previous / Next month |
| Year dropdown | Jump to any year in your data range |
| Today | Return to current month |
| Year / Month | Toggle between month and year overview |

### Year Overview — All 12 Months
See the full year as a 4×3 grid of mini-calendars. Each mini-calendar is interactive — dates are clickable.

<p align="center">
  <img src="demo/screenshot-yearview.png" alt="Calendar Filter — Year overview" width="800" />
</p>

### Interactive Selection & Cross-Filter
- **Single click** — toggle a date on/off
- **Shift-click** — select a contiguous date range
- **Clear all** — reset selection with one button
- **Auto cross-filter** — emits `__time_range IN [...]` to filter all dashboard charts

<p align="center">
  <img src="demo/screenshot-selection.png" alt="Calendar Filter — Date selection" width="800" />
</p>

### Display Options
| Feature | Description |
|---|---|
| **Color palettes** | 6 palettes: Superset Default, Greens, Blues, Oranges, Reds, Purples |
| **Legend** | Gradient bar with min→max value range |
| **Week numbers** | ISO 8601 week numbers on each week row |
| **First day of week** | Configurable Sunday or Monday start |
| **Rich tooltip** | Hover shows date, metric value, and % of max |
| **Empty state** | Graceful "No data available" message |

---

## 📦 Installation

### Prerequisites
- Apache Superset 6.1.0
- Node.js 16+

### 1. Build the plugin

```bash
cd superset-plugin-chart-calendar-filter
npm install --legacy-peer-deps
npm run build
```

This produces:
- `lib/` — CommonJS
- `esm/` — ES Modules
- TypeScript declarations
- Runs the full test suite (27 tests)

### 2. Link into Superset

From your `superset-frontend/` directory:

```bash
npm i -S ../../superset-plugin-chart-calendar-filter
```

### 3. Register as a visualization

Edit `superset-frontend/src/visualizations/presets/MainPreset.js`:

```js
import { SupersetPluginChartCalendarFilter } from 'superset-plugin-chart-calendar-filter';

// Inside the preset constructor, add:
new SupersetPluginChartCalendarFilter().configure({
  key: 'superset-plugin-chart-calendar-filter',
}),
```

### 4. Restart Superset

Rebuild the frontend and restart the server. The **Calendar Filter** chart will appear in the chart picker.

---

## 🎮 Usage

1. Add a **Calendar Filter** chart to your dashboard
2. Configure the **date column** (e.g. `ds`, `__timestamp`)
3. Select a **metric** to color the calendar cells
4. Apply optional **adhoc filters**
5. Click any date to cross-filter other dashboard charts

### Chart Controls

| Control | Type | Default | Description |
|---|---|---|---|
| `color_scheme` | Select | `supersetColors` | Color palette for heatmap |
| `show_legend` | Checkbox | `true` | Show/hide color legend |
| `show_week_numbers` | Checkbox | `false` | Display ISO week numbers |
| `first_day_of_week` | Select | `0` (Sunday) | Start week on Sunday or Monday |
| `show_year_dropdown` | Checkbox | `true` | Year selector dropdown |
| `enable_overview` | Checkbox | `true` | Year overview toggle |

---

## 🔌 Cross-Filter API

When dates are selected, the plugin emits cross-filters using the `__time_range` column:

```ts
setDataMask({
  extraFormData: {
    filters: [{ col: '__time_range', op: 'IN', val: ['2024-01-01', '2024-01-15'] }],
  },
  filterState: {
    value: ['2024-01-01', '2024-01-15'],
    selectedValues: {
      '2024-01-01': '2024-01-01',
      '2024-01-15': '2024-01-15',
    },
  },
});
```

---

## 🛠 Development

```bash
# Watch mode — rebuilds on every change
npm run dev

# Run tests (27 tests across 4 suites)
npm test

# Full clean build
npm run build-clean
```

### Test Suites

| Suite | File | Tests |
|---|---|---|
| Component | `test/CalendarFilter.test.tsx` | 21 |
| Plugin registration | `test/index.test.ts` | 1 |
| Build query | `test/plugin/buildQuery.test.ts` | 3 |
| Transform props | `test/plugin/transformProps.test.ts` | 2 |

### Quick Demo (standalone)

A self-contained HTML demo is available in the `demo/` directory:

```bash
npx esbuild demo/demo-wrapper.tsx --bundle --global-name=CalendarFilterDemo --outfile=demo/demo-bundle.js --banner:js="var production = true;" --define:process.env.NODE_ENV='"production"' --loader:.js=jsx
# Then serve demo/index.html with any HTTP server
```

---

## 🏗 Project Structure

```
superset-plugin-chart-calendar-filter/
├── src/
│   ├── index.ts                 # Plugin entry point
│   ├── CalendarFilter.tsx        # Main React component
│   ├── types.ts                  # TypeScript interfaces
│   ├── images/thumbnail.png      # Chart picker thumbnail
│   └── plugin/
│       ├── index.ts              # ChartPlugin registration
│       ├── buildQuery.ts         # Query builder
│       ├── controlPanel.ts       # Form controls
│       └── transformProps.ts     # Data transformation
├── test/
│   ├── CalendarFilter.test.tsx   # 21 component tests
│   ├── index.test.ts             # Plugin registration test
│   ├── __mocks__/                # Test mocks
│   └── plugin/                   # Plugin unit tests
├── demo/                         # Standalone demo
│   ├── demo-wrapper.tsx
│   ├── demo-bundle.js
│   ├── index.html
│   └── screenshot*.png           # Demo screenshots
├── types/external.d.ts
├── package.json
├── tsconfig.json
├── babel.config.js
├── jest.config.js
└── AGENTS.md
```

---

## 📄 License

[Apache License 2.0](LICENSE)

---

<p align="center">
  Built for <a href="https://superset.apache.org/">Apache Superset</a>
  ·
  <a href="https://github.com/FrancescoCastaldi/superset-plugin-chart-calendar-filter/issues">Report a bug</a>
  ·
  <a href="https://github.com/FrancescoCastaldi/superset-plugin-chart-calendar-filter/issues">Request a feature</a>
</p>
