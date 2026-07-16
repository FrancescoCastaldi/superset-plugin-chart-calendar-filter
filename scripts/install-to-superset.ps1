# install-to-superset.ps1
#
# One-command installer for the Calendar Filter plugin (Option A / npm).
# Run it from the ROOT of a cloned Superset project (the folder that contains
# both `superset/` and `superset-frontend/`).
#
# Usage (PowerShell, from the Superset root):
#   .\install-to-superset.ps1
#   .\install-to-superset.ps1 -SupersetRoot C:\path\to\superset
# Or straight from GitHub (from the Superset root):
#   irm https://raw.githubusercontent.com/FrancescoCastaldi/superset-plugin-chart-calendar-filter/master/scripts/install-to-superset.ps1 | iex

[CmdletBinding()]
param(
    [string]$SupersetRoot = "."
)

$ErrorActionPreference = 'Stop'
$FE = Join-Path $SupersetRoot 'superset-frontend'

if (-not (Test-Path $FE)) {
    Write-Error "superset-frontend/ not found at '$FE'. Run this script from the Superset project root (or pass -SupersetRoot)."
    exit 1
}

Set-Location $FE
Write-Host ">> Superset frontend: $FE"

Write-Host ">> Installing plugin from npm..."
npm install --save superset-plugin-chart-calendar-filter

Write-Host ">> Registering plugin in MainPreset..."
$mainPreset = Join-Path $FE 'src/visualizations/presets/MainPreset.ts'
if (-not (Test-Path $mainPreset)) {
    Write-Host "   MainPreset.ts not found at $mainPreset -- add the registration manually (see README)."
    exit 0
}

$src = Get-Content $mainPreset -Raw
$KEY = 'superset-plugin-chart-calendar-filter'
if ($src.Contains($KEY)) {
    Write-Host "   Already registered, skipping."
    exit 0
}

$imp = "import { SupersetPluginChartCalendarFilter } from 'superset-plugin-chart-calendar-filter';"
$plug = "      new SupersetPluginChartCalendarFilter().configure({`n        key: 'superset-plugin-chart-calendar-filter',`n      }),"

$lines = $src -split "`n"
$lastImport = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i].Trim().StartsWith('import ')) { $lastImport = $i }
}
if ($lastImport -ge 0) {
    $lines = $lines[0..$lastImport] + $imp + $lines[($lastImport + 1)..($lines.Count - 1)]
} else {
    $lines = @($imp) + $lines
}
$src = $lines -join "`n"

$m = [regex]::Match($src, 'new\s+\w+Plugin\(\)')
if ($m.Success) {
    $idx = $m.Index
    $src = $src.Substring(0, $idx) + $plug + "`n" + $src.Substring($idx)
    Set-Content $mainPreset $src -Encoding utf8
    Write-Host "   Patched $mainPreset"
} else {
    Write-Host "   Could not auto-locate the plugin array; add the registration manually (see README)."
}

Write-Host ""
Write-Host ">> DONE. Next steps:"
Write-Host "   1. Rebuild the frontend:  npm run dev   (or: npm run build for production)"
Write-Host "   2. Restart the Superset backend."
Write-Host "   3. Open Superset -> + Chart -> 'Calendar Filter' (under 'Other')."