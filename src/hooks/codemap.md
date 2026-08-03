# src/hooks/

## Responsibility

Encapsulates state management, data transformation pipelines, and selection filter state logic into custom React hooks (`useCalendarData.ts` and `useSelectionMask.ts`).

## Design

- **Separation of Concerns**: Moves complex data transformations and event handler logic out of rendering components into reusable hooks.
- **Hook Responsibilities**:
  - `useCalendarData.ts`: Normalizes raw Superset timeseries records into `CalendarDay` objects, computes minimum/maximum values, calculates available year dropdown ranges, and derives dynamic HSL color intensity scales based on selected GitHub-style palettes.
  - `useSelectionMask.ts`: Manages active date selection sets (`Set<string>`), handles single-click date toggle, shift-click range selection, mouse drag-sweep selection, macro shortcut execution, default value initialization, and dispatches `setDataMask({ filterState })` to Superset.

## Flow

1. `chartProps.data` -> `useCalendarData` -> returns `dataMap`, `minVal`, `maxVal`, `availableYears`, `intensityScale`.
2. User interaction -> `useSelectionMask` -> updates local selection state -> invokes `emitSelection()` -> calls Superset `setDataMask()`.

## Integration

Used exclusively within `src/CalendarFilter.tsx` to handle logic and filter emission.
