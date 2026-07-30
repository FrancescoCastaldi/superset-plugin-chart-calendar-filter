# Plugin Registry & Metadata

This directory contains the core Apache Superset chart plugin registration logic, metadata definition, query building, and data transformation pipeline.

## Files
- `buildQuery.ts`: Constructs the query context (metrics, groupby, filters) to be sent to the Superset backend.
- `controlPanel.ts`: Defines the configuration options and UI controls available in the Explore view.
- `index.ts`: The main entry point for registering the `ChartPlugin` and `ChartMetadata`.
- `transformProps.ts`: Transforms the data returned by the backend into props suitable for the React component.
