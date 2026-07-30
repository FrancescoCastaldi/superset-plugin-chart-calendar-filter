# 📂 Source Code Directory (`/src`)

> **Core Logic of `superset-plugin-chart-calendar-filter`**

This directory houses the primary TypeScript/React source code for the Superset Calendar Filter plugin. It orchestrates the dual-hybrid architecture (Interactive Chart + Native Filter).

## Key Components
- **`index.ts`**: Main export and registry entry point for the plugin.
- **`CalendarFilter.tsx`**: The core React component managing DOM rendering, state hooks, conditional layouts (inline vs. modal), and styling.
- **`types.ts`**: TypeScript contracts, interfaces, and prop definitions.
- **`plugin/`**: Superset-specific integration layers (`buildQuery`, `transformProps`, `controlPanel`).
- **`utils/`**: Temporal computation and string formatting utilities.
- **`images/`**: Static assets, including the chart picker thumbnail.
