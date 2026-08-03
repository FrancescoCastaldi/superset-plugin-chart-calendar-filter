# Calendar Filter Plugin — Automatic Installer for Apache Superset

## Overview

`install.js` is a **zero-configuration, cross-platform installer** for the `superset-plugin-chart-calendar-filter` plugin. Running it inside your terminal:

```bash
node install.js [path/to/superset-root]
```

This script will:

1. **Auto-discover** or prompt for the Apache Superset repository location.
2. **Build** the plugin if build artifacts (`lib/` directory) are missing.
3. **Register** the plugin as a local file dependency in `superset-frontend/package.json`.
4. **Patch** `MainPreset.ts` / `MainPreset.js` to register the chart in Superset's visualizations list.
5. **Prompt** for optional configurations:
   - Generating a `docker-compose.override.yml` for containerized environments.
   - Applying the TS2344 compile compatibility workaround in `editors/AceEditorProvider.tsx`.
   - Whitelisting the plugin in `FILTER_SUPPORTED_TYPES` in `constants.ts` (required for native filters popover choice).

---

## Prerequisites

| Tool | Minimum Version | Notes |
|------|----------------|-------|
| **Node.js** | 18+ | Required (already needed to build Apache Superset) |
| **npm** | 9+ | Bundled with Node.js |

---

## Installation Procedure

### 1. Run the Installer

Run the script from this folder directory:

**Windows (double-click):**
Double-click `install.bat`

**Command line:**
```bash
node install.js
```

### 2. Follow the Prompts

The installer will guide you through the process, prompting you to confirm paths and choose whether to apply advanced fixes and Docker Compose overrides.

---

## Manual Verification

1. Go to `superset-frontend` and run:
   ```bash
   npm install
   npm run dev-server
   ```
2. Open Superset at `http://localhost:8088`.
3. Add a new Chart -> "Calendar Filter" (under "Other" category).
