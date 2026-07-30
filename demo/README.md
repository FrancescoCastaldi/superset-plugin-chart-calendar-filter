# 📂 Standalone Demo (`/demo`)

> **Isolated Testing & Presentation Environment**

This directory contains a self-contained, standalone demonstration of the Calendar Filter plugin. It enables rapid prototyping, isolated UI testing, and presentation of the component completely decoupled from the Apache Superset core engine.

## Infrastructure
- **`demo-wrapper.tsx`**: React wrapper injecting mock datasets and simulating the `setDataMask` Superset hook.
- **`server.js`**: Lightweight HTTP server to serve the bundle locally.
- **`index.html`**: Entry point for the isolated DOM.
- **`demo-bundle.js`**: Pre-compiled esbuild bundle.
