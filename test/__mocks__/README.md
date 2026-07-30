# Jest Mocks (test/__mocks__/)

Mock modules that simulate the Apache Superset runtime environment during isolated testing.

## Files

- **@superset-ui/core** -- Stubs core Superset dependencies: createTheme, ThemeProvider, ChartProps, DataMaskProvider, styled, css, SupersetClient, logging, and translation functions.

- **@superset-ui/chart-controls** -- Stubs chart control components and types used in controlPanel validation.

- **emotion-styled** -- Simulates CSS-in-JS behavior for @emotion/styled. Converts tagged template literals to style objects so snapshot tests receive plain className attributes rather than Emotion-generated class names.

- **mockExportString.js** -- CommonJS helper that returns an empty object for modules that only need an export shape during import resolution.
