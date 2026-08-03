# src/

## Responsibility

Primary source code directory for `superset-plugin-chart-calendar-filter`. Contains the package entry point (`index.ts`), primary React orchestrator component (`CalendarFilter.tsx`), TypeScript interfaces (`types.ts`), and modular subdirectories for UI components, custom hooks, plugin metadata, styles, and utilities.

## Design

- **Orchestration**: `CalendarFilter.tsx` acts as the master component, connecting UI presentation with state hooks and Superset APIs.
- **Modularity**: Code is structured into decoupled sub-modules (`components/`, `hooks/`, `plugin/`, `styles/`, `utils/`) to keep file sizes manageable and improve testability.
- **Type Safety**: All props, data structures, and plugin contracts are strictly typed in `types.ts`.

## Flow

1. `index.ts` exports `SupersetPluginChartCalendarFilter` class.
2. `plugin/index.ts` handles lazy loading (`loadChart: () => import('../CalendarFilter')`).
3. `CalendarFilter.tsx` instantiates custom hooks (`useCalendarData`, `useSelectionMask`) and renders header, month grid, macro shortcuts, and modal popover.

## Integration

- Exposes CommonJS (`lib/`) and ES Module (`esm/`) build targets for runtime consumption by Apache Superset.
