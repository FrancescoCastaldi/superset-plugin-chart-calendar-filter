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
#   --docker       Configure Docker Compose override for local development
#   --compose-file <file>  Docker Compose file to override (default: docker-compose-non-dev.yml)
#   --test         Run a frontend build verification after installation
#   -h, --help     Show this help
#
# Examples:
#   ./install-to-superset.sh
#   ./install-to-superset.sh ../superset-6.1.0
#   ./install-to-superset.sh --link ../superset
#   ./install-to-superset.sh --docker --test
#   ./install-to-superset.sh --docker --compose-file docker-compose-non-dev.yml ../superset
#   curl -fsSL https://raw.githubusercontent.com/FrancescoCastaldi/superset-plugin-chart-calendar-filter/master/scripts/install-to-superset.sh | bash -s -- ../superset-6.1.0

set -euo pipefail

PLUGIN_NAME="superset-plugin-chart-calendar-filter"
PLUGIN_KEY="superset-plugin-chart-calendar-filter"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------

usage() {
  sed -n '/^# Usage:/,/^# Examples:/p' "$0" | sed 's/^# //; s/^#$//'
  exit 1
}

error_exit() {
  echo "ERROR: $1" >&2
  exit 1
}

trap 'error_exit "Installation failed at line $LINENO. See output above."' ERR

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

print_summary() {
  local superset_root_abs="$1"
  local fe="$2"
  local docker_mode="$3"
  local test_mode="$4"
  local test_passed="$5"

  echo ""
  echo "==================================================="
  echo "✅ Calendar Filter plugin installed successfully"
  echo "==================================================="
  echo "Plugin:     $PLUGIN_NAME"
  echo "Installed:  $fe"
  echo ""
  echo "Next steps:"
  echo "  Frontend rebuild: cd '$fe' && npm run dev-server"
  echo "  Docker:           docker compose up -d"
  echo "  Chart URL:        http://localhost:8088 (after starting)"

  if [[ "$docker_mode" == true ]]; then
    echo ""
    echo "Docker override configured at:"
    echo "  $superset_root_abs/docker-compose.override.yml"
  fi

  if [[ "$test_mode" == true ]]; then
    echo ""
    if [[ "$test_passed" == true ]]; then
      echo "✅ Frontend build verification passed"
    else
      echo "❌ Frontend build verification failed"
    fi
  fi

  echo ""
  echo "Open Superset -> + Chart -> 'Calendar Filter' (under 'Other')."
}

# ---------------------------------------------------------------------------
# Argument parsing
# ---------------------------------------------------------------------------

SKIP_BUILD=false
USE_LINK=false
USE_DOCKER=false
RUN_TEST=false
SUPERSET_ROOT=""
COMPOSE_FILE="docker-compose-non-dev.yml"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-build) SKIP_BUILD=true; shift ;;
    --link)       USE_LINK=true; shift ;;
    --docker)     USE_DOCKER=true; shift ;;
    --compose-file)
      if [[ -n "${2:-}" && "$2" != --* ]]; then
        COMPOSE_FILE="$2"
        shift 2
      else
        error_exit "--compose-file requires a value"
      fi
      ;;
    --test)       RUN_TEST=true; shift ;;
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

# ---------------------------------------------------------------------------
# Prerequisite checks
# ---------------------------------------------------------------------------

echo ">> Checking prerequisites..."

command -v node >/dev/null 2>&1 || error_exit "Node.js is not installed or not in PATH. Please install Node.js first."
echo "   Node.js: $(node --version)"

command -v npm >/dev/null 2>&1 || error_exit "npm is not installed or not in PATH. Please install npm first."
echo "   npm: $(npm --version)"

if [[ "$USE_DOCKER" == true ]]; then
  command -v docker >/dev/null 2>&1 || error_exit "Docker is not installed or not in PATH. Install Docker or omit --docker."
  echo "   Docker: $(docker --version)"

  # Docker Compose may be the legacy binary or the v2 plugin.
  if command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE_BIN="docker-compose"
    echo "   Docker Compose: $(docker-compose --version)"
  elif docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE_BIN="docker compose"
    echo "   Docker Compose: $(docker compose version)"
  else
    error_exit "Docker Compose is not available. Install docker-compose or the 'docker compose' plugin."
  fi
fi

# ---------------------------------------------------------------------------
# Determine Superset root
# ---------------------------------------------------------------------------

if [[ -n "$SUPERSET_ROOT" && ! -d "$SUPERSET_ROOT" ]]; then
  error_exit "Superset root '$SUPERSET_ROOT' does not exist."
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

# ---------------------------------------------------------------------------
# Build plugin if needed
# ---------------------------------------------------------------------------

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

# ---------------------------------------------------------------------------
# Install plugin into Superset frontend
# ---------------------------------------------------------------------------

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

# ---------------------------------------------------------------------------
# Docker Compose override configuration
# ---------------------------------------------------------------------------

