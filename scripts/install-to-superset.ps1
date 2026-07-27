# install-to-superset.ps1
#
# One-command installer for the Calendar Filter plugin into an existing
# Apache Superset checkout.
#
# Usage:
#   .\install-to-superset.ps1 [-SupersetRoot <path>] [-SkipBuild] [-Link] [-Docker] [-ComposeFile <file>] [-Test] [-Help]
#
#   SupersetRoot defaults to, in order:
#     $SupersetRoot, $env:SUPERSET_HOME, ..\superset, ..\superset-6.1.0, .\superset
#
# Options:
#   -SkipBuild   Skip the plugin build step
#   -Link        Use npm link instead of npm install (development mode)
#   -Docker      Configure Docker Compose override for local development
#   -ComposeFile  Docker Compose file to override (default: docker-compose-non-dev.yml)
#   -Test        Run a frontend build verification after installation
#   -Help        Show this help
#
# Examples:
#   .\install-to-superset.ps1
#   .\install-to-superset.ps1 -SupersetRoot ..\superset-6.1.0
#   .\install-to-superset.ps1 -Link ..\superset
#   .\install-to-superset.ps1 -Docker -Test
#   .\install-to-superset.ps1 -SupersetRoot ..\superset -Docker -ComposeFile docker-compose-non-dev.yml

[CmdletBinding()]
param(
    [string]$SupersetRoot = "",
    [switch]$SkipBuild,
    [switch]$Link,
    [switch]$Docker,
    [string]$ComposeFile = "docker-compose-non-dev.yml",
    [switch]$Test,
    [switch]$Help
)

$ErrorActionPreference = 'Stop'

$PLUGIN_NAME = 'superset-plugin-chart-calendar-filter'
$PLUGIN_KEY = 'superset-plugin-chart-calendar-filter'

if ($Help) {
    Write-Host "Usage: .\install-to-superset.ps1 [-SupersetRoot <path>] [-SkipBuild] [-Link] [-Docker] [-ComposeFile <file>] [-Test]"
    Write-Host ""
    Write-Host "SupersetRoot defaults to, in order: argument, `$env:SUPERSET_HOME, ..\superset, ..\superset-6.1.0, .\superset"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -SkipBuild   Skip the plugin build step"
    Write-Host "  -Link        Use npm link instead of npm install (development mode)"
    Write-Host "  -Docker      Configure Docker Compose override for local development"
    Write-Host "  -ComposeFile Docker Compose file to override (default: docker-compose-non-dev.yml)"
    Write-Host "  -Test        Run a frontend build verification after installation"
    exit 0
}

# Determine plugin root
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$PluginRoot = (Resolve-Path (Join-Path $ScriptDir '..')).Path

# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------

