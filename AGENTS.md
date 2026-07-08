# AGENTS.md — Calendar Filter Superset Plugin

## Goal

Interactive, selectable calendar chart plugin for **Apache Superset 6.1.0** that acts as a dashboard cross-filter with rich navigation and selection features.

## Package

- **Name**: `superset-plugin-chart-calendar-filter`
- **Plugin class key**: `superset-plugin-chart-calendar-filter` (Superset registry key)
- **All peer dependencies** use `*` version range — Superset provides them at runtime
- **License**: Apache 2.0

## Project Structure

```
superset-plugin-chart-calendar-filter/
├── src/
│   ├── index.ts                        # Entry point — exports SupersetPluginChartCalendarFilter
│   ├── types.ts                        # TypeScript interfaces (props, calendar day, tooltip, etc.)
│   ├── CalendarFilter.tsx              # Main React component (calendar heatmap + all features)
│   ├── plugin/
│   │   ├── index.ts                    # ChartPlugin registration + ChartMetadata
│   │   ├── buildQuery.ts              # Query builder (groupby, metrics)
│   │   ├── controlPanel.ts            # Form controls definition
│   │   └── transformProps.ts          # Data transformation pipeline
│   └── images/
│       └── thumbnail.png               # 100x100 thumbnail for chart picker
├── test/
│   ├── CalendarFilter.test.tsx         # Component tests (27 tests)
│   ├── index.test.ts                   # Plugin existence test
│   ├── __mocks__/
│   │   ├── superset-ui-core.ts         # Mock for @superset-ui/core (styled, ChartProps, etc.)
│   │   └── emotion-styled.ts           # Mock for @emotion/styled (CSS → style parsing)
│   └── plugin/
│       ├── buildQuery.test.ts          # Query builder tests
│       └── transformProps.test.ts      # Transform props tests
├── demo/                                # Standalone demo (esbuild IIFE + index.html)
│   ├── demo-wrapper.tsx                 # Demo component with mock data
│   ├── demo-bundle.js                   # esbuild bundle (1.2 MB)
│   ├── index.html                       # HTML page for demo
│   └── screenshot*.png                  # Demo screenshots
├── types/
│   └── external.d.ts                    # Module declarations for @apache-superset/core/translation
├── .github/
│   ├── workflows/ci.yml                # GitHub Actions CI
│   └── ISSUE_TEMPLATE/                 # Bug report + feature request templates
├── package.json
├── tsconfig.json
├── babel.config.js
├── jest.config.js
├── AGENTS.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

## Build commands

| Command | Action |
|---|---|
| `npm run build` | build-cjs → build-esm → ts-types → postbuild (test) |
| `npm run build-clean` | rimraf → full build |
| `npm run clean` | rimraf {lib,esm,tsconfig.tsbuildinfo} |
| `npm run dev` | watch mode, rebuilds on change |
| `npm test` | jest (27 tests) |

Build outputs:
- `lib/` — CJS (CommonJS)
- `esm/` — ESM (ES Modules)
- `tsconfig.tsbuildinfo` — TypeScript incremental build info

### Demo build

```bash
npx esbuild demo/demo-wrapper.tsx --bundle --global-name=CalendarFilterDemo --outfile=demo/demo-bundle.js --banner:js="var production = true;" --define:process.env.NODE_ENV='"production"' --loader:.js=jsx --tsconfig=tsconfig.json
```

## Session context

- **Date**: 2026-07-09
- **Branch**: `master`
- **Superset version**: 6.1.0 (cloned at `../superset-6.1.0/`)
- **Plugin build**: 27 tests pass, CJS + ESM + TypeScript declarations

### Today's activities

1. **Fixed `styled` import**: Changed from `@superset-ui/core` to `@emotion/styled` in `CalendarFilter.tsx` — Superset 6.1.0 re-exports `styled` via `@emotion/styled` but direct import is more reliable
2. **Fixed `t` translation import**: Changed from `@superset-ui/core` to local Superset translation module (`@apache-superset/core/translation` with type declaration)
3. **Created Jest mock for `@emotion/styled`**: `test/__mocks__/emotion-styled.ts` handles the CSS → style parsing for test environment
4. **Created standalone demo** (`demo/`): esbuild IIFE bundle that renders CalendarFilter with mock 2026 data via `ReactDOM.render` + `ThemeProvider`
5. **Updated README**: Added screenshots (month view, year overview, date selection), feature showcase, cross-filter API docs — repo made public
6. **Registered plugin in Superset**: Confirmed in `superset-frontend/src/visualizations/presets/MainPreset.ts` — Calendar Filter appears in the Superset chart picker
7. **Verified Superset dev server compilation**: Webpack compiles 12956 modules including our plugin with 0 errors from our code (22 pre-existing geostyler ESM errors in cartodiagram plugin, unrelated)
8. **Superset backend setup**: Python 3.11 venv with SQLite, `superset db upgrade`, admin user created, backend running on `:8088`

### Known issues

- **22 pre-existing geostyler ESM errors** in `superset-frontend` webpack build — caused by `geostyler-qgis-parser` → `geostyler-style` (version 9.0.0-next.5) ESM module resolution bug. Not related to our plugin. Blocks production build and explore page runtime. Fix attempted via `type: 'javascript/auto'` rules + patching `node_modules` extensionless imports, but webpack's export analysis still fails on the ESM-only package.

## Registration in Superset

From `superset-frontend/` directory:

```bash
npm i -S ../../superset-plugin-chart-calendar-filter
```

Then edit `superset-frontend/src/visualizations/presets/MainPreset.ts`:

```ts
import { SupersetPluginChartCalendarFilter } from 'superset-plugin-chart-calendar-filter';
// ...
new SupersetPluginChartCalendarFilter().configure({ key: 'superset-plugin-chart-calendar-filter' }),
```

Registration verified — chart appears in Superset's "+ Chart" picker under "Other" category with description "Calendar Filter Plugin for Apache Superset".

## Key Superset plugin API (6.1.0)

- **Import from `@superset-ui/core`**: `ChartPlugin`, `ChartMetadata`, `ChartProps`, `SetDataMaskHook`, `DataMask`, `BinaryQueryObjectFilterClause`, `QueryFormColumn`, `QueryFormData`
- **Import from `@superset-ui/chart-controls`**: `ControlPanelConfig`, `sections` (legacyRegularTime, etc.), `getStandardizedControls`
- **Import `t` from**: `@apache-superset/core/translation` (local alias, not from npm)
- **Import `styled` from**: `@emotion/styled` (not re-exported from `@superset-ui/core` in 6.1.0)
- **Peer dependencies** (not bundled): `react`, `@superset-ui/core`, `@superset-ui/chart-controls`
- Superset 6.1.0 uses React 17, TypeScript ~4.1, babel for transpilation
- **Dev server**: `npm run dev-server` from `superset-frontend/` — runs webpack-dev-server on `:9000` with proxy to backend `:8088`

## Component API

### Props (`CalendarFilterProps`)

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `TimeseriesDataRecord[]` | — | Data from Superset query |
| `height` | `number` | — | Container height |
| `width` | `number` | — | Container width |
| `colorScheme` | `string` | `'supersetColors'` | Color palette name |
| `showLegend` | `boolean` | `true` | Show/hide color legend |
| `firstDayOfWeek` | `number` | `0` | 0=Sunday, 1=Monday |
| `showWeekNumbers` | `boolean` | `false` | Show ISO week numbers |
| `showYearDropdown` | `boolean` | `true` | Show year selector dropdown |
| `enableOverview` | `boolean` | `true` | Enable year overview mode |
| `setDataMask` | `SetDataMaskHook` | — | Cross-filter emission function |
| `filterState` | `FilterState` | — | Current filter state from dashboard |

### Cross-filter API

The chart emits cross-filters using `__time_range` column with `op: 'IN'` (multi-select). On date click:

```ts
setDataMask({
  extraFormData: {
    filters: selectedArray.length
      ? [{ col: '__time_range', op: 'IN', val: selectedArray }]
      : [],
  },
  filterState: {
    value: selectedArray.length ? selectedArray : null,
    selectedValues: selectedArray.length
      ? selectedArray.reduce((acc, date) => ({ ...acc, [date]: date }), {})
      : null,
  },
});
```

### Color Palettes

| Key | Colors |
|---|---|
| `supersetColors` | 7-step blue-cyan (Superset default) |
| `greens` | 7-step green sequential |
| `blues` | 7-step blue sequential |
| `oranges` | 7-step orange sequential |
| `reds` | 7-step red sequential |
| `purples` | 7-step purple sequential |

## Features

### Calendar Navigation
- **Month navigation**: ‹ › arrow buttons to move between months
- **Year dropdown**: Jump directly to any year within data range
- **Today button**: Quick nav back to current month
- **Smart constraints**: Prev/Next buttons auto-disable when reaching data boundaries

### Views
- **Month view**: Classic single-month calendar heatmap with date cells
- **Year overview** (toggleable): 4×3 grid showing all 12 months as mini-calendars

### Selection
- **Single click**: Toggle individual date selection
- **Shift-click range**: Select a contiguous range of dates (hold Shift, click start then end)
- **Clear all**: "Clear" button in header when dates are selected
- **Selection badge**: Shows "N selected" in the header

### Display
- **Heatmap intensity**: Color intensity scales with metric value (linear interpolation)
- **Legend**: Gradient bar showing min→max value range
- **Week numbers**: ISO 8601 week numbers on the left side of each week row
- **Rich tooltip**: On hover shows date, metric value, and % of max
- **Configurable first day of week**: Sunday or Monday start

### Empty State
- "No data available" message when data array is empty

## Control Panel

Available in Superset's chart editor under "Calendar Options" section:

| Control | Type | Default | Description |
|---|---|---|---|
| `color_scheme` | Select | `'supersetColors'` | Color palette for heatmap |
| `show_legend` | Checkbox | `true` | Show color legend |
| `show_week_numbers` | Checkbox | `false` | Display ISO week numbers |
| `first_day_of_week` | Select | `0` (Sunday) | Start week on Sunday (0) or Monday (1) |
| `show_year_dropdown` | Checkbox | `true` | Year selector dropdown |
| `enable_overview` | Checkbox | `true` | Year overview toggle |

Controls in "Query" section: `metric`, `groupby` (date column), `adhoc_filters`.

## Testing

- **Framework**: Jest 29 + jest-environment-jsdom
- **Testing library**: `@testing-library/react` 12.x
- **Total tests**: 27 across 4 suites

### Test suites

| Suite | File | Tests |
|---|---|---|
| Component | `test/CalendarFilter.test.tsx` | 21 tests |
| Plugin registration | `test/index.test.ts` | 1 test |
| Build query | `test/plugin/buildQuery.test.ts` | 3 tests |
| Transform props | `test/plugin/transformProps.test.ts` | 2 tests |

### Mock

`test/__mocks__/superset-ui-core.ts` provides a lightweight mock of `@superset-ui/core` including:
- `styled` (tagged template with CSS→style parsing, `React.forwardRef` support)
- `ChartPlugin`, `ChartMetadata`, `ChartProps`
- `buildQueryContext`, `supersetTheme`
- `SetDataMaskHook`, `DataMask` types
- All type aliases (`TimeseriesDataRecord`, `QueryFormData`, etc.)

### Run tests
```bash
npm test
# or after build (postbuild hook):
npm run build
```

## GitHub

- Repository: `https://github.com/FrancescoCastaldi/superset-plugin-chart-calendar-filter`
- Branch: `master`
- CI: GitHub Actions (`.github/workflows/ci.yml`)
- Templates: Issue templates for bugs + feature requests, PR template
- Changelog: `CHANGELOG.md`
- Contributing: `CONTRIBUTING.md`
- `.gitignore`: `node_modules/`, `lib/`, `esm/`, `tsconfig.tsbuildinfo`, `opencode.json`
