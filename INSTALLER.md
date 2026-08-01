# Calendar Filter Plugin — Automatic Installer for Apache Superset

## Overview

`install-calendar-filter.bat` is a **zero-configuration, drop-in installer** for the `superset-plugin-chart-calendar-filter` plugin. Place it in the root directory of an Apache Superset checkout (alongside `docker-compose.yml` and `superset-frontend/`), double-click, and it will:

1. **Auto-discover** the plugin source code on the local filesystem
2. **Build** the plugin if artifacts are missing (`lib/` directory)
3. **Install** the plugin as a file dependency into `superset-frontend`
4. **Register** the chart in `MainPreset.ts` / `MainPreset.js` automatically
5. **Optionally generate** a `docker-compose.override.yml` for containerized development

No manual path configuration, no editing of Superset source files, no CLI required.

---

## Prerequisites

| Tool | Minimum Version | Notes |
|------|----------------|-------|
| **Node.js** | 18+ | Must be in system `PATH` |
| **npm** | 9+ | Bundled with Node.js |
| **Docker & Docker Compose** | Latest | Optional, only if you choose the Docker override |
| **PowerShell** | 5.1+ | Built into Windows; used for TypeScript/JS patching |

---

## Installation Procedure

### 1. Copy the Installer

Copy `install-calendar-filter.bat` from the plugin repository root into your **Superset root directory**:

```
<superset-root>/
├── docker-compose.yml
├── docker-compose-non-dev.yml
├── superset-frontend/
│   └── package.json
└── install-calendar-filter.bat   ← place here
```

### 2. Run the Installer

Double-click `install-calendar-filter.bat` in Windows Explorer, or run from an elevated Command Prompt:

```cmd
cd <superset-root>
install-calendar-filter.bat
```

### 3. Follow the Prompts

The script will:

- **Search** for the plugin source in standard locations (see *Plugin Discovery* below)
- **Build** the plugin if `lib/` is absent (`npm ci && npm run build`)
- **Install** into `superset-frontend` via `npm install --save <plugin-path>`
- **Patch** `MainPreset.ts` / `MainPreset.js` to register the chart
- **Ask** whether to create a Docker Compose override (type `y` + Enter)

---

## Plugin Discovery Mechanism

The installer searches the following locations **in order**:

1. **`%SUPERSET_PLUGIN_PATH%`** — Explicit environment variable (highest priority)
2. **Sibling folder** — `..\Calendar-Filter-Superset` (relative to Superset root)
3. **Sibling folder** — `..\superset-plugin-chart-calendar-filter`
4. **Sibling folder** — `..\Calendar-Filter-Superset` (alternative naming)
5. **OneDrive** — `%USERPROFILE%\OneDrive - mapsengineering.com\Calendar-Filter-Superset`
6. **Documents** — `%USERPROFILE%\Documents\Calendar-Filter-Superset`
7. **Source/Repos** — `%USERPROFILE%\source\repos\Calendar-Filter-Superset`
8. **Projects** — `%USERPROFILE%\Projects\Calendar-Filter-Superset`
9. **C:\Projects** — `C:\Projects\Calendar-Filter-Superset`
10. **D:\Projects** — `D:\Projects\Calendar-Filter-Superset`

### Override via Environment Variable

Set `SUPERSET_PLUGIN_PATH` to point directly to the plugin root (the folder containing `package.json`):

```cmd
setx SUPERSET_PLUGIN_PATH "C:\path\to\Calendar-Filter-Superset"
```

Or for the current session only:

```cmd
set SUPERSET_PLUGIN_PATH=C:\path\to\Calendar-Filter-Superset
install-calendar-filter.bat
```

This is the **recommended method** for CI/CD, non-standard layouts, or when the plugin lives on a different drive.

---

## What the Installer Does (Technical Details)

### Build Step
```cmd
cd <plugin-root>
npm ci
npm run build
```
Produces `lib/` (CommonJS), `esm/` (ES Modules), and TypeScript declarations.

### Installation Step
```cmd
cd <superset-root>\superset-frontend
set NPM_CONFIG_INSTALL_LINKS=true
npm install --save <plugin-root>
```
- `NPM_CONFIG_INSTALL_LINKS=true` forces npm to pack the local dependency instead of symlinking, avoiding Windows cross-volume junction issues.
- The dependency is recorded in `package.json` as a `file:` specifier.

### Registration Step (MainPreset Patching)

The embedded PowerShell snippet:

1. Reads `MainPreset.ts` or `MainPreset.js` from `superset-frontend/src/visualizations/presets/`
2. Checks if the plugin is already registered (idempotent)
3. Injects the import statement after the last existing `import` line
4. Inserts the plugin entry into the `plugins` array, preferably after `CalendarChartPlugin` or at the first plugin entry
5. Writes back with UTF-8 encoding, preserving formatting

**Backup**: The original file is copied to `MainPreset.ts.bak` / `MainPreset.js.bak` before modification.

