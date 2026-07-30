# 📂 Superset Integration Layer (`/src/plugin`)

> **Chart Registration & Pipeline Contracts**

This directory encapsulates the integration logic required to interface the React component with the Apache Superset ecosystem.

## Key Modules
- **`index.ts`**: Defines the `ChartPlugin` class, registering the module, its metadata (`category: Filters and controls`), and operational behaviors.
- **`buildQuery.ts`**: The query builder responsible for forging the SQL payload dispatched to the Superset Flask backend.
- **`controlPanel.ts`**: Configures the UI form controls available in the Superset Explore view.
- **`transformProps.ts`**: The transformation pipeline that maps raw `chartProps` into specific React props injected into the `CalendarFilter` component.
