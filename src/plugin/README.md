# Superset Integration Layer (src/plugin/)

Bridges the React component with the Apache Superset ecosystem.

## Files

- **index.ts** -- ChartPlugin class registration. Defines module metadata, sets category to `Filters and controls`, and registers behaviors for both InteractiveChart and NativeFilter.

- **buildQuery.ts** -- SQL query builder. Constructs the query payload sent to the Superset Flask backend. Strips ORDER BY clauses to prevent nested sorting conflicts.

- **controlPanel.ts** -- Form controls definition for the Superset Explore view. Configures color scheme, filter type (native/chart), default value mode (today/month/year), macro shortcuts, cell density, and localization options.

- **transformProps.ts** -- Data transformation pipeline. Maps raw `ChartProps` into `CalendarFilterProps` consumed by the React component. Handles formData forwarding for Native Filter integration.
