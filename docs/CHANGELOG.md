# Changelog

## [0.1.4] — 2026-07-28

### Changed
- **Modal Vista Annuale — Layout Rettangolare & Posizionamento**: abbassata l'origine del modal (`padding-top: 145px`) per evitare qualsiasi sovrapposizione con l'header e le schede della dashboard Superset; allargato il contenitore a `width: 96%` e `max-width: 1350px` per una visualizzazione rettangolare panoramica a 12 mesi.

### Fixed
- **Webpack Stub Modules (0 error build)**: creati stub completi in `/app/superset-frontend/node_modules/` per `@deck.gl/widgets` (export sia prefissati `_` che standard), `@react-spring/web` (`animated`, `a`, `useTransition`, `useSpring`, ecc.), e `@fontsource/inter` (`100-900.css`). Il webpack-dev-server di Superset 6.1.0 compila ora con **0 errori**.

## [0.1.3] — 2026-07-28

### Added
- **Native Filter Evolution (`Behavior.NativeFilter`)**: registrazione del plugin nel registro Native Filters di Apache Superset 6.1.0 in architettura ibrida per l'utilizzo sia come Native Filter nella barra laterale che come Chart interattivo.
- **Dual View Layout (Mini Inline + Modal 12 Mesi)**: mini calendario compatto a 1 mese per la barra filtri laterale affiancato dal pulsante `🖥️ Espandi` per l'apertura di un modal popover ad alta risoluzione a 12 mesi.
- **Formato Filtro Emesso Configurabile**: scelta nel pannello di controllo tra intervallo temporale nativo (`time_range`) e lista adhoc di date discrete (clausola `IN` su colonna).
- **Barra Scorciatoie Macro Filtri**: pulsanti rapidi per *🎯 Anno [YYYY]*, *📅 Mese Corrente*, *📊 Q1-Q4*, *💼 Feriali (Lun-Ven)* e *❌ Azzera*.
- **Valori di Default Configurabili**: selezione iniziale del filtro personalizzabile da pannello (*Nessun filtro*, *Oggi*, *Mese Corrente*, *Anno Corrente*, *Intervallo Personalizzato*).
- **Italian Localization**: traduzione completa in italiano di tutti i componenti UI (giorni della settimana, mesi, pulsanti *Oggi*, *Azzera*, *Anno/Mese*, *Espandi Modal*, e tooltip).
- **Test Unitari (44/44)**: estesa la suite di test Jest a 44 test unitari passati con successo.

### Changed
- **Aseptic Plain Cell Styling**: rimosso lo sfondo gradiente/heatmap condizionato dall'intensità dei dati. Le caselle non selezionate ora hanno uno sfondo bianco neutro (`#ffffff`) con bordo discreto (`1px solid #e2e8f0`).

### Fixed
- **Nested Query OrderBy Stripping**: rimosso l'inserimento di clausole `ORDER BY` in `buildQuery.ts` per prevenire errori SQL su sottoquery annidate in Apache Superset.

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
