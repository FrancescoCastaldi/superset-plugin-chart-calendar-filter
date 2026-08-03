# demo/

## Responsibility

Houses the standalone demo application (`index.html`, `demo-wrapper.tsx`) and bundled assets (`demo-bundle.js`, screenshots) for previewing the calendar filter plugin in isolation outside Apache Superset.

## Design

- **Bundler**: Bundled using esbuild as an IIFE library.
- **Mock Data**: `demo-wrapper.tsx` supplies mock timeseries datasets to test UI interactions, color palettes, and macro selection controls without requiring a running Flask/PostgreSQL backend.

## Flow

Opening `index.html` in browser -> loads `demo-bundle.js` -> mounts `demo-wrapper.tsx` -> renders `CalendarFilter.tsx` with mock data.

## Integration

Used for standalone visual verification, UI testing, and creating showcase screenshots.