### Docker Compose Override (Optional)

If confirmed, generates `docker-compose.override.yml` in the Superset root:

```yaml
services:
  superset:
    volumes:
      - /host/path/to/Calendar-Filter-Superset:/Calendar-Filter-Superset:delegated
    environment:
      DEV_MODE: 'false'
  superset-node:
    volumes:
      - /host/path/to/Calendar-Filter-Superset:/Calendar-Filter-Superset:delegated
    environment:
      NPM_CONFIG_install_links: 'true'
  superset-worker:
    volumes:
      - /host/path/to/Calendar-Filter-Superset:/Calendar-Filter-Superset:delegated
    environment:
      DEV_MODE: 'false'
  superset-worker-beat:
    volumes:
      - /host/path/to/Calendar-Filter-Superset:/Calendar-Filter-Superset:delegated
    environment:
      DEV_MODE: 'false'
```

- The plugin path is converted to Unix-style (`/c/Projects/...`) for container mount resolution.
- Services are auto-detected via `docker compose config --services`; falls back to the standard four services if detection fails.
- `NPM_CONFIG_install_links=true` in `superset-node` ensures the file dependency is packed inside the container.

---

## Starting Superset After Installation

### Option A: Native Frontend Dev Server (Hot Reload)

```cmd
cd <superset-root>\superset-frontend
npm run dev-server
```
- Webpack dev server on `http://localhost:9000` (proxies to Flask backend on `:8088`)
- Requires backend running separately: `cd <superset-root> && python -m superset run -h 0.0.0.0 -p 8088 --with-threads --reload --debugger`

### Option B: Docker Compose (Recommended for Full Stack)

```cmd
cd <superset-root>
docker compose -f docker-compose-non-dev.yml up -d
```
Or if you used the override and want the standard compose file:
```cmd
docker compose up -d
```

**Services started**:
- `superset` — Flask backend (port 8088)
- `superset-node` — Webpack dev server (port 9000)
- `superset-worker` — Celery worker
- `superset-worker-beat` — Celery beat scheduler

**Access**: `http://localhost:8088` (default credentials: `admin` / `admin`)

### Option C: Production-like Build

```cmd
cd <superset-root>\superset-frontend
npm run build
```
Then start backend only:
```cmd
cd <superset-root>
python -m superset run -h 0.0.0.0 -p 8088
```

---

## Verifying the Installation

1. Open Superset at `http://localhost:8088`
2. Log in (`admin` / `admin`)
3. Navigate to **Charts → + Chart**
4. In the visualization picker, under **Other**, select **Calendar Filter**
5. Choose a dataset with a date column and a metric
6. The calendar heatmap should render with navigation, selection, and cross-filter capabilities

---

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| `[ERROR] Plugin source not found` | Plugin not in search paths | Set `SUPERSET_PLUGIN_PATH` or place plugin as sibling folder |
| `[ERROR] superset-frontend/package.json not found` | Script not in Superset root | Copy installer to the folder containing `docker-compose.yml` |
| `[ERROR] npm ci failed` | Node/npm version mismatch or network | Use Node 18+, check `npm config get registry` |
| `[ERROR] npm install failed` | Peer dependency conflict | Ensure Superset frontend dependencies are installed first (`npm ci` in `superset-frontend`) |
| `MainPreset.ts/js not found` | Superset version mismatch | Manual registration required (see output) |
| `docker compose config --services` fails | Docker not running or compose file invalid | Start Docker Desktop, validate compose syntax |
| Chart not appearing in picker | Frontend not rebuilt | Run `npm run dev-server` or `docker compose up -d --build` |
| Cross-filter not working | Native filter not configured | Ensure dataset date column matches `date_column` control; verify `order_date` filter propagation |

---

## Uninstalling / Reverting

1. **Remove plugin dependency**:
   ```cmd
   cd <superset-root>\superset-frontend
   npm uninstall superset-plugin-chart-calendar-filter
   ```

2. **Restore MainPreset** (if auto-patched):
   ```cmd
   copy <superset-root>\superset-frontend\src\visualizations\presets\MainPreset.ts.bak <superset-root>\superset-frontend\src\visualizations\presets\MainPreset.ts
   ```

3. **Remove Docker override** (if created):
   ```cmd
   del <superset-root>\docker-compose.override.yml
   ```

4. **Rebuild frontend**:
   ```cmd
   cd <superset-root>\superset-frontend
   npm run build
   ```

---

## File Reference

| File | Purpose |
|------|---------|
| `install-calendar-filter.bat` | Main installer (this document) |
| `scripts/install-to-superset.ps1` | PowerShell installer (advanced options: `--link`, `--docker`, `--test`) |
| `scripts/install-to-superset.sh` | Bash installer for Linux/macOS |
| `scripts/install.py` | Cross-platform Python installer (zero-touch) |

---

## License

Apache 2.0 — see `LICENSE` in the plugin repository.