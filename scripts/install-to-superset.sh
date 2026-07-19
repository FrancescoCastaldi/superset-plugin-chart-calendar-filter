#!/usr/bin/env bash
#
# install-to-superset.sh
#
# One-command installer for the Calendar Filter plugin into an existing
# Apache Superset checkout.
#
# Usage:
#   ./install-to-superset.sh [OPTIONS] [SUPERSET_ROOT]
#
#   SUPERSET_ROOT defaults to, in order:
#     $1, $SUPERSET_HOME, ../superset, ../superset-6.1.0, ./superset
#
# Options:
#   --skip-build   Skip the plugin build step (use when lib/ already exists)
#   --link         Use npm link instead of npm install (development mode)
#   -h, --help     Show this help
#
# Examples:
#   ./install-to-superset.sh
#   ./install-to-superset.sh ../superset-6.1.0
#   ./install-to-superset.sh --link ../superset
#   curl -fsSL https://raw.githubusercontent.com/FrancescoCastaldi/superset-plugin-chart-calendar-filter/master/scripts/install-to-superset.sh | bash -s -- ../superset-6.1.0

set -euo pipefail

PLUGIN_NAME="superset-plugin-chart-calendar-filter"
PLUGIN_KEY="superset-plugin-chart-calendar-filter"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

usage() {
  sed -n '/^# Usage:/,/^# Examples:/p' "$0" | sed 's/^# //; s/^#$//'
  exit 1
}

SKIP_BUILD=false
USE_LINK=false
SUPERSET_ROOT=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-build) SKIP_BUILD=true; shift ;;
    --link)       USE_LINK=true; shift ;;
    -h|--help)    usage ;;
    --)           shift; break ;;
    -*)
      echo "ERROR: unknown option $1" >&2
      usage
      ;;
    *)
      if [[ -z "$SUPERSET_ROOT" ]]; then
        SUPERSET_ROOT="$1"
      else
        echo "ERROR: unexpected argument $1" >&2
        usage
      fi
      shift ;;
  esac
done

if [[ -n "$SUPERSET_ROOT" && ! -d "$SUPERSET_ROOT" ]]; then
  echo "ERROR: Superset root '$SUPERSET_ROOT' does not exist." >&2
  exit 1
fi

if [[ -z "$SUPERSET_ROOT" ]]; then
  if [[ -n "${SUPERSET_HOME:-}" ]]; then
    SUPERSET_ROOT="$SUPERSET_HOME"
  elif [[ -d "../superset" ]]; then
    SUPERSET_ROOT="../superset"
  elif [[ -d "../superset-6.1.0" ]]; then
    SUPERSET_ROOT="../superset-6.1.0"
  elif [[ -d "./superset" ]]; then
    SUPERSET_ROOT="./superset"
  else
    SUPERSET_ROOT="."
  fi
fi

SUPERSET_ROOT_ABS="$(cd "$PLUGIN_ROOT" && cd "$SUPERSET_ROOT" && pwd)"
FE="$SUPERSET_ROOT_ABS/superset-frontend"

if [[ ! -f "$FE/package.json" ]]; then
  echo "ERROR: superset-frontend/package.json not found at '$FE'." >&2
  echo "Run this script from the plugin root, or pass the Superset root as argument." >&2
  echo "Usage: $0 [OPTIONS] [SUPERSET_ROOT]" >&2
  exit 1
fi

echo ">> Plugin root:  $PLUGIN_ROOT"
echo ">> Superset root: $SUPERSET_ROOT_ABS"

# Build plugin if needed
if [[ "$SKIP_BUILD" == false ]]; then
  if [[ ! -d "$PLUGIN_ROOT/lib" ]]; then
    echo ">> Plugin build artifacts missing; building..."
    cd "$PLUGIN_ROOT"
    npm ci
    npm run build
  else
    echo ">> Plugin build artifacts found (lib/); use --skip-build to skip this check."
  fi
else
  echo ">> Build step skipped (--skip-build)."
fi

