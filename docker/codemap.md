# docker/

## Responsibility

Containerized development and deployment configurations (`Dockerfile`, `docker-compose.yml`) for running Apache Superset with the calendar filter plugin attached.

## Design

- **`Dockerfile`**: Multi-stage docker build process.
  - Stage 1 (`builder`): Uses `node:20-bookworm-slim`, installs dependencies, runs `npm run build`, and creates an npm package tarball (`npm pack`).
  - Stage 2 (`artifact`): `FROM scratch`, extracts the built `.tgz` tarball artifact.
- **`docker-compose.yml`**: Local development stack overlay that mounts plugin source code into Apache Superset container, sets legacy peer dependency options, and mounts environment overrides.

## Flow

`docker-compose up` -> builds plugin tarball -> mounts into Superset container -> attaches plugin to Superset dev server.

## Integration

Used for testing plugin execution within containerized Apache Superset 6.1.0 instances.
