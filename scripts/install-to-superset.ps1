# install-to-superset.ps1
#
# One-command installer for the Calendar Filter plugin into an existing
# Apache Superset checkout.
#
# Usage:
#   .\install-to-superset.ps1 [-SupersetRoot <path>] [-SkipBuild] [-Link]
#
#   SupersetRoot defaults to, in order:
#     $SupersetRoot, $env:SUPERSET_HOME, ..\superset, ..\superset-6.1.0, .\superset
#
# Options:
#   -SkipBuild   Skip the plugin build step
#   -Link        Use npm link instead of npm install (development mode)
#   -Help        Show this help
#
# Examples:
#   .\install-to-superset.ps1
#   .\install-to-superset.ps1 -SupersetRoot ..\superset-6.1.0
#   .\install-to-superset.ps1 -Link ..\superset

[CmdletBinding()]
param(
    [string]$SupersetRoot = "",
    [switch]$SkipBuild,
    [switch]$Link,
    [switch]$Help
)

$ErrorActionPreference = 'Stop'

$PLUGIN_NAME = 'superset-plugin-chart-calendar-filter'
$PLUGIN_KEY = 'superset-plugin-chart-calendar-filter'

if ($Help) {
    Write-Host "Usage: .\install-to-superset.ps1 [-SupersetRoot <path>] [-SkipBuild] [-Link]"
    Write-Host ""
    Write-Host "SupersetRoot defaults to, in order: argument, `$env:SUPERSET_HOME, ..\superset, ..\superset-6.1.0, .\superset"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -SkipBuild   Skip the plugin build step"
    Write-Host "  -Link        Use npm link instead of npm install (development mode)"
    exit 0
}

# Determine plugin root
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$PluginRoot = (Resolve-Path (Join-Path $ScriptDir '..')).Path

# Determine Superset root
if ($SupersetRoot -and -not (Test-Path $SupersetRoot)) {
    Write-Error "Superset root '$SupersetRoot' does not exist."
    exit 1
}

if (-not $SupersetRoot) {
    if ($env:SUPERSET_HOME) {
        $SupersetRoot = $env:SUPERSET_HOME
    } elseif (Test-Path (Join-Path $PluginRoot '..\superset')) {
        $SupersetRoot = Join-Path $PluginRoot '..\superset'
    } elseif (Test-Path (Join-Path $PluginRoot '..\superset-6.1.0')) {
        $SupersetRoot = Join-Path $PluginRoot '..\superset-6.1.0'
    } elseif (Test-Path (Join-Path $PluginRoot '.\superset')) {
        $SupersetRoot = Join-Path $PluginRoot '.\superset'
    } else {
        $SupersetRoot = $PluginRoot
    }
}

$SupersetRootAbs = (Resolve-Path $SupersetRoot).Path
$FE = Join-Path $SupersetRootAbs 'superset-frontend'

if (-not (Test-Path (Join-Path $FE 'package.json'))) {
    Write-Error "superset-frontend/package.json not found at '$FE'. Run this script from the plugin root, or pass -SupersetRoot."
    exit 1
}

Write-Host ">> Plugin root:  $PluginRoot"
Write-Host ">> Superset root: $SupersetRootAbs"

# Build plugin if needed
if (-not $SkipBuild) {
    if (-not (Test-Path (Join-Path $PluginRoot 'lib'))) {
        Write-Host ">> Plugin build artifacts missing; building..."
        Set-Location $PluginRoot
        npm ci
        npm run build
    } else {
        Write-Host ">> Plugin build artifacts found (lib/); use -SkipBuild to skip this check."
    }
} else {
    Write-Host ">> Build step skipped (-SkipBuild)."
}

# Install plugin into Superset frontend
Set-Location $FE
if ($Link) {
    Write-Host ">> Linking plugin via npm link (development mode)..."
    Set-Location $PluginRoot
    npm link
    Set-Location $FE
    npm link $PLUGIN_NAME
} else {
    Write-Host ">> Installing plugin via npm install (file dependency)..."
    npm install --save $PluginRoot
}

