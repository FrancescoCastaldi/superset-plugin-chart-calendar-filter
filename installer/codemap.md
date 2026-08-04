# installer/

## Responsibility

Contains the streamlined, interactive, cross-platform installation utility scripts (`install.js`, `install.bat`) and the installer technical guide (`INSTALLER.md`) to integrate the plugin into Apache Superset.

## Design

- **`install.js`**: Replaces legacy shell scripts with a zero-dependency, cross-platform Node.js installation pipeline. Performs auto-discovery of Superset, builds missing plugin artifacts, auto-embeds plugin sources into `superset-frontend/plugins/`, updates `package.json`, patches `MainPreset`, configures `superset-frontend/.npmrc` (`legacy-peer-deps=true`), performs cross-platform safety cleanup, updates `package-lock.json`, and overwrites `docker-compose.override.yml` with Docker build args (`DEV_MODE: 'true'`, `NPM_CONFIG_LEGACY_PEER_DEPS: 'true'`).
- **`install.bat`**: Double-clickable wrapper on Windows that delegates execution directly to `install.js`.
- **`INSTALLER.md`**: Technical documentation describing the installation workflow, prerequisites, and automated safety steps.

## Flow

1. User executes `install.bat` (double-click) or `node install.js` -> script discovers Superset folder path.
2. Checks/performs plugin build (`lib/`) using native Node.js commands.
3. Copies plugin into `superset-frontend/plugins/superset-plugin-chart-calendar-filter` & registers dependency `"file:./plugins/superset-plugin-chart-calendar-filter"`.
4. Patches `MainPreset` for chart registration and optionally applies AceEditor fix and native filter whitelist.
5. Performs cross-platform safety cleanup (`.cache`, `.temp_cache`, `dist/`), configures `.npmrc` (`legacy-peer-deps=true`), updates `package-lock.json`, and overwrites `docker-compose.override.yml`.

## Integration

Used by developers and DevOps engineers to seamlessly embed this repository into Apache Superset standalone and Docker deployments.
