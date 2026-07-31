# Installation Guide

This guide explains how to add the Calendar Filter plugin to an existing Apache Superset checkout.

## Quick Start (Automated Installer)

Run the Python installer from the plugin root:

```bash
python install.py --superset-path /path/to/superset-6.1.0
```

This single command automatically:
1. Adds `"superset-plugin-chart-calendar-filter"` to `superset-frontend/package.json`.
2. Registers `SupersetPluginChartCalendarFilter` under "Filters and controls" in `MainPreset.ts`.
3. Applies TypeScript type-checking compatibility fixes (`AceEditorProvider.tsx`).
4. Prepares `superset-frontend` for build or dev-server execution.

---

## Manual Install

### 1. Build the Plugin

From the plugin root:

```bash
cd superset-plugin-chart-calendar-filter
npm install --legacy-peer-deps
npm run build
```

This produces `lib/` (CommonJS), `esm/` (ES Modules), and TypeScript declarations, and runs the full test suite.

### 2. Install the Plugin into Superset

From your Superset frontend directory:

```bash
cd superset-frontend
npm install --save /absolute/path/to/superset-plugin-chart-calendar-filter
```

Use the absolute path to the plugin root (the folder containing `package.json`). On Windows PowerShell, obtain it with `Resolve-Path ..\..\superset-plugin-chart-calendar-filter`.

### 3. Register the Plugin

Open `superset-frontend/src/visualizations/presets/MainPreset.ts` (may be `MainPreset.js` in older Superset versions) and add:

```ts
import { SupersetPluginChartCalendarFilter } from 'superset-plugin-chart-calendar-filter';
```

Inside the preset constructor's `plugins:` array, add the plugin entry:

```ts
new SupersetPluginChartCalendarFilter().configure({
  key: 'superset-plugin-chart-calendar-filter',
}),
```

### 4. Rebuild the Frontend

From `superset-frontend/`:

```bash
npm run dev-server   # development with hot reload
```

For a production build:

```bash
npm run build
```

### 5. Restart the Backend

Restart the Flask backend (`superset run` or your dev server). The Calendar Filter chart will appear in the chart picker under "Other".

---

## Automatic Installer (Alternative)

The plugin includes a cross-platform installer script.

### Windows PowerShell

```powershell
.\scripts\install-to-superset.ps1 -SupersetRoot C:\path\to\superset
```

### Linux / macOS

```bash
./scripts/install-to-superset.sh --superset-root /path/to/superset
```

### With Docker and Verification

```powershell
.\scripts\install-to-superset.ps1 -SupersetRoot C:\path\to\superset -Docker -Test
```

### Installer Parameters

| Windows | Linux / macOS | Description |
|---|---|---|
| `-SupersetRoot` | `--superset-root` | Path to your Superset checkout. Required. |
| `-SkipBuild` | `--skip-build` | Skip the plugin build if you already have `lib/` and `esm/`. |
| `-Link` | `--link` | Use `npm link` instead of a `file:` dependency for development. |
| `-Docker` | `--docker` | Also configure the Docker Compose override for Superset. |
| `-Test` | `--test` | Run build verification after installation. |
| `-Help` | `--help` | Show the script usage and exit. |

Use `-Link` (or `--link`) when actively changing plugin code; Superset picks up rebuilds automatically.

---

## Development Mode with npm link

If you are actively changing the plugin source, use `npm link` so Superset picks up rebuilds automatically:

```bash
# in the plugin root
npm link

# in superset-frontend
npm link superset-plugin-chart-calendar-filter
```

Then register the plugin in `MainPreset.ts` as shown above and run `npm run dev-server`.

---

## Troubleshooting

- **Chart does not appear in the picker** -- verify that the `key` string is exactly `superset-plugin-chart-calendar-filter` in both `MainPreset` and the plugin, then restart the frontend.
- **Build errors** -- ensure you are using Node.js 16+ and that Superset's peer dependencies are installed.
- **Registration already present** -- the installer is idempotent; running it twice detects the plugin and skips the patch.
- **Peer dependency conflicts** -- Superset 6.1 resolves some peer ranges differently than npm 7+. If you see `ERESOLVE` errors, set npm to use legacy peer deps:

  ```bash
  npm config set legacy-peer-deps true
  ```

  This is also the default when using the Docker Compose override.

---

## Docker Compose

If you run Superset via Docker Compose, the plugin ships a `docker-compose.yml` that adds the required mounts alongside Superset's native `docker-compose.yml`.

### Prerequisites
- Superset cloned and checked out at your target version
- Node.js 16+ for the initial plugin build

### Usage

```bash
# 1. Build the plugin first (from plugin root)
npm install --legacy-peer-deps
npm run build

# 2. Launch Superset with the plugin add-on (from Superset root)
docker compose -f docker-compose.yml -f ../Calendar-Filter-Superset/docker-compose.yml up -d
```

This mounts the plugin into the `superset`, `superset-node`, `superset-worker`, and `superset-worker-beat` containers at `/Calendar-Filter-Superset`, so the npm `file:` dependency resolves correctly.

### Override File Alternative

For a simpler setup, copy the `docker-compose.yml` from the plugin into your Superset root and use it as an override:

```bash
cp ../Calendar-Filter-Superset/docker-compose.yml docker-compose.calendar-filter.yml
docker compose -f docker-compose.yml -f docker-compose.calendar-filter.yml up -d
```

Or merge the services block into your own `docker-compose.override.yml`.

### Environment Variables

The add-on sets:
- `DEV_MODE=false` -- skips slow UV editable reinstalls on the backend (packages are already in the Docker image)
- `NPM_CONFIG_legacy_peer_deps=true` -- fixes npm ERESOLVE on Superset 6.1 frontend

> Windows note: Docker Desktop needs file sharing access to the Calendar-Filter-Superset folder (Docker Settings > Resources > File Sharing > Add Folder).

### Docker development notes (avoiding stale plugin builds)

Inside the container (`superset-node`), the `file:` dependency is installed as a **copy** (not a symlink) and the container entrypoint re-runs `npm install` at boot, which overwrites your rebuilt plugin with a stale copy.

Workaround used in development:

1. Build the plugin: `npm run build` (writes `esm/`, `lib/`, `types/`).
2. Copy the outputs into the container's `node_modules`:

   ```bash
   docker exec <superset-node-container> sh -c "cd /app/superset-frontend/node_modules/superset-plugin-chart-calendar-filter && rm -rf esm lib types package.json && cp -r /Calendar-Filter-Superset/esm ./esm && cp -r /Calendar-Filter-Superset/lib ./lib && cp -r /Calendar-Filter-Superset/types ./types && cp /Calendar-Filter-Superset/package.json ./package.json && rm -rf /app/superset-frontend/node_modules/.cache"
   ```

3. Restart the container with `docker restart` (NOT `docker compose up -d` — recreating the container restores `node_modules` from the image layer and reverts the copy).
4. Wait for the full webpack compile (~6-10 min with a cleared cache) and verify the served chunk: `ls -t /app/superset/static/assets/ | grep calendar | grep -v legacy | head -1`.

To prevent the boot-time `npm install` from clobbering the copy, set `BUILD_SUPERSET_FRONTEND_IN_DOCKER: false` in the compose file and start the frontend directly, e.g. `command: ["sh", "-c", "cd /app/superset-frontend && npm run dev-server"]`.
