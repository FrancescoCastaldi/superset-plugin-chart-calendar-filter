<#
.SYNOPSIS
    Automated installer script for Calendar Filter Chart Plugin in Apache Superset.
#>

[CmdletBinding()]
param (
    [Parameter(Position = 0)]
    [string]$SupersetPath,

    [Parameter(Position = 1)]
    [string]$PluginPath,

    [switch]$CleanReinstall,
    [switch]$RebuildFrontend,
    [switch]$SkipBuild,
    [switch]$SkipCleanCache,
    [switch]$Force
)

$ErrorActionPreference = "Stop"

function Write-Color([string]$text, [string]$color = "White") {
    Write-Host $text -ForegroundColor $color
}

Write-Color "================================================================" "Cyan"
Write-Color "   Calendar Filter - Apache Superset Chart Plugin Installer     " "Cyan"
Write-Color "   Interactive Calendar Heatmap & Dashboard Cross-Filtering     " "Cyan"
Write-Color "================================================================" "Cyan"
Write-Color ""

if (-not $PluginPath) {
    if (Test-Path (Join-Path $PSScriptRoot "src\index.ts")) {
        $PluginPath = $PSScriptRoot
    } elseif (Test-Path (Join-Path (Split-Path -Parent $PSScriptRoot) "src\index.ts")) {
        $PluginPath = Split-Path -Parent $PSScriptRoot
    } else {
        $PluginPath = $PSScriptRoot
    }
}

$ResolvedPluginPath = (Resolve-Path $PluginPath).Path
if (-not (Test-Path (Join-Path $ResolvedPluginPath "package.json"))) {
    Write-Color "[ERRORE] Impossibile trovare package.json del plugin in '$ResolvedPluginPath'!" "Red"
    exit 1
}
Write-Color "[INFO] Cartella Plugin: $ResolvedPluginPath" "Gray"

$DefaultCompanyCandidate = "C:\Users\admmaps\superset_6_1_0\superset"
$DefaultCandidate = if (Test-Path $DefaultCompanyCandidate) { $DefaultCompanyCandidate } else { "D:\Sviluppo\superset" }

if (-not $SupersetPath) {
    $Candidates = @(
        $DefaultCompanyCandidate,
        "D:\Sviluppo\superset",
        (Join-Path $ResolvedPluginPath "..\superset"),
        (Join-Path $ResolvedPluginPath "..\apache-superset"),
        (Join-Path $env:USERPROFILE "superset_6_1_0\superset"),
        (Join-Path $env:USERPROFILE "superset"),
        (Join-Path $env:USERPROFILE "Projects\superset")
    )

    foreach ($cand in $Candidates) {
        if ($cand -and (Test-Path (Join-Path $cand "superset-frontend\package.json"))) {
            $SupersetPath = (Resolve-Path $cand).Path
            Write-Color "[INFO] Trovata installazione Superset automatica: $SupersetPath" "Green"
            break
        }
    }
}

if (-not $SupersetPath) {
    if ($Force) {
        $SupersetPath = $DefaultCandidate
    } else {
        Write-Color "Inserisci il percorso della cartella radice di Apache Superset" "Yellow"
        Write-Color "[Default: $DefaultCandidate]:" "Gray"
        $InputPath = Read-Host "Percorso Superset"
        if ([string]::IsNullOrWhiteSpace($InputPath)) {
            $SupersetPath = $DefaultCandidate
        } else {
            $SupersetPath = $InputPath.Trim('"', "'").Trim()
        }
    }
}

if (-not (Test-Path $SupersetPath)) {
    Write-Color "[ERRORE] Il percorso specificato '$SupersetPath' non esiste!" "Red"
    exit 1
}

$ResolvedSupersetPath = (Resolve-Path $SupersetPath).Path
$FrontendDir = Join-Path $ResolvedSupersetPath "superset-frontend"

if (-not (Test-Path (Join-Path $FrontendDir "package.json"))) {
    Write-Color "[ERRORE] 'superset-frontend\package.json' non trovato in '$ResolvedSupersetPath'!" "Red"
    exit 1
}
Write-Color "[INFO] Cartella Target Superset: $ResolvedSupersetPath" "Green"
Write-Color "[INFO] Cartella superset-frontend: $FrontendDir" "Gray"
Write-Color ""

if (-not $SkipBuild) {
    Write-Color "=== FASE 1: Verifica Bundle e Sorgenti Plugin ===" "Cyan"
    $EsmDir = Join-Path $ResolvedPluginPath "esm"
    $LibDir = Join-Path $ResolvedPluginPath "lib"
    if ((Test-Path $EsmDir) -or (Test-Path $LibDir)) {
        Write-Color "[OK] Bundle compilati rilevati (esm/lib). Installazione istantanea senza download dipendenze." "Green"
    } else {
        Write-Color "[OK] Sorgenti 'src/' pronti. Superset li compilera' direttamente tramite Webpack." "Green"
    }
    Write-Color ""
}

Write-Color "=== FASE 2: Copia e Sincronizzazione Plugin ===" "Cyan"
$PluginsTargetRoot = Join-Path $FrontendDir "plugins"
if (-not (Test-Path $PluginsTargetRoot)) {
    New-Item -ItemType Directory -Path $PluginsTargetRoot -Force | Out-Null
}

