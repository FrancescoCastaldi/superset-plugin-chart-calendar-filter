# Changelog

## [0.1.5] - 2026-07-30

### Added
- Monthly / Yearly View Toggle in Native Filter Popover: switch between the Monthly View (single detailed month with high-resolution interactive cells) and the Yearly View (4x3 grid of 12 months) within the expanded Native Filter popover.
- Architectural Documentation for AI (CODE_ARCHITECTURE_MAP.md): comprehensive code map to guide future frontend and backend developments.
- MonthSelect dropdown alongside YearSelect: quick month selection dropdown added to the native filter modal, chart header, and expand modal.

### Fixed
- Current year always included in years dropdown: `availableYears` selector extends its upper range to the current year (`today.getFullYear()`) even when the dataset ends earlier.

## [0.1.4] - 2026-07-28

### Added
- Dynamic Year Selector in Modal: year navigation buttons and year selection dropdown (`<YearSelect>`) in the modal header (Native Filter and Chart), allowing direct selection and navigation to any year.

### Changed
- Yearly View Modal - Rectangular Layout and Positioning: adjusted modal origin (`padding-top: 210px`) to position below the Superset dashboard header/tabs; expanded container to `width: 96%` and `max-width: 1350px` for a 12-month rectangular panoramic view.

### Fixed
- Webpack Stub Modules (0 error build): created complete stubs in `/app/superset-frontend/node_modules/` for `@deck.gl/widgets`, `@react-spring/web` (`animated`, `a`, `useTransition`, `useSpring`, etc.), and `@fontsource/inter` (`100-900.css`). Superset 6.1.0 webpack-dev-server now compiles with 0 errors.

## [0.1.3] - 2026-07-28

### Added
- Native Filter Evolution (`Behavior.NativeFilter`): registered the plugin in the Apache Superset 6.1.0 Native Filters registry using a hybrid architecture, usable as both a Native Filter in the sidebar and an interactive Chart.
- Dual View Layout (Mini Inline + 12-Month Modal): compact 1-month mini calendar for the sidebar filter alongside an Expand button to open a high-resolution 12-month modal popover.
- Configurable Emitted Filter Format: control panel option to choose between native time range (`time_range`) and an ad-hoc list of discrete dates (`IN` clause on column).
- Macro Filters Shortcuts Bar: quick buttons for Year [YYYY], Current Month, Q1-Q4, Weekdays (Mon-Fri), and Clear.
- Configurable Default Values: customizable initial filter selection (No filter, Today, Current Month, Current Year, Custom Range).
- Italian Localization: full Italian translation of all UI components (weekdays, months, Today, Clear, Year/Month, Expand Modal buttons, and tooltips).
- Unit Tests (44/44): expanded Jest test suite to 44 passing unit tests.

### Changed
- Aseptic Plain Cell Styling: removed data-intensity conditional background gradient/heatmap. Unselected cells now have a neutral white background (`#ffffff`) with a discrete border (`1px solid #e2e8f0`).

### Fixed
- Nested Query OrderBy Stripping: removed `ORDER BY` clause insertion in `buildQuery.ts` to prevent SQL errors on nested subqueries in Apache Superset.

## [0.1.2] - 2026-07-27

### Fixed
- Cross-filter compatibility with Superset 6.1.0: `transformProps` now passes `hooks.setDataMask`, `filterState`, and `dateColumn` to the component; plugin metadata declares `behaviors: [Behavior.InteractiveChart]` so dashboards include it in cross-filter scope; cross-filter payload now uses the real date column (`dateColumn ?? '__timestamp'`) instead of non-existent `__time_range`.
- Timezone-safe date parsing: `YYYY-MM-DD` strings are parsed with local `new Date(y, m-1, d)` to avoid UTC-negative timezone shifts.
- Peer dependencies: added `@apache-superset/core` and `@emotion/styled`; React range expanded to `^16.13.1 || ^17.0.0`.

## [0.1.1] - 2026-07-18

### Changed
- Compact redesign: cells reduced from `aspect-ratio: 1` to 30px fixed height, header padding cut 50%, grid gap reduced to 1px, overall footprint approximately 35% smaller.
- GitHub-inspired color palettes: all 6 palettes updated to contribution-graph style gradients (`#ebedf0` to `#216e39` etc.).
- Modern look: border-radius 4px, subtle selection rings (2px + 3px), smoother 0.2s transitions, higher-contrast day numbers.
- Compact nav buttons: icon-only style with 4px padding, smaller typography throughout.

### Added
- Today indicator: green dot below the current day's cell, also shown in year overview.
- Smart selection badge: shows formatted range ("12-15 Mar 2026") instead of generic count.
- Cell Density option: new `Cell Density` control in Calendar Options (Compact/Normal) toggles cell size between 30px and 38px.
- Empty state: calendar icon with centered message when no data.
- Transient props: added `$isToday`, `$cellHeight` transient props to styled components to prevent DOM leakage.

### Tests
- 27/27 tests pass (4 suites).
- Updated badge test to match new range format.
- Added `cellDensity` to mock/styled props filter list.

## [0.1.0] - 2026-07-08

### Added
- Initial scaffold with package.json, babel, TypeScript, Jest.
- `CalendarFilter.tsx` - interactive calendar heatmap component.
- Month navigation (prev/next) with month/year display.
- Color-coded day cells with 6 color palettes.
- Date selection with toggle behavior.
- Cross-filter API via `setDataMask()` with `__time_range`.
- Legend showing color scale (min/max values).
- Empty state when no data is available.
- Control panel with metric, date column, filters, color scheme, legend toggle.
- Build query with `groupby` support.
- Data transformation pipeline.
- 15 unit tests across 4 test suites.
