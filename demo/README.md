# Standalone Demo (demo/)

Isolated testing and presentation environment for the Calendar Filter plugin, decoupled from Apache Superset.

## Contents

- **demo-wrapper.tsx** -- React wrapper component that injects mock data and simulates the Superset `setDataMask` hook.
- **demo-bundle.js** -- Pre-compiled esbuild IIFE bundle (~1.2 MB) containing the full plugin and wrapper.
- **index.html** -- Host page that loads the bundle and mounts the demo component.

## Usage

Build the demo bundle:

```
npm run demo:build
```

Open `index.html` in a browser, or serve the directory with any static file server:

```
npx serve demo/
```

The demo renders the calendar heatmap with sample data covering a three-year range (2025-2027), allowing visual inspection of all features (selection, year/month navigation, macro shortcuts, sweep selection, accessibility) outside of a Superset dashboard context.
