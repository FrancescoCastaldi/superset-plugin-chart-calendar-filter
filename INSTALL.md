# Install in an existing Apache Superset

This guide explains how to add the **Calendar Filter** plugin to a Superset checkout you already have on disk.

For the automated one-command installer, see the [README](README.md#install-in-an-existing-superset).

## Manual install

### 1. Build the plugin

From the plugin root:

```bash
cd superset-plugin-chart-calendar-filter
npm install --legacy-peer-deps
npm run build
```

This produces `lib/` (CommonJS), `esm/` (ES Modules), and TypeScript declarations, and runs the full test suite.

### 2. Install the plugin into Superset

From your Superset frontend directory:

```bash
cd superset-frontend
npm install --save /absolute/path/to/superset-plugin-chart-calendar-filter
```

Use the absolute path to the plugin root (the folder that contains `package.json`). On Windows PowerShell you can obtain it with `Resolve-Path ..\..\superset-plugin-chart-calendar-filter`.

### 3. Register the plugin

Open `superset-frontend/src/visualizations/presets/MainPreset.ts` (it may be `MainPreset.js` in older Superset versions) and add:

```ts
import { SupersetPluginChartCalendarFilter } from 'superset-plugin-chart-calendar-filter';
```

Then, inside the preset constructor's `plugins:` array, add the plugin entry alongside the other `new XxxPlugin().configure({ ... })` lines:

```ts
new SupersetPluginChartCalendarFilter().configure({
  key: 'superset-plugin-chart-calendar-filter',
}),
```

The exact location does not matter as long as the entry is inside the `plugins:` array.

### 4. Rebuild the frontend

From `superset-frontend/`:

```bash
npm run dev-server   # development with hot reload
```

For a production build:

```bash
npm run build
```

### 5. Restart the backend

Restart the Flask backend (`superset run` or your dev server). The **Calendar Filter** chart will now appear in the chart picker under **Other**.

## Development mode with npm link

If you are actively changing the plugin source, use `npm link` so Superset picks up rebuilds automatically:

```bash
# in the plugin root
npm link

# in superset-frontend
npm link superset-plugin-chart-calendar-filter
```

Then register the plugin in `MainPreset.ts` as shown above and run `npm run dev-server`.

## Troubleshooting

- **Chart does not appear in the picker** -- double-check that the `key` string is exactly `superset-plugin-chart-calendar-filter` in both `MainPreset` and the plugin, then restart the frontend.
- **Build errors** -- ensure you are using Node.js 16+ and that Superset's peer dependencies are installed.
- **Registration already present** -- the installer is idempotent; if you run it twice it will detect the plugin and skip the patch.
