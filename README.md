# Calendar Filter — Superset Chart Plugin

An interactive, selectable calendar heatmap chart plugin for **Apache Superset 6.1.0** that acts as a dashboard **cross-filter**.

![Superset Version](https://img.shields.io/badge/Superset-6.1.0-blue)
![License](https://img.shields.io/badge/License-Apache%202.0-green)
![Build](https://github.com/FrancescoCastaldi/superset-plugin-chart-calendar-filter/actions/workflows/ci.yml/badge.svg)

---

## Features

- **Calendar heatmap** — color-coded day cells based on metric values
- **Month navigation** — browse through months with prev/next controls
- **Date selection** — click to select/deselect individual dates
- **Cross-filter** — emits `__time_range` filters to the Superset dashboard
- **6 color palettes** — Superset Default, Greens, Blues, Oranges, Reds, Purples
- **Legend** — shows the color scale with min/max values
- **Empty state** — graceful fallback when no data is available

## Installation

### 1. Build the plugin

```bash
cd superset-plugin-chart-calendar-filter
npm install --legacy-peer-deps
npm run build
```

### 2. Link into Superset

From `superset-frontend/`:

```bash
npm i -S ../../superset-plugin-chart-calendar-filter
```

### 3. Register in Superset

Edit `superset-frontend/src/visualizations/presets/MainPreset.js`:

```js
import { SupersetPluginChartCalendarFilter } from 'superset-plugin-chart-calendar-filter';

// Inside the preset constructor:
new SupersetPluginChartCalendarFilter().configure({
  key: 'superset-plugin-chart-calendar-filter',
}),
```

## Usage

1. Add a **Calendar Filter** chart to your dashboard
2. Select a **date column** (e.g. `ds`, `__timestamp`)
3. Select a **metric** to color the calendar cells
4. Apply optional **filters**
5. Click any date to cross-filter other dashboard charts

## Development

```bash
# Watch mode
npm run dev

# Run tests
npm test

# Full build
npm run build
```

## Build output

| Path | Format |
|------|--------|
| `lib/` | CommonJS |
| `esm/` | ES Modules |
| `tsconfig.tsbuildinfo` | TypeScript declarations |

## Project structure

```
superset-plugin-chart-calendar-filter/
├── src/
│   ├── index.ts              # Plugin export
│   ├── CalendarFilter.tsx     # React calendar component
│   ├── types.ts               # TypeScript interfaces
│   ├── images/thumbnail.png   # Chart picker thumbnail
│   └── plugin/
│       ├── index.ts           # ChartPlugin registration
│       ├── buildQuery.ts      # Query builder
│       ├── controlPanel.ts    # Form controls
│       └── transformProps.ts  # Data transformation
├── test/
│   ├── CalendarFilter.test.tsx
│   ├── index.test.ts
│   └── plugin/
│       ├── buildQuery.test.ts
│       └── transformProps.test.ts
├── types/external.d.ts
├── package.json
├── tsconfig.json
├── babel.config.js
├── jest.config.js
└── AGENTS.md
```

## Cross-filter API

The plugin emits filters using the `__time_range` column:

```ts
setDataMask({
  extraFormData: {
    filters: [{ col: '__time_range', op: 'IN', val: ['2024-01-01', '2024-01-15'] }],
  },
  filterState: {
    value: ['2024-01-01', '2024-01-15'],
    selectedValues: { '2024-01-01': '2024-01-01', '2024-01-15': '2024-01-15' },
  },
});
```

## License

[Apache License 2.0](LICENSE)
