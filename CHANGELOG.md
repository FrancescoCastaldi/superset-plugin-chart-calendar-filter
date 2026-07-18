# Changelog

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
