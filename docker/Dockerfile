# syntax=docker/dockerfile:1
#
# Dockerfile for building the superset-plugin-chart-calendar-filter npm package.
#
# This image is NOT meant to run Superset. It compiles the plugin (CJS in lib/,
# ESM in esm/, plus TypeScript declarations) and exposes the publishable tarball
# via a mounted volume, so it can be consumed by CI/CD or shipped to an internal
# npm registry.
#
# Usage:
#   docker build -t calendar-filter-plugin-builder -f Dockerfile .
#   docker run --rm -v ${PWD}/dist:/dist calendar-filter-plugin-builder
#   # -> /dist/superset-plugin-chart-calendar-filter-0.1.0.tgz

FROM node:20-bookworm-slim AS builder

WORKDIR /app/plugin

# Install dependencies (cached layer)
COPY package.json ./
COPY package-lock.json* ./
RUN npm install

# Copy sources and build (lib/ + esm/ + .d.ts)
COPY . .
RUN npm run build

# Produce the npm tarball
RUN npm pack --pack-destination=/dist

# Final stage: just carry the tarball
FROM scratch AS artifact
COPY --from=builder /dist /dist