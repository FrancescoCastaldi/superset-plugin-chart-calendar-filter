#!/usr/bin/env bash
#
# publish.sh — Build, version-bump and publish the calendar-filter plugin to npm.
#
# Usage:
#   ./scripts/publish.sh            # publish as-is (expects version already bumped)
#   ./scripts/publish.sh patch      # npm version patch  -> 0.1.1
#   ./scripts/publish.sh minor      # npm version minor  -> 0.2.0
#   ./scripts/publish.sh major      # npm version major  -> 1.0.0
#   DRY_RUN=1 ./scripts/publish.sh  # build + pack, but do NOT publish
#
# Prerequisites:
#   - You are logged in to the target npm registry (npm whoami)
#   - Working tree is clean (script aborts otherwise)

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

BUMP="${1:-}"
DRY_RUN="${DRY_RUN:-0}"

# 1. Ensure clean working tree
if [ -n "$(git status --porcelain)" ]; then
  echo "ERROR: working tree is not clean. Commit or stash your changes first." >&2
  exit 1
fi

# 2. Optional version bump
if [ -n "$BUMP" ]; then
  echo ">> Bumping version ($BUMP)"
  npm version "$BUMP" -m "chore(release): v%s"
fi

# 3. Install deps + build + test (postbuild runs jest)
echo ">> Installing dependencies"
npm install
echo ">> Building (CJS + ESM + types)"
npm run build

# 4. Pack to inspect the tarball contents
echo ">> Packing tarball"
TARBALL="$(npm pack | tail -n1)"
echo ">> Created $TARBALL"
echo ">> Tarball contents:"
tar -tzf "$TARBALL"

# 5. Publish (or stop if DRY_RUN)
if [ "$DRY_RUN" = "1" ]; then
  echo ">> DRY_RUN=1 — skipping publish. Tarball left at $TARBALL"
  exit 0
fi

echo ">> Publishing to npm"
npm publish --access public
echo ">> Done. Remember to push the git tag: git push --follow-tags"