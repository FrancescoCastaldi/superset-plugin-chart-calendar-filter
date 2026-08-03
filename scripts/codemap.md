# scripts/

## Responsibility

Houses automation, dashboard attachment, REST API integration, and publication scripts for the plugin (`attach_to_dashboard_8.py`, `inject_native_filter.py`, `publish.ps1`, etc.).

## Design

- **`attach_to_dashboard_8.py`**: Interacts with Superset REST API to create/attach chart Slice #105 to Dashboard ID 8.
- **`inject_native_filter.py`**: Injects `superset-plugin-chart-calendar-filter` into Superset Native Filter Bar sidebar state via REST API.
- **`publish.ps1` / `publish.sh`**: Automates version bumping, building, and npm registry publishing.

## Flow

1. Developer runs installer/script -> script authenticates against Superset REST API (`/api/v1/security/login`).
2. Script modifies Superset dashboard metadata, attaches chart slice, or updates native filter bar configuration.

## Integration

Used by developers and automated CI/CD workflows for plugin installation, dashboard attachment, and release management.
