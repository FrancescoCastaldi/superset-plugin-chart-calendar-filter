# Changelog

## [Unreleased]

### Added
- **Select Entire Year (Macro Filter)**: nuovo badge UI nella visualizzazione annuale per selezionare/deselezionare l'intero anno, abilitando un filtraggio massivo nativo con `op: 'IN'`.
- **Italian Localization**: traduzione completa in italiano di tutti i componenti UI (giorni della settimana, mesi, pulsanti *Oggi*, *Azzera*, *Anno/Mese*, *Seleziona Tutto* e tooltip *Valore/Massimo/% del max*).
- **Test Unitari (40/40)**: suite Jest aggiornata e ampliata a 40 test unitari superati con successo.

### Changed
- **Aseptic Plain Cell Styling**: rimosso lo sfondo gradiente/heatmap condizionato dall'intensità dei dati. Tutte le caselle non selezionate ora hanno uno sfondo bianco neutro (`#ffffff`) con bordo discreto (`1px solid #e2e8f0`), evidenziando solo le date selezionate dall'utente.

### Fixed
- **Nested Query OrderBy Stripping**: rimosso l'inserimento di clausole `ORDER BY`, `timeseries_limit_metric` e `order_desc` in `buildQuery.ts` per prevenire errori SQL su sottoquery annidate in Apache Superset.
- **Cross-Filter Dataset Alignment**: documentata e risolta la problematica di disallineamento dei dataset dei cross-filter nelle dashboard.

### Refactored
- **Modular Date Utilities**: estratto il modulo pure-function `src/utils/dateUtils.ts` e la relativa suite di test (`test/utils/dateUtils.test.ts`), snellendo `CalendarFilter.tsx` e preservando al 100% tutte le prop ed i contratti API.

## [0.1.2] — 2026-07-27

### Fixed

- **Cross-filter compatibility with Superset 6.1.0**:
  - `transformProps` now passes `hooks.setDataMask`, `filterState`, and `dateColumn` to the component
  - plugin metadata declares `behaviors: [Behavior.InteractiveChart]` so dashboards include it in cross-filter scope
  - cross-filter payload now uses the real date column (`dateColumn ?? '__timestamp'`) instead of non-existent `__time_range`
- **Timezone-safe date parsing**: `YYYY-MM-DD` strings are parsed with local `new Date(y, m-1, d)` to avoid UTC-negative timezone shifts
- **Peer dependencies**: added `@apache-superset/core` and `@emotion/styled`; React range expanded to `^16.13.1 || ^17.0.0`

## [0.1.1] — 2026-07-18

### Changed

- **Compact redesign**: cells reduced from `aspect-ratio: 1` to 30px fixed height, header padding cut 50%, grid gap reduced to 1px, overall footprint ~35% smaller
- **GitHub-inspired color palettes**: all 6 palettes updated to contribution-graph style gradients (`#ebedf0` → `#216e39` etc.)
- **Modern look**: border-radius 4px, subtle selection rings (2px + 3px), smoother 0.2s transitions, higher-contrast day numbers
- **Compact nav buttons**: icon-only style with 4px padding, smaller typography throughout

### Added

- **Today indicator**: green dot below the current day's cell, also shown in year overview
- **Smart selection badge**: shows formatted range ("12-15 Mar 2026") instead of generic count
- **Cell Density option**: new `Cell Density` control in Calendar Options (Compact/Normal) toggles cell size between 30px and 38px
- **Empty state**: calendar icon + centered message when no data
- **Transient props**: added `$isToday`, `$cellHeight` transient props to styled components to prevent DOM leakage

### Tests

- 27/27 tests pass (4 suites)
- Updated badge test to match new range format
- Added `cellDensity` to mock/styled props filter list

## [0.1.0] — 2026-07-08

### Added

- Initial scaffold with package.json, babel, TypeScript, Jest
- `CalendarFilter.tsx` — interactive calendar heatmap component
- Month navigation (prev/next) with month/year display
- Color-coded day cells with 6 color palettes
- Date selection with toggle behavior
- Cross-filter API via `setDataMask()` with `__time_range`
- Legend showing color scale (min/max values)
- Empty state when no data is available
- Control panel with metric, date column, filters, color scheme, legend toggle
- Build query with `groupby` support
- Data transformation pipeline
- 15 unit tests across 4 test suites
