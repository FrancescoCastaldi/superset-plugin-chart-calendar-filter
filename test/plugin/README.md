# 📂 Plugin Unit Tests (`/test/plugin`)

> **Integration Layer Verification**

This directory contains Jest test suites validating the Superset data pipeline bridges.
- **`buildQuery.test.ts`**: Asserts the correct generation of SQL query payloads and the prevention of nested `ORDER BY` anomalies.
- **`transformProps.test.ts`**: Verifies the correct extraction and mapping of `chartProps` (including `formData` forwarding for Native Filters).
