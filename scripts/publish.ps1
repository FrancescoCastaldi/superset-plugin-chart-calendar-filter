# publish.ps1 - Build, version-bump and publish the calendar-filter plugin to npm.
#
# Usage (PowerShell):
#   .\scripts\publish.ps1                 # publish as-is
#   .\scripts\publish.ps1 -Bump patch     # 0.1.0 -> 0.1.1
#   .\scripts\publish.ps1 -Bump minor     # 0.1.0 -> 0.2.0
#   .\scripts\publish.ps1 -Bump major     # 0.1.0 -> 1.0.0
#   .\scripts\publish.ps1 -DryRun         # build + pack, but do NOT publish
#
# Prerequisites:
#   - You are logged in to the target npm registry (npm whoami)
#   - Working tree is clean (script aborts otherwise)

[CmdletBinding()]
param(
    [ValidateSet('', 'patch', 'minor', 'major')]
    [string]$Bump = '',
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$ROOT = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $ROOT

# 1. Ensure clean working tree
$status = git status --porcelain
if ($status) {
    Write-Error "Working tree is not clean. Commit or stash your changes first."
    exit 1
}

# 2. Optional version bump
if ($Bump) {
    Write-Host ">> Bumping version ($Bump)"
    npm version $Bump -m "chore(release): v%s"
}

# 3. Install + build (+ postbuild test)
Write-Host ">> Installing dependencies"
npm install
Write-Host ">> Building (CJS + ESM + types)"
npm run build

# 4. Pack to inspect tarball
Write-Host ">> Packing tarball"
$tarball = (npm pack).Trim() | Select-Object -Last 1
Write-Host ">> Created $tarball"
Write-Host ">> Tarball contents:"
tar -tzf $tarball

# 5. Publish or stop
if ($DryRun) {
    Write-Host ">> DryRun - skipping publish. Tarball left at $tarball"
    exit 0
}

Write-Host ">> Publishing to npm"
npm publish --access public
Write-Host ">> Done. Remember to push the git tag: git push --follow-tags"