# Source Code Directory (src/)

TypeScript and React source code for the Calendar Filter plugin (v0.1.5).

## Files

- **CalendarFilter.tsx** -- Main React component (1077 lines). Manages DOM rendering, state hooks, inline/modal layout switching, and all user interactions (selection, navigation, macros).

- **types.ts** -- TypeScript interfaces and type definitions for component props, calendar day objects, tooltip data, and filter state.

- **index.ts** -- Plugin entry point. Re-exports the main component for the build pipeline.

## Subdirectories

- **plugin/** -- Superset integration layer. Contains ChartPlugin registration, buildQuery, controlPanel, and transformProps.

- **hooks/** -- Custom React hooks. Includes `useCalendarData` (data aggregation and year/month matrix construction) and `useSelectionMask` (selection set management with range and sweep support).

- **styles/** -- Emotion styled-components for all visual elements: calendar grid, modal overlay, year/month selectors, tooltips, and responsive breakpoints.

- **utils/** -- Pure utility functions for date parsing, formatting, color palette generation, and theme resolution.

- **images/** -- Static assets including the chart picker thumbnail.
