# AGENTS.md — Calendar Filter Superset Plugin

## Goal

Build an interactive, selectable calendar chart plugin for **Apache Superset 6.1.0** that acts as a dashboard cross-filter.

## Package naming

- Must follow the convention: `superset-plugin-chart-calendar-filter`
- Plugin class key in Superset registry uses this name too.
- All peer dependencies use `*` version range — Superset provides them at runtime.

## Quick start

```bash
# Scaffold (one-time)
npm install -g yo @superset-ui/generator-superset
mkdir superset-plugin-chart-calendar-filter
cd superset-plugin-chart-calendar-filter
yo @superset-ui/superset
```

## Structure

```
superset-plugin-chart-calendar-filter/
├── src/
│   ├── index.ts          # ChartPlugin registration + metadata
│   ├── plugin.ts         # (if separated from index)
│   ├── CalendarFilter.tsx # React component, receives chartProps
│   ├── controlPanel.ts   # form controls definition
│   └── images/
│       └── thumbnail.png  # 100x100 thumbnail for chart picker
├── package.json          # see template below
├── tsconfig.json
└── test/
```

## Build commands

| Command | Action |
|---|---|
| `npm run build` | build-cjs + build-esm + ts-types |
| `npm run dev` | watch mode, rebuilds on change |
| `npm run build-clean` | clean + full build |
| `npm test` | jest |

Build outputs go to `lib/` (CJS) and `esm/` (ESM). Types to `tsconfig.tsbuildinfo`.

## Registration in Superset

After building, from `superset-frontend/` directory:

```bash
npm i -S ../../superset-plugin-chart-calendar-filter
```

Then edit `superset-frontend/src/visualizations/presets/MainPreset.js`:

```js
import { SupersetPluginChartCalendarFilter } from 'superset-plugin-chart-calendar-filter';
// ...
new SupersetPluginChartCalendarFilter().configure({ key: 'superset-plugin-chart-calendar-filter' }),
```

## Key Superset plugin API (6.1.0)

- **Import from `@superset-ui/core`**: `ChartPlugin`, `ChartMetadata`, `ChartProps`, `SetDataMaskHook`, `DataMask`, `BinaryQueryObjectFilterClause`, `QueryFormColumn`, `QueryFormData`, `t`
- **Import from `@superset-ui/chart-controls`**: `ControlPanelConfig`, `sections` (legacyRegularTime, etc.), `getStandardizedControls`
- **Peer dependencies** (not bundled): `react`, `@superset-ui/core`, `@superset-ui/chart-controls`
- Superset 6.1.0 uses React 17, TypeScript ~4.1, babel for transpilation.

### Cross-filter API (critical for this plugin)

Your chart **must emit cross-filters** to work as a dashboard filter. The pipeline:

1. Declare `emitCrossFilters: true` in your transform function (or pass it in buildQuery).
2. Accept `setDataMask: SetDataMaskHook` and `filterState: FilterState` props.
3. On user interaction (date click/select), call `setDataMask()` with this shape:

```ts
setDataMask({
  extraFormData: {
    filters: values.length
      ? [{ col: '__time_range', op: 'IN', val: selectedDates }]
      : [],
  },
  filterState: {
    value: values.length ? selectedDates : null,
    selectedValues: values.length ? selectedDates : null,
  },
});
```

- Use `op: 'IN'` for multi-select, `op: '=='` for single select.
- Toggle behavior: if already selected, filter it out.
- For **time-based cross-filtering**, use `col: '__time_range'` (native time filter column).

## Control panel conventions

```ts
const controlPanel: ControlPanelConfig = {
  label: t('Calendar Filter'),
  controlOverrides: {  // override query control defaults
    metrics: { default: [] },
    groupby: { default: ['ds'] },
  },
  sections: [
    sections.legacyRegularTime,
    {
      label: t('Calendar Options'),
      expanded: true,
      controlSetRows: [
        ['metric'],
        ['groupby'],       // date column
        ['adhoc_filters'],
      ],
    },
  ],
};
```

## Testing

- Jest + jest-environment-jsdom.
- Superset plugin tests typically use `@testing-library/react` + mock chart props from `@superset-ui/core`.
- No snapshot tests required unless maintaining strict output parity.

## GitHub repo notes

- Root repo is the plugin package itself (no monorepo).
- `.gitignore` defaults: `node_modules/`, `lib/`, `esm/`, `tsconfig.tsbuildinfo`.
- License: Apache 2.0 (Superset convention).
