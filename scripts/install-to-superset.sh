#!/usr/bin/env bash
#
# install-to-superset.sh
#
# One-command installer for the Calendar Filter plugin (Option A / npm).
# Run it from the ROOT of a cloned Superset project (the folder that contains
# both `superset/` and `superset-frontend/`).
#
# Usage:
#   ./install-to-superset.sh            # uses current directory as Superset root
#   ./install-to-superset.sh /path/to/superset
# Or straight from GitHub (from the Superset root):
#   curl -fsSL https://raw.githubusercontent.com/FrancescoCastaldi/superset-plugin-chart-calendar-filter/master/scripts/install-to-superset.sh | bash -s -- .

set -euo pipefail

SUPERSET_ROOT="${1:-.}"
FE="$SUPERSET_ROOT/superset-frontend"

if [ ! -d "$FE" ]; then
  echo "ERROR: superset-frontend/ not found at '$FE'."
  echo "Run this script from the Superset project root (or pass the path as argument)."
  exit 1
fi

cd "$FE"
echo ">> Superset frontend: $FE"

echo ">> Installing plugin from npm..."
npm install --save superset-plugin-chart-calendar-filter

echo ">> Registering plugin in MainPreset..."
node -e '
const fs = require("fs");
const path = "src/visualizations/presets/MainPreset.ts";
if (!fs.existsSync(path)) {
  console.log("   MainPreset.ts not found at " + path + " -- add the registration manually (see README).");
  process.exit(0);
}
let s = fs.readFileSync(path, "utf8");
const KEY = "superset-plugin-chart-calendar-filter";
if (s.includes(KEY)) {
  console.log("   Already registered, skipping.");
  process.exit(0);
}
const imp = "import { SupersetPluginChartCalendarFilter } from '"'"'"'"'"'superset-plugin-chart-calendar-filter'"'"'"'"'"';";
const plug = "      new SupersetPluginChartCalendarFilter().configure({\n        key: '"'"'"'"'"'superset-plugin-chart-calendar-filter'"'"'"'"'"',\n      }),";
const lines = s.split("\n");
let lastImport = -1;
lines.forEach((l, i) => { if (l.trim().startsWith("import ")) lastImport = i; });
if (lastImport >= 0) lines.splice(lastImport + 1, 0, imp); else lines.unshift(imp);
s = lines.join("\n");
const m = s.match(/new\s+\w+Plugin\(\)/);
if (m) {
  const idx = s.indexOf(m[0]);
  s = s.slice(0, idx) + plug + "\n" + s.slice(idx);
  fs.writeFileSync(path, s);
  console.log("   Patched " + path);
} else {
  console.log("   Could not auto-locate the plugin array; add the registration manually (see README).");
}
'

echo ""
echo ">> DONE. Next steps:"
echo "   1. Rebuild the frontend:  npm run dev   (or: npm run build for production)"
echo "   2. Restart the Superset backend."
echo "   3. Open Superset -> + Chart -> 'Calendar Filter' (under 'Other')."