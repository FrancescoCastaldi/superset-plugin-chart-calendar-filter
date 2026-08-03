# Calendar Filter - Superset Chart Plugin

Interactive calendar heatmap chart for Apache Superset 6.1.0 that acts as a dashboard cross-filter and native filter. Click dates to filter your dashboard.

[![Superset Version](https://img.shields.io/badge/Superset-6.1.0-blue)](https://superset.apache.org/)
[![License](https://img.shields.io/badge/License-Apache%202.0-green)](LICENSE)
[![Build](https://github.com/FrancescoCastaldi/superset-plugin-chart-calendar-filter/actions/workflows/ci.yml/badge.svg)](https://github.com/FrancescoCastaldi/superset-plugin-chart-calendar-filter/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-4.1-blue)
![React](https://img.shields.io/badge/React-17-61dafb)
![Tests](https://img.shields.io/badge/Tests-51%20passing-brightgreen)

---

### Install

Run the cross-platform Node.js installer from the `installer/` directory:

**Windows (double-click):**
Double-click `installer/install.bat`

**Command line:**
```bash
node installer/install.js [path/to/superset-root]
```

The installer auto-discovers your Apache Superset repository, builds the plugin, registers it as a dependency in `superset-frontend/package.json`, patches `MainPreset.ts/js` to register the chart, and prompts you to apply optional workarounds (Docker compose overrides, AceEditor fixes, and native filter whitelisting). See [INSTALLER.md](installer/INSTALLER.md) for full documentation.

### Development Mode

For active development, run `npm run dev` in the plugin directory to automatically rebuild on changes.

To run the dev server or compile:

```bash
cd superset-frontend
npm run dev-server   # Start webpack dev server (hot reload)
npm run build        # Production build
```

Then start/restart the Flask backend. For manual steps, see [INSTALL.md](docs/INSTALL.md).

---

## Features

### Month View
Neutral day cells stay white and flat — days are highlighted **only when selected**, never by the underlying records (no intensity heatmap). Navigate between months, jump to any year, or return to today with one click.

| Control | Description |
|---|---|
| < / > | Previous / Next month |
| Year dropdown | Jump to any year in the data range |
| Today | Return to current month |
| Year / Month | Toggle between month and year overview |

### Year Overview
See the full year as a 4x3 grid of mini-calendars. Each mini-calendar is interactive - dates are clickable.

### Interactive Selection and Cross-Filter
- Single click - toggle a date on/off
- Shift-click - select a contiguous date range
- Clear all - reset selection with one button
- Auto cross-filter - emits `IN` filter to all dashboard charts

### Display Options
| Feature | Description |
|---|---|
| Color palettes | 6 palettes: Superset Default, Greens, Blues, Oranges, Reds, Purples |
| Legend | Gradient bar with min-max value range |
| Week numbers | ISO 8601 week numbers on each week row |
| First day of week | Configurable Sunday or Monday start |
| Rich tooltip | Hover shows date, metric value, and % of max |
| Empty state | "No data available" message when no data |

---

## Build

### Prerequisites
- Apache Superset 6.1.0
- Node.js 16+

### Commands

```bash
cd superset-plugin-chart-calendar-filter
npm install --legacy-peer-deps
npm run build
```

Outputs:
- `lib/` - CommonJS
- `esm/` - ES Modules
- TypeScript declarations
- Runs the full test suite (44 tests)

---

## Usage

1. Add a Calendar Filter chart to your dashboard
2. Configure the date column (e.g. `ds`, `order_date`)
3. Select a metric (shown in the hover tooltip and selection badge)
4. Apply optional adhoc filters
5. Click any date to cross-filter other dashboard charts

As a **dashboard Native Filter**, set the `date_column` control (in *Native Filter Settings*) to the dataset's date column — without it the plugin falls back to `__timestamp` and the charts are not filtered.

### Chart Controls

| Control | Type | Default | Description |
|---|---|---|---|
| `color_scheme` | Select | `supersetColors` | Color palette for heatmap |
| `show_legend` | Checkbox | `true` | Show/hide color legend |
| `show_week_numbers` | Checkbox | `false` | Display ISO week numbers |
| `first_day_of_week` | Select | `0` (Sunday) | Start week on Sunday or Monday |
| `show_year_dropdown` | Checkbox | `true` | Year selector dropdown |
| `enable_overview` | Checkbox | `true` | Year overview toggle |
| `date_column` | Select | *empty* | Target date column for the emitted cross-filter (in **Native Filter Settings**; falls back to the first `groupby` column in chart mode) |
| `cell_density` | Select | `compact` | Cell density: `compact` or `comfortable` |

---

## Cross-Filter API

When dates are selected, the plugin emits cross-filters on the **configured date column** — `date_column` in Native Filter mode, otherwise the first `groupby` column (legacy fallback `__timestamp`):

```ts
setDataMask({
  extraFormData: {
    filters: [{ col: 'order_date', op: 'IN', val: ['2024-01-01', '2024-01-15'] }],
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

## Development

```bash
# Watch mode - rebuilds on every change
npm run dev

# Run tests (44 tests across 5 suites)
npm test

# Full clean build
npm run build-clean
```

### Test Suites

| Suite | File | Tests |
|---|---|---|
| Component | `test/CalendarFilter.test.tsx` | 27 |
| Date utils | `test/utils/dateUtils.test.ts` | 11 |
| Calendar grid | `test/utils/calendarGrid.test.ts` | 5 |
| Plugin registration | `test/index.test.ts` | 1 |
| Build query | `test/plugin/buildQuery.test.ts` | 1 |
| Transform props | `test/plugin/transformProps.test.ts` | 3 |

**Total: 51 tests across 6 suites**

### Quick Demo

A self-contained HTML demo is available in `demo/`:

```bash
npx esbuild demo/demo-wrapper.tsx --bundle --global-name=CalendarFilterDemo --outfile=demo/demo-bundle.js --loader:.tsx=tsx --loader:.js=jsx
```

Serve `demo/index.html` with any HTTP server.

---

## Project Structure

```
superset-plugin-chart-calendar-filter/
├── src/                            # Plugin source (TypeScript + React)
│   ├── index.ts                    # Plugin entry point — exports SupersetPluginChartCalendarFilter
│   ├── CalendarFilter.tsx          # Main React component
│   ├── types.ts                    # TypeScript interfaces
│   ├── hooks/
│   │   ├── useCalendarData.ts      # Data aggregation for the calendar grid
│   │   └── useSelectionMask.ts     # Selection mask + date column fallback
│   ├── plugin/
│   │   ├── index.ts                # ChartPlugin registration + ChartMetadata
│   │   ├── buildQuery.ts           # Query builder (groupby, metrics)
│   │   ├── controlPanel.ts         # Form controls (incl. date_column for native filters)
│   │   └── transformProps.ts       # Data transformation pipeline
│   ├── styles/
│   │   └── CalendarFilter.styles.ts  # Emotion styles (flat cells, selection tint)
│   ├── utils/
│   │   ├── dateUtils.ts            # Date helpers (month grid, ranges)
│   │   └── themeUtils.ts           # Theme null-safe access
│   └── images/
│       └── thumbnail.png           # 100x100 chart picker thumbnail
├── test/                           # Jest test suites
│   ├── CalendarFilter.test.tsx     # 27 component tests
│   ├── index.test.ts               # Plugin registration test
│   ├── plugin/                     # buildQuery + transformProps unit tests
│   ├── utils/                      # dateUtils unit tests (12)
│   └── __mocks__/                  # Superset / emotion mocks
├── demo/                           # Standalone HTML demo (esbuild bundle + server.js)
├── docker/                         # Docker Compose add-on + Dockerfile
├── scripts/                        # Installer / publisher (PowerShell + bash)
├── docs/                           # Docs index, INSTALL.md, screenshots
├── types/
│   └── external.d.ts               # Module declarations for @apache-superset/core
├── .github/
│   └── workflows/ci.yml            # GitHub Actions CI
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
├── LICENSE
├── package.json
├── package-lock.json
├── tsconfig.json
├── babel.config.js
├── jest.config.js
└── run-demo.bat
```

> Build outputs (`lib/`, `esm/`, `tsconfig.tsbuildinfo`) and local agent files (`AGENTS.md`, `SESSION-CONTEXT.md`) are **gitignored** and not part of the repository.

---

## License

[Apache License 2.0](LICENSE)

---

Built for [Apache Superset](https://superset.apache.org/) -- [Report a bug](https://github.com/FrancescoCastaldi/superset-plugin-chart-calendar-filter/issues) -- [Request a feature](https://github.com/FrancescoCastaldi/superset-plugin-chart-calendar-filter/issues)
