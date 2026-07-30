# Test Mocks

This directory contains manual mocks used by Jest during the testing phase. They simulate external dependencies and Superset core modules that are either unavailable in the test environment or require controlled behavior.

## Files
- `emotion-styled.ts`: Mock for `@emotion/styled` to facilitate CSS string parsing in tests.
- `mockExportString.js`: Fallback mock for static asset imports.
- `superset-ui-chart-controls.ts`: Mock for Superset UI chart controls.
- `superset-ui-core.ts`: Mock for `@superset-ui/core` components and utilities.
