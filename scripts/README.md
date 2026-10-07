# Automation Scripts (scripts/)

Utility scripts for plugin lifecycle automation, including local installation, publishing, and dashboard integration.

## Contents

### Build

- **build.js** -- Single source of truth for the esbuild entry points of the plugin. The `build-cjs`, `build-esm` and `dev` npm scripts delegate to it (`--format=cjs|esm --outdir=<dir> [--watch]`), replacing the previously duplicated hardcoded file lists.

### Installation

- **install.py** -- Zero-touch cross-platform installer (Python). Detects the OS, finds the local Superset checkout, symlinks the plugin, rebuilds the frontend, and registers the chart.
- **install-to-superset.ps1** -- PowerShell installer for Windows environments.
- **install-to-superset.sh** -- Bash installer for Linux and macOS environments.

### Publishing

- **publish.ps1** -- PowerShell script to build, version, and publish the plugin to the npm registry.
- **publish.sh** -- Bash equivalent for POSIX environments.

### Dashboard Integration

- **attach_to_dashboard_8.py** -- Python script that attaches the plugin chart slice to Dashboard ID 8 via the Superset REST API.
- **inject_native_filter.py** -- Python script that registers the plugin as a dashboard native filter on Dashboard ID 8.

## Usage

```
python scripts/install.py
```

Run any script from the repository root. Each script includes inline documentation and error handling for common failure modes (missing dependencies, network issues, permissions).
