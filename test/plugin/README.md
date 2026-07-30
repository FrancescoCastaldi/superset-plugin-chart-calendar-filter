# Plugin Unit Tests (test/plugin/)

Jest test suites for the Superset integration layer.

## Files

- **buildQuery.test.ts** -- Validates SQL query payload generation. Ensures correct metric and groupby construction. Confirms ORDER BY clauses are stripped to prevent nested sorting conflicts.

- **transformProps.test.ts** -- Verifies ChartProps to CalendarFilterProps mapping. Tests formData forwarding for Native Filter integration and correct data transformation pipeline behavior.
