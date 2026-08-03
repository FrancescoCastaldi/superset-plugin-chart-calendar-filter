# Calendar-Filter-Superset/

## Responsibility

Root repository for `superset-plugin-chart-calendar-filter`, an interactive, selectable calendar chart plugin for **Apache Superset 6.1.0**. It acts as both a dashboard cross-filter (`Behavior.InteractiveChart`) and a Native Filter in the Superset sidebar (`Behavior.NativeFilter`).

## Design

- **Architecture**: Dual hybrid plugin architecture supporting inline chart rendering and Native Filter bar integration.
- **Toolchain**: Built with TypeScript, Emotion CSS-in-JS, Jest testing framework, Babel (CJS/ESM), and esbuild.
- **Standards**: Follows Apache Superset plugin standards (`@superset-ui/core`, `ChartPlugin`, `ChartMetadata`).

## Flow

1. **User Interaction**: Day cell click, drag-sweep, macro shortcut, or keyboard navigation in `CalendarFilter.tsx`.
2. **Filter Emission**: `useSelectionMask` Hook formats active dates and dispatches `setDataMask({ filterState })`.
3. **Filter Propagation**: Superset Filter Engine receives state and updates dashboard context.
4. **Data Query & Render**: Scoped dashboard charts re-query backend; `transformProps` and `useCalendarData` normalize records for UI re-rendering.

## Integration

- **Superset Frontend**: Plugs into Superset 6.1.0 frontend (`superset-frontend/src/visualizations/presets/MainPreset.js`) via file dependency or npm symlink.
- **Superset Backend**: Interacts with Superset REST API (Dashboard ID 8, Slice 105) and PostgreSQL/SQLite database tables (`events` dataset).
