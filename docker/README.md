# 📂 Docker Architecture (`/docker`)

> **Containerized Deployment & Local Stack orchestration**

This directory encapsulates the Docker Compose configuration and custom Dockerfiles required to spin up an ephemeral or permanent Apache Superset instance pre-loaded with the `superset-plugin-chart-calendar-filter`.

## Infrastructure Files
- **`Dockerfile`**: Defines the custom image, overlaying the plugin onto the base Superset image.
- **`docker-compose.yml`**: Orchestrates the multi-container stack (`superset`, `superset-worker`, `redis`, `postgres`) mapping the plugin via volume mounts or baked-in npm links.