# Install plugin into Superset frontend
cd "$FE"
if [[ "$USE_LINK" == true ]]; then
  echo ">> Linking plugin via npm link (development mode)..."
  cd "$PLUGIN_ROOT"
  npm link
  cd "$FE"
  npm link "$PLUGIN_NAME"
else
  echo ">> Installing plugin via npm install (file dependency)..."
  npm install --save "$PLUGIN_ROOT"
fi

# Register plugin in MainPreset
PRESET_DIR="$FE/src/visualizations/presets"
MAIN_PRESET=""
for f in "$PRESET_DIR/MainPreset.ts" "$PRESET_DIR/MainPreset.js"; do
  if [[ -f "$f" ]]; then
    MAIN_PRESET="$f"
    break
  fi
done

print_manual_instructions() {
  local target="$1"
  echo ""
  echo ">> Manual registration required."
  echo "   Edit the file below and add the import + plugin entry:"
  echo "   $target"
  echo ""
  echo "   1. Import near the top:"
  echo ""
  echo "      import { SupersetPluginChartCalendarFilter } from '$PLUGIN_NAME';"
  echo ""
  echo "   2. Inside the preset constructor's 'plugins:' array, add:"
  echo ""
  echo "      new SupersetPluginChartCalendarFilter().configure({"
  echo "        key: '$PLUGIN_KEY',"
  echo "      }),"
  echo ""
  echo "   3. Rebuild the frontend and restart the backend."
  echo ""
}

if [[ -z "$MAIN_PRESET" ]]; then
  echo ">> WARNING: MainPreset.ts/js not found in '$PRESET_DIR'." >&2
  print_manual_instructions "$PRESET_DIR/MainPreset.ts"
  exit 0
fi

backup_path="$MAIN_PRESET.bak"
cp "$MAIN_PRESET" "$backup_path"
echo ">> Backed up MainPreset to $backup_path"

if ! node -e "
const fs = require('fs');
const path = '$MAIN_PRESET';
const pluginKey = '$PLUGIN_KEY';
let src = fs.readFileSync(path, 'utf8');

if (src.includes('SupersetPluginChartCalendarFilter') || src.includes(pluginKey)) {
  console.log('   Plugin already registered; nothing to patch.');
  process.exit(0);
}

const importLine = \"import { SupersetPluginChartCalendarFilter } from 'superset-plugin-chart-calendar-filter';\";

const lines = src.split('\n');
let lastImport = -1;
for (let i = 0; i < lines.length; i++) {
  if (/^\\s*import\\s/.test(lines[i])) lastImport = i;
}
if (lastImport >= 0) {
  lines.splice(lastImport + 1, 0, importLine);
} else {
  lines.unshift(importLine);
}
src = lines.join('\n');

const pluginEntry = \"        new SupersetPluginChartCalendarFilter().configure({\\n          key: 'superset-plugin-chart-calendar-filter',\\n        }),\";

let inserted = false;
const calendarRe = /new\\s+CalendarChartPlugin\\(\\)\\.configure\\(\\{\\s*key:\\s*VizType\\.Calendar\\s*\\}\\),?\\n/;
if (calendarRe.test(src)) {
  src = src.replace(calendarRe, m => m + pluginEntry + '\n');
  inserted = true;
} else {
  const firstPluginRe = /new\\s+\\w+Plugin\\(\\)\\.configure\\(\\{/;
  const m = src.match(firstPluginRe);
  if (m) {
    src = src.slice(0, m.index) + pluginEntry + '\n' + src.slice(m.index);
    inserted = true;
  }
}

if (inserted) {
  fs.writeFileSync(path, src);
  console.log('   Patched ' + path);
} else {
  console.log('   Could not auto-locate plugin array.');
  process.exit(1);
}
"; then
  echo ">> Auto-registration failed." >&2
  print_manual_instructions "$MAIN_PRESET"
  exit 0
fi

echo ""
echo ">> DONE."
echo "   The plugin is installed and registered."
echo "   1. Rebuild the frontend:  npm run dev-server   (or npm run build for production)"
echo "   2. Restart the backend (Flask) server."
echo "   3. Open Superset -> + Chart -> 'Calendar Filter' (under 'Other')."
