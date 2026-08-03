# src/plugin/

## Responsibility

Defines the Apache Superset plugin metadata, registration, form controls schema, SQL query builder, and prop transformation pipeline.

## Design

- **`index.ts`**: Registers `SupersetPluginChartCalendarFilter` with `@superset-ui/core` using `ChartPlugin` and `ChartMetadata`. Declares dual behaviors: `Behavior.InteractiveChart` and `Behavior.NativeFilter`. Categorized under `Filters and controls`.
- **`buildQuery.ts`**: Constructs the Superset SQL query payload. Groups by user-selected date column, aggregates metrics, and strips `orderby` clauses to prevent nested SQL syntax errors in PostgreSQL/SQLite.
- **`controlPanel.ts`**: Defines the Explore sidepanel configuration schema (Date Column, Color Palette, Cell Density, Default Values Mode, Filter Type Mode, Macro Shortcuts toggle, Week Numbers toggle, First Day of Week).
- **`transformProps.ts`**: Sanitizes raw `ChartProps` received from Superset, applies default configuration values, and forwards `setDataMask` and `filterState` to `CalendarFilter.tsx`.

## Flow

Superset Explore UI -> `controlPanel.ts` -> `buildQuery.ts` -> Backend SQL execution -> Superset `ChartProps` -> `transformProps.ts` -> `CalendarFilterProps` -> `CalendarFilter.tsx`.

## Integration

Integrates directly with `@superset-ui/core` plugin registry and Superset Explore form controls.
