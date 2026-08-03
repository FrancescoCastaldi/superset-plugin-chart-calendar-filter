# installer/

## Responsibility

Contains the streamlined, interactive, cross-platform installation utility scripts (`install.js`, `install.bat`) and the installer technical guide (`INSTALLER.md`) to integrate the plugin into Apache Superset.

## Design

- **`install.js`**: Replaces all legacy scripts with a safe, interactive Node.js flow. Employs regex-based parsing to register the plugin and apply optional workarounds dynamically.
- **`install.bat`**: Double-clickable wrapper on Windows that delegates execution directly to `install.js`.
- **`INSTALLER.md`**: Guide describing the installation workflow.

## Flow

1. User executes `install.bat` (double-click) or `node install.js` -> script discovers Superset folder path.
2. Checks/performs plugin build -> updates target `package.json` -> patches `MainPreset` -> prompts for optional advanced configurations.

## Integration

Used by developers to link this repository as a dependency into their Apache Superset checkouts.
