# Docker (docker/)

Containerized deployment and local stack orchestration for running the Calendar Filter plugin with Apache Superset.

## Contents

- **Dockerfile** -- Multi-stage build image. Uses `node:20-bookworm-slim` to build the plugin and produce a `.tgz` tarball in `/dist`. Copies the tarball into the Superset image and installs it.
- **docker-compose.yml** -- Development overlay that mounts the plugin source directory into Superset containers and sets `DEV_MODE=false`. Orchestrates the full stack: `superset`, `superset-worker`, `redis`, and `postgres`.

## Usage

Start the full stack:

```
docker compose -f docker/docker-compose.yml up -d
```

The plugin is automatically linked and available in the Superset chart picker under "Filters and controls" as `Calendar Filter`.