# Register plugin in MainPreset
$PresetDir = Join-Path $FE 'src\visualizations\presets'
$MainPreset = $null
foreach ($ext in @('ts','js')) {
    $candidate = Join-Path $PresetDir "MainPreset.$ext"
    if (Test-Path $candidate) {
        $MainPreset = $candidate
        break
    }
}

function Print-ManualInstructions {
    param([string]$Target)
    Write-Host ""
    Write-Host ">> Manual registration required."
    Write-Host "   Edit the file below and add the import + plugin entry:"
    Write-Host "   $Target"
    Write-Host ""
    Write-Host "   1. Import near the top:"
    Write-Host ""
    Write-Host "      import { SupersetPluginChartCalendarFilter } from '$PLUGIN_NAME';"
    Write-Host ""
    Write-Host "   2. Inside the preset constructor's 'plugins:' array, add:"
    Write-Host ""
    Write-Host "      new SupersetPluginChartCalendarFilter().configure({"
    Write-Host "        key: '$PLUGIN_KEY',"
    Write-Host "      }),"
    Write-Host ""
    Write-Host "   3. Rebuild the frontend and restart the backend."
    Write-Host ""
}

if (-not $MainPreset) {
    Write-Warning "MainPreset.ts/js not found in '$PresetDir'."
    Print-ManualInstructions "$PresetDir\MainPreset.ts"
    exit 0
}

Copy-Item $MainPreset "$MainPreset.bak" -Force
Write-Host ">> Backed up MainPreset to $MainPreset.bak"

$src = Get-Content $MainPreset -Raw

if ($src.Contains('SupersetPluginChartCalendarFilter') -or $src.Contains($PLUGIN_KEY)) {
    Write-Host "   Plugin already registered; nothing to patch."
} else {
    $importLine = "import { SupersetPluginChartCalendarFilter } from 'superset-plugin-chart-calendar-filter';"

    $lines = $src -split "`n"
    $lastImport = -1
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '^\s*import\s') { $lastImport = $i }
    }
    if ($lastImport -ge 0) {
        $lines = $lines[0..$lastImport] + $importLine + $lines[($lastImport + 1)..($lines.Count - 1)]
    } else {
        $lines = @($importLine) + $lines
    }
    $src = $lines -join "`n"

    $pluginEntry = "        new SupersetPluginChartCalendarFilter().configure({`n          key: 'superset-plugin-chart-calendar-filter',`n        }),"

    $inserted = $false
    $calendarRe = [regex]'new\s+CalendarChartPlugin\(\)\.configure\(\{\s*key:\s*VizType\.Calendar\s*\}\),?\n?'
    if ($src -match $calendarRe) {
        $evaluator = { $args[0].Value + $pluginEntry + "`n" }
        $src = $calendarRe.Replace($src, $evaluator, 1)
        $inserted = $true
    } else {
        $firstPluginRe = [regex]'new\s+\w+Plugin\(\)\.configure\(\{'
        $m = $firstPluginRe.Match($src)
        if ($m.Success) {
            $src = $src.Substring(0, $m.Index) + $pluginEntry + "`n" + $src.Substring($m.Index)
            $inserted = $true
        }
    }

    if ($inserted) {
        Set-Content $MainPreset $src -Encoding utf8
        Write-Host "   Patched $MainPreset"
    } else {
        Write-Warning "Could not auto-locate plugin array."
        Print-ManualInstructions $MainPreset
    }
}

Write-Host ""
Write-Host ">> DONE."
Write-Host "   The plugin is installed and registered."
Write-Host "   1. Rebuild the frontend:  npm run dev-server   (or npm run build for production)"
Write-Host "   2. Restart the backend (Flask) server."
Write-Host "   3. Open Superset -> + Chart -> 'Calendar Filter' (under 'Other')."
