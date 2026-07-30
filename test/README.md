# Testing Suite (test/)

Functional verification and unit testing for the Calendar Filter plugin.

## Overview

44 tests across 5 test suites using Jest 29, jsdom, and @testing-library/react.

## Tested Features

- Calendar heatmap rendering with GitHub-style base styling
- Month and year navigation controls
- Current day indicator highlight
- Single day toggle selection
- Continuous date range selection (click-and-drag sweep, shift-click)
- Macro shortcut buttons (Select All, Year, Month, Q1-Q4, Working Days)
- Native Filter and Expand modal views
- Year/Month dual view toggle
- Keyboard accessibility (focus management, Enter toggle)
- Tooltip display on hover
- Default value modes (today, current month, current year)
- Filter emission via setDataMask and native filter API
- Selection badge count display
- Cell density mode switching

## Configuration

- Chart type: Calendar Filter
- Viz type: `superset-plugin-chart-calendar-filter`
- Metric: COUNT(*) or custom metric
- Date column: Dataset primary temporal column
- Time range: Unfiltered

## Test Frameworks

- Jest 29
- jsdom (DOM environment)
- @testing-library/react (component queries)
- Custom mocks for @superset-ui/core, @superset-ui/chart-controls, @emotion/styled