function Test-CommandExists {
    param([string]$Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

function Test-Prerequisites {
    Write-Host ">> Checking prerequisites..."

    if (-not (Test-CommandExists 'node')) {
        Write-Error "Node.js is not installed or not in PATH. Please install Node.js first."
        exit 1
    }
    $nodeVersion = (node --version).Trim()
    Write-Host "   Node.js: $nodeVersion"

    if (-not (Test-CommandExists 'npm')) {
        Write-Error "npm is not installed or not in PATH. Please install npm first."
        exit 1
    }
    $npmVersion = (npm --version).Trim()
    Write-Host "   npm: $npmVersion"

    if ($Docker) {
        if (-not (Test-CommandExists 'docker')) {
            Write-Error "Docker is not installed or not in PATH. Install Docker or omit -Docker."
            exit 1
        }
        $dockerVersion = (docker --version).Trim()
        Write-Host "   Docker: $dockerVersion"

        # Docker Compose may be available as the legacy binary or as the v2 plugin.
        $composeAvailable = (Test-CommandExists 'docker-compose') -or ((docker compose version) -match 'compose')
        if (-not $composeAvailable) {
            Write-Error "Docker Compose is not available. Install docker-compose or the 'docker compose' plugin."
            exit 1
        }
        Write-Host "   Docker Compose: available"
    }
}

function Write-Summary {
    param(
        [string]$SupersetRootAbs,
        [string]$FE,
        [switch]$Docker,
        [string]$ComposeFile = "docker-compose-non-dev.yml",
        [switch]$Test,
        [bool]$TestPassed
    )

    Write-Host ""
    Write-Host "==================================================="
    Write-Host "✅ Calendar Filter plugin installed successfully"
    Write-Host "==================================================="
    Write-Host "Plugin:     $PLUGIN_NAME"
    Write-Host "Installed:  $FE"
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "  Frontend rebuild: cd '$FE' && npm run dev-server"
    if ($Docker) {
        if ($ComposeFile) {
            Write-Host "  Docker:           docker compose -f $ComposeFile up -d"
        } else {
            Write-Host "  Docker:           docker compose up -d"
        }
    } else {
        Write-Host "  Docker:           docker compose up -d"
    }
    Write-Host "  Chart URL:        http://localhost:8088 (after starting)"

    if ($Docker) {
        Write-Host ""
        Write-Host "Docker override configured at:"
        Write-Host "  $(Join-Path $SupersetRootAbs 'docker-compose.override.yml')"
    }

    if ($Test) {
        Write-Host ""
        if ($TestPassed) {
            Write-Host "✅ Frontend build verification passed"
        } else {
            Write-Host "❌ Frontend build verification failed"
        }
    }

    Write-Host ""
    Write-Host "Open Superset -> + Chart -> 'Calendar Filter' (under 'Other')."
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

# ---------------------------------------------------------------------------
# Run prerequisite checks
# ---------------------------------------------------------------------------

Test-Prerequisites

# ---------------------------------------------------------------------------
# Determine Superset root
# ---------------------------------------------------------------------------

try {
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
} catch {
    Write-Error "Failed to resolve Superset root: $_"
    exit 1
}

# ---------------------------------------------------------------------------
# Build plugin if needed
# ---------------------------------------------------------------------------

try {
    if (-not $SkipBuild) {
        if (-not (Test-Path (Join-Path $PluginRoot 'lib'))) {
            Write-Host ">> Plugin build artifacts missing; building..."
            Set-Location $PluginRoot
            npm ci
            if ($LASTEXITCODE -ne 0) { throw "npm ci failed" }
            npm run build
            if ($LASTEXITCODE -ne 0) { throw "npm run build failed" }
        } else {
            Write-Host ">> Plugin build artifacts found (lib/); use -SkipBuild to skip this check."
        }
    } else {
        Write-Host ">> Build step skipped (-SkipBuild)."
    }
} catch {
    Write-Error "Plugin build failed: $_"
    exit 1
}

# ---------------------------------------------------------------------------
# Install plugin into Superset frontend
# ---------------------------------------------------------------------------

try {
    Set-Location $FE
    if ($Link) {
        Write-Host ">> Linking plugin via npm link (development mode)..."
        Set-Location $PluginRoot
        npm link
        if ($LASTEXITCODE -ne 0) { throw "npm link in plugin root failed" }
        Set-Location $FE
        npm link $PLUGIN_NAME --legacy-peer-deps
        if ($LASTEXITCODE -ne 0) { throw "npm link in superset-frontend failed" }
    } else {
        Write-Host ">> Installing plugin via npm install (file dependency)..."
        npm install --legacy-peer-deps --save $PluginRoot
        if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
    }
} catch {
    Write-Error "Plugin installation failed: $_"
    exit 1
}

# ---------------------------------------------------------------------------
# Docker Compose override configuration
# ---------------------------------------------------------------------------

if ($Docker) {
    try {
        # Resolve the chosen compose file path
        $ComposePath = Join-Path $SupersetRootAbs $ComposeFile
        if (-not (Test-Path $ComposePath)) {
            Write-Warning "'$ComposeFile' not found at '$SupersetRootAbs'; falling back to docker-compose.yml"
            $ComposeFile = "docker-compose.yml"
            $ComposePath = Join-Path $SupersetRootAbs $ComposeFile
        }
        if (-not (Test-Path $ComposePath)) {
            Write-Warning "docker-compose.yml not found; attempting auto-detection..."
            $detected = Get-ChildItem -Path $SupersetRootAbs -Filter "docker-compose*.yml" -File | Select-Object -First 1
            if (-not $detected) {
                Write-Warning "No docker-compose*.yml file found at '$SupersetRootAbs'. Skipping Docker override."
                $ComposeFile = ""
            } else {
                $ComposeFile = $detected.Name
                $ComposePath = $detected.FullName
                Write-Host "   Auto-detected compose file: $ComposeFile"
            }
        }

        if ($ComposeFile -and (Test-Path $ComposePath)) {
            $OverrideFile = Join-Path $SupersetRootAbs 'docker-compose.override.yml'
            $PluginRootUnix = $PluginRoot -replace '\\', '/'

            # Query services present in the chosen compose file
            $services = @()
            try {
                $services = (docker compose -f $ComposePath config --services 2>$null) -split "\r?\n" | Where-Object { $_ -match '\S' }
            } catch {
                $services = @()
            }

            if ($services.Count -eq 0) {
                Write-Warning "Could not enumerate services from '$ComposeFile'; using default service list."
                $services = @('superset', 'superset-node', 'superset-worker', 'superset-worker-beat')
            }

            $sb = New-Object System.Text.StringBuilder
            [void]$sb.AppendLine("# ---------------------------------------------------------------------------")
            [void]$sb.AppendLine("# Auto-generated Docker Compose override for the Calendar Filter plugin.")
            [void]$sb.AppendLine("# This file mounts the plugin project into the Superset containers so the")
            [void]$sb.AppendLine("# npm file: dependency resolves correctly.")
            [void]$sb.AppendLine("#")
            [void]$sb.AppendLine("# Generated by: scripts/install-to-superset.ps1 -Docker -ComposeFile $ComposeFile")
            [void]$sb.AppendLine("# ---------------------------------------------------------------------------")
            [void]$sb.AppendLine("services:")

            foreach ($svc in $services) {
                $envKey = if ($svc -like '*node*') { 'NPM_CONFIG_legacy_peer_deps' } else { 'DEV_MODE' }
                $envVal = if ($svc -like '*node*') { '"true"' } else { '"false"' }
                [void]$sb.AppendLine("  $($svc):")
                [void]$sb.AppendLine("    volumes:")
                [void]$sb.AppendLine("      - ${PluginRootUnix}:/Calendar-Filter-Superset:delegated")
                [void]$sb.AppendLine("    environment:")
                [void]$sb.AppendLine("      ${envKey}: $envVal")
            }

            Set-Content -Path $OverrideFile -Value $sb.ToString() -Encoding utf8 -Force
            Write-Host ">> Docker Compose override created: $OverrideFile"
            Write-Host "   Start with: docker compose -f $ComposeFile up -d"
        }
    } catch {
        Write-Error "Docker override configuration failed: $_"
        exit 1
    }
}

# ---------------------------------------------------------------------------
# Register plugin in MainPreset
# ---------------------------------------------------------------------------

try {
    $PresetDir = Join-Path $FE 'src\visualizations\presets'
    $MainPreset = $null
    foreach ($ext in @('ts','js')) {
        $candidate = Join-Path $PresetDir "MainPreset.$ext"
        if (Test-Path $candidate) {
            $MainPreset = $candidate
            break
        }
    }

    if (-not $MainPreset) {
        Write-Warning "MainPreset.ts/js not found in '$PresetDir'."
        Print-ManualInstructions "$PresetDir\MainPreset.ts"
        Write-Summary -SupersetRootAbs $SupersetRootAbs -FE $FE -Docker:$Docker -ComposeFile $ComposeFile -Test:$Test -TestPassed $false
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
} catch {
    Write-Error "Plugin registration failed: $_"
    exit 1
}

# ---------------------------------------------------------------------------
# Test mode: verify frontend build
# ---------------------------------------------------------------------------

$TestPassed = $false
if ($Test) {
    try {
        Write-Host ""
        Write-Host ">> Running frontend build verification (timeout: 10 min)..."
        Set-Location $FE

        # Run npm run build with a 10-minute timeout.
        $proc = Start-Process -FilePath 'npm' -ArgumentList 'run','build' -WorkingDirectory $FE -PassThru -NoNewWindow
        $exited = $proc.WaitForExit(600000)

        if (-not $exited) {
            $proc.Kill()
            throw "Frontend build timed out after 10 minutes."
        }

        if ($proc.ExitCode -eq 0) {
            $TestPassed = $true
            Write-Host "   Frontend build succeeded."
        } else {
            throw "Frontend build failed with exit code $($proc.ExitCode)."
        }
    } catch {
        Write-Warning "Frontend build verification failed: $_"
    }
}

# ---------------------------------------------------------------------------
# Post-install summary
# ---------------------------------------------------------------------------

Write-Summary -SupersetRootAbs $SupersetRootAbs -FE $FE -Docker:$Docker -ComposeFile $ComposeFile -Test:$Test -TestPassed $TestPassed

if ($Test -and -not $TestPassed) {
    exit 1
}
