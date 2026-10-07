# Utilities (src/utils/)

Stateless pure functions isolated from React components.

## Files

- **dateUtils.ts** -- Timezone-safe date manipulation functions. Includes `parseDateValue`, `formatDateKey`, `getDatesBetween`, `getISOWeekNumber`, `getDaysInMonth`, `formatDateRangeBadge`, and calendar grid layout helpers. Mitigates +1/-1 day drift from browser UTC conversions.

- **themeUtils.ts** -- Color utilities. Exports `COLOR_PALETTES` (6 palette definitions matching Superset color schemes) and `getBaseColor` (consumed by `useCalendarData`) for gradient scale construction.
