# test/

## Responsibility

Contains the automated test suite (51 Jest unit and integration tests), test mocks (`__mocks__/`), component tests (`CalendarFilter.test.tsx`), utility tests (`utils/`), and plugin metadata tests (`plugin/`).

## Design

- **Framework**: Jest 29 with `jest-environment-jsdom` and `@testing-library/react`.
- **Mocks**: Mocks `@superset-ui/core`, `@superset-ui/chart-controls`, and `@emotion/styled` in `__mocks__/` to isolate plugin logic from Apache Superset container dependencies.
- **Coverage**: Tests component rendering, month navigation, single-click & shift-click selection, drag-sweep selection, macro shortcuts, A11y keyboard interactions, date utilities, buildQuery SQL generation, and transformProps logic.

## Flow

`npm test` / CI pipeline -> Jest test runner -> executes test suites in parallel -> reports pass/fail status and coverage.

## Integration

Integrated with `package.json` test script and GitHub Actions CI workflow (`.github/workflows/ci.yml`).
