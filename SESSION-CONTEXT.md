# 🔄 Calendar Filter Superset Plugin — Session Context

> **Last updated**: 2026-07-12 (Sunday)
> **Project**: `superset-plugin-chart-calendar-filter` for Apache Superset 6.1.0
> **GitHub**: https://github.com/FrancescoCastaldi/superset-plugin-chart-calendar-filter

## Quick Resume

### 1. Start Superset backend
```powershell
cd C:\...\superset-6.1.0
.\venv\Scripts\Activate.ps1
superset run -p 8088 --with-threads --reload --debugger
```

### 2. Start webpack-dev-server
```powershell
cd C:\...\superset-6.1.0\superset-frontend
node --max_old_space_size=4096 node_modules/webpack-dev-server/bin/webpack-dev-server.js --mode=development
```

### 3. Access the app
- **Flask (port 8088)**: http://localhost:8088/login/ — serves stale static assets
- **webpack-dev-server (port 9000)**: proxies to Flask but HTML decompression is broken

Login: `admin` / `password`
Explore chart: http://localhost:8088/explore/?slice_id=1

## Current State

### What works
- ✅ Plugin builds: `npm run build` → 27/27 tests pass
- ✅ Theme null-safety: all 61 `theme.*` accesses have optional chaining with defaults
- ✅ SQLite databases registered: `Test Calendar` (id:2), `Events DB` (id:3)
- ✅ Dataset `main.events` (id:7) with 1095 rows (2025-01-01 to 2027-12-31)
- ✅ Chart `Calendar Filter Test` (id:1) created, query executes (465 rows)
- ✅ Plugin registered in Superset chart picker under "Other"

### What's broken
- ❌ **Chunk file corrupted**: `superset/static/assets/Calendar-Filter-Superset_esm_CalendarFilter_js.*.chunk.js` → 25MB from bad regex patching
- ❌ **Port 9000**: garbled HTML (proxy decompression issue in `webpack.proxy-config.js`)
- ❌ **Port 8088**: serves stale chunk file (no theme fix)
- ❌ **Production build**: blocked by 22 pre-existing geostyler ESM errors

### Next step
Regenerate the chunk file with the fixed theme code. Options:
1. **Fix proxy** (`webpack.proxy-config.js`) → use port 9000 → dev server compiles fresh
2. **Fix geostyler errors** → production build writes fresh assets
3. **Direct chunk patch** → copy the fixed `esm/CalendarFilter.js` content into the eval code

## Key files
- `src/CalendarFilter.tsx` — main component (theme fix applied)
- `esm/CalendarFilter.js` — fixed build output (safe theme access)
- `../superset-6.1.0/superset/static/assets/` — stale build artifacts
- `../superset-6.1.0/superset-frontend/webpack.proxy-config.js` — broken proxy decompression
- `../superset-6.1.0/superset-frontend/src/visualizations/presets/MainPreset.ts` — plugin registration
- `../superset-6.1.0/superset/security/analytics_db_safety.py` — SQLite unblocked (line 29-31)
- `../superset-6.1.0/sample_data.db` — test data (events table)