$DestPluginDir = Join-Path $PluginsTargetRoot "superset-plugin-chart-calendar-filter"
if (Test-Path $DestPluginDir) {
    Write-Color "[INFO] Pulizia versione precedente in '$DestPluginDir'..." "Yellow"
    try {
        Remove-Item -Recurse -Force $DestPluginDir -ErrorAction Stop
    } catch {
        Start-Sleep -Milliseconds 300
        Remove-Item -Recurse -Force $DestPluginDir -ErrorAction SilentlyContinue
    }
}

New-Item -ItemType Directory -Path $DestPluginDir -Force | Out-Null

$ItemsToCopy = @("src", "esm", "lib", "package.json", "tsconfig.json", "README.md")
foreach ($item in $ItemsToCopy) {
    $srcItem = Join-Path $ResolvedPluginPath $item
    if (Test-Path $srcItem) {
        $destItem = Join-Path $DestPluginDir $item
        $isDir = (Get-Item $srcItem) -is [System.IO.DirectoryInfo]
        if ($isDir) {
            Copy-Item -Path $srcItem -Destination $DestPluginDir -Recurse -Force
            Write-Color "  [+] Copiata cartella: $item" "Gray"
        } else {
            Copy-Item -Path $srcItem -Destination $destItem -Force
            Write-Color "  [+] Copiato file:     $item" "Gray"
        }
    }
}
Write-Color "[SUCCESS] Plugin copiato con successo in '$DestPluginDir'" "Green"
Write-Color ""

Write-Color "=== FASE 3: Registrazione in MainPreset.ts ===" "Cyan"
$PresetCandidates = @(
    (Join-Path $FrontendDir "src\visualizations\presets\MainPreset.ts"),
    (Join-Path $FrontendDir "src\visualizations\presets\MainPreset.js")
)

$PresetFile = $null
foreach ($pf in $PresetCandidates) {
    if (Test-Path $pf) {
        $PresetFile = $pf
        break
    }
}

if ($PresetFile) {
    $Content = [System.IO.File]::ReadAllText($PresetFile, [System.Text.Encoding]::UTF8)
    $TargetImport = "import { CalendarFilterPlugin } from '../../../plugins/superset-plugin-chart-calendar-filter/src';"
    $TargetRegister = "        new CalendarFilterPlugin().configure({ key: 'calendar_filter' }),`n        new CalendarFilterPlugin().configure({ key: 'superset-plugin-chart-calendar-filter' }),"

    $NL = "`n"
    if ($Content -match "`r`n") { $NL = "`r`n" }

    $lines = [System.Collections.Generic.List[string]]::new($Content -split "\r?\n")
    if ($Content -notmatch 'from\s+[\x27\x22]\.\./\.\./\.\./plugins/superset-plugin-chart-calendar-filter') {
        $lastImportIdx = -1
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match '^import\s+') { $lastImportIdx = $i }
        }
        if ($lastImportIdx -ge 0) {
            $lines.Insert($lastImportIdx + 1, $TargetImport)
        } else {
            $lines.Insert(0, $TargetImport)
        }
    } else {
        # Update existing import line to named CalendarFilterPlugin
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match 'from\s+[\x27\x22]\.\./\.\./\.\./plugins/superset-plugin-chart-calendar-filter') {
                $lines[$i] = $TargetImport
                break
            }
        }
    }

    $finalLines = [System.Collections.Generic.List[string]]::new()
    $pluginsIdx = -1
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        if ($line -match 'new\s+(SupersetPluginChartCalendarFilter|CalendarFilterPlugin)') { continue }
        $finalLines.Add($line)
        if ($line -match 'plugins\s*:\s*\[') { $pluginsIdx = $finalLines.Count }
    }
    if ($pluginsIdx -ge 0) {
        $finalLines.Insert($pluginsIdx, $TargetRegister)
    }

    $NewContent = $finalLines -join $NL
    [System.IO.File]::WriteAllText($PresetFile, $NewContent, [System.Text.UTF8Encoding]::new($false))
    Write-Color "[SUCCESS] MainPreset.ts registrato con successo (key: 'calendar_filter')." "Green"
}

if (-not $SkipCleanCache) {
    Write-Color "=== FASE 4: Pulizia Cache Frontend Webpack ===" "Cyan"
    $CacheDirs = @(
        (Join-Path $FrontendDir "node_modules\.cache"),
        (Join-Path $FrontendDir ".cache")
    )
    foreach ($cd in $CacheDirs) {
        if (Test-Path $cd) {
            try {
                Remove-Item -Recurse -Force $cd -ErrorAction SilentlyContinue
                Write-Color "[SUCCESS] Svuotata cache in: $cd" "Green"
            } catch {
                Write-Color "[WARN] Impossibile svuotare $($cd): $_" "Yellow"
            }
        }
    }
}

Write-Color "================================================================" "Green"
Write-Color "   Installazione Plugin Calendar Filter completata!             " "Green"
Write-Color "================================================================" "Green"