if [[ "$USE_DOCKER" == true ]]; then
  COMPOSE_PATH="$SUPERSET_ROOT_ABS/$COMPOSE_FILE"
  if [[ ! -f "$COMPOSE_PATH" ]]; then
    echo ">> WARNING: '$COMPOSE_FILE' not found at '$SUPERSET_ROOT_ABS'; falling back to docker-compose.yml" >&2
    COMPOSE_FILE="docker-compose.yml"
    COMPOSE_PATH="$SUPERSET_ROOT_ABS/$COMPOSE_FILE"
  fi
  if [[ ! -f "$COMPOSE_PATH" ]]; then
    echo ">> WARNING: docker-compose.yml not found; attempting auto-detection..." >&2
    detected="$(find "$SUPERSET_ROOT_ABS" -maxdepth 1 -name 'docker-compose*.yml' -type f | head -n 1 || true)"
    if [[ -z "$detected" ]]; then
      echo ">> WARNING: No docker-compose*.yml file found at '$SUPERSET_ROOT_ABS'. Skipping Docker override." >&2
      COMPOSE_FILE=""
    else
      COMPOSE_PATH="$detected"
      COMPOSE_FILE="$(basename "$detected")"
      echo "   Auto-detected compose file: $COMPOSE_FILE"
    fi
  fi

  if [[ -n "$COMPOSE_FILE" && -f "$COMPOSE_PATH" ]]; then
    OVERRIDE_FILE="$SUPERSET_ROOT_ABS/docker-compose.override.yml"

    services="$($DOCKER_COMPOSE_BIN -f "$COMPOSE_PATH" config --services 2>/dev/null || true)"
    if [[ -z "$services" ]]; then
      echo ">> WARNING: Could not enumerate services from '$COMPOSE_FILE'; using default service list." >&2
      services="superset
superset-node
superset-worker
superset-worker-beat"
    fi

    {
      echo "# ---------------------------------------------------------------------------"
      echo "# Auto-generated Docker Compose override for the Calendar Filter plugin."
      echo "# This file mounts the plugin project into the Superset containers so the"
      echo "# npm file: dependency resolves correctly."
      echo "#"
      echo "# Generated by: scripts/install-to-superset.sh --docker --compose-file $COMPOSE_FILE"
      echo "# ---------------------------------------------------------------------------"
      echo "services:"
      while IFS= read -r svc; do
        [[ -z "$svc" ]] && continue
        if [[ "$svc" == *"node"* ]]; then
          env_key="NPM_CONFIG_legacy_peer_deps"
          env_val=""true""
        else
          env_key="DEV_MODE"
          env_val=""false""
        fi
        echo "  $svc:"
        echo "    volumes:"
        echo "      - $PLUGIN_ROOT:/Calendar-Filter-Superset:delegated"
        echo "    environment:"
        echo "      $env_key: $env_val"
      done <<< "$services"
    } > "$OVERRIDE_FILE"
    echo ">> Docker Compose override created: $OVERRIDE_FILE"
    echo "   Start with: docker compose -f $COMPOSE_FILE up -d"
  fi
fi

# ---------------------------------------------------------------------------
# Register plugin in MainPreset
# ---------------------------------------------------------------------------

PRESET_DIR="$FE/src/visualizations/presets"
MAIN_PRESET=""
for f in "$PRESET_DIR/MainPreset.ts" "$PRESET_DIR/MainPreset.js"; do
  if [[ -f "$f" ]]; then
    MAIN_PRESET="$f"
    break
  fi
done

if [[ -z "$MAIN_PRESET" ]]; then
  echo ">> WARNING: MainPreset.ts/js not found in '$PRESET_DIR'." >&2
  print_manual_instructions "$PRESET_DIR/MainPreset.ts"
  print_summary "$SUPERSET_ROOT_ABS" "$FE" "$USE_DOCKER" "$COMPOSE_FILE" "$RUN_TEST" false
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
  print_summary "$SUPERSET_ROOT_ABS" "$FE" "$USE_DOCKER" "$COMPOSE_FILE" "$RUN_TEST" false
  exit 0
fi

# ---------------------------------------------------------------------------
# Test mode: verify frontend build
# ---------------------------------------------------------------------------

TEST_PASSED=false
if [[ "$RUN_TEST" == true ]]; then
  echo ""
  echo ">> Running frontend build verification (timeout: 10 min)..."
  cd "$FE"

  # Prefer 'timeout' (Linux/coreutils); fall back to direct execution if unavailable.
  if command -v timeout >/dev/null 2>&1; then
    if timeout 600 npm run build; then
      TEST_PASSED=true
      echo "   Frontend build succeeded."
    else
      echo ">> WARNING: Frontend build failed or timed out." >&2
    fi
  else
    echo "   (timeout command not found; running build without timeout)"
    if npm run build; then
      TEST_PASSED=true
      echo "   Frontend build succeeded."
    else
      echo ">> WARNING: Frontend build failed." >&2
    fi
  fi
fi

# ---------------------------------------------------------------------------
# Post-install summary
# ---------------------------------------------------------------------------

print_summary "$SUPERSET_ROOT_ABS" "$FE" "$USE_DOCKER" "$COMPOSE_FILE" "$RUN_TEST" "$TEST_PASSED"

if [[ "$RUN_TEST" == true && "$TEST_PASSED" == false ]]; then
  exit 1
fi
