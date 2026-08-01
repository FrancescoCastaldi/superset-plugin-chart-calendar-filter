@echo off
setlocal enabledelayedexpansion

title Calendar Filter Plugin - Auto Installer for Superset
echo ================================================================
echo   Calendar Filter Chart Plugin - Automatic Installer
echo   for Apache Superset (drop this file in Superset root folder)
echo ================================================================
echo.

:: ------------------------------------------------------------
:: CONFIGURATION - modify these if needed
:: ------------------------------------------------------------
set PLUGIN_NAME=superset-plugin-chart-calendar-filter
set PLUGIN_KEY=superset-plugin-chart-calendar-filter
set PLUGIN_REPO_NAME=Calendar-Filter-Superset

:: Common locations where the plugin might be found (relative to this script or absolute)
set SEARCH_PATHS=
:: First priority: explicit environment variable override
if "%SUPERSET_PLUGIN_PATH%" neq "" (
    set SEARCH_PATHS=!SEARCH_PATHS! "%SUPERSET_PLUGIN_PATH%"
)
set SEARCH_PATHS=!SEARCH_PATHS! "%~dp0..\%PLUGIN_REPO_NAME%"
set SEARCH_PATHS=!SEARCH_PATHS! "%~dp0..\superset-plugin-chart-calendar-filter"
set SEARCH_PATHS=!SEARCH_PATHS! "%~dp0..\Calendar-Filter-Superset"
set SEARCH_PATHS=!SEARCH_PATHS! "%USERPROFILE%\OneDrive - mapsengineering.com\%PLUGIN_REPO_NAME%"
set SEARCH_PATHS=!SEARCH_PATHS! "%USERPROFILE%\Documents\%PLUGIN_REPO_NAME%"
set SEARCH_PATHS=!SEARCH_PATHS! "%USERPROFILE%\source\repos\%PLUGIN_REPO_NAME%"
set SEARCH_PATHS=!SEARCH_PATHS! "%USERPROFILE%\Projects\%PLUGIN_REPO_NAME%"
set SEARCH_PATHS=!SEARCH_PATHS! "C:\Projects\%PLUGIN_REPO_NAME%"
set SEARCH_PATHS=!SEARCH_PATHS! "D:\Projects\%PLUGIN_REPO_NAME%"

:: ------------------------------------------------------------
:: HELPER FUNCTIONS
:: ------------------------------------------------------------

:CHECK_CMD
set CMD=%1
where %CMD% >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] '%CMD%' not found in PATH. Please install it first.
    exit /b 1
)
echo [OK] %CMD% found
exit /b 0

:FIND_PLUGIN
echo.
echo [SEARCH] Looking for plugin source code...
for %%P in (%SEARCH_PATHS%) do (
    if exist "%%P\package.json" (
        set PLUGIN_ROOT=%%P
        echo [FOUND] Plugin at: !PLUGIN_ROOT!
        goto :PLUGIN_FOUND
    )
)

echo.
echo [ERROR] Plugin source not found in standard locations.
echo.
echo Searched paths:
for %%P in (%SEARCH_PATHS%) do echo   %%P
echo.
echo Please either:
echo   1. Place the plugin folder next to Superset (as sibling folder)
echo   2. Set SUPERSET_PLUGIN_PATH environment variable to the plugin folder
echo   3. Edit this script and add your custom path to SEARCH_PATHS
echo.
pause
exit /b 1

:PLUGIN_FOUND
:: Verify it's the right plugin
for /f "tokens=2 delims=:" %%A in ('findstr /i "\"name\"" "!PLUGIN_ROOT!\package.json"') do (
    set PKG_NAME=%%A
    set PKG_NAME=!PKG_NAME:"=!
    set PKG_NAME=!PKG_NAME:,=!
    set PKG_NAME=!PKG_NAME: =!
)
if "!PKG_NAME!" neq "%PLUGIN_NAME%" (
    echo [WARN] Package name mismatch: expected '%PLUGIN_NAME%', got '!PKG_NAME!'
    echo Continuing anyway...
)

:: ------------------------------------------------------------
:: DETERMINE SUPERSET ROOT (where this script is running from)
:: ------------------------------------------------------------
set SUPERSET_ROOT=%~dp0
:: Remove trailing backslash
if "%SUPERSET_ROOT:~-1%"=="\" set SUPERSET_ROOT=%SUPERSET_ROOT:~0,-1%
set FE_DIR=%SUPERSET_ROOT%\superset-frontend

echo.
echo [INFO] Superset root: %SUPERSET_ROOT%
echo [INFO] Frontend dir:  %FE_DIR%

if not exist "%FE_DIR%\package.json" (
    echo [ERROR] superset-frontend/package.json not found at %FE_DIR%
    echo Make sure this script is in the Superset root folder (where docker-compose.yml is).
    pause
    exit /b 1
)

:: ------------------------------------------------------------
:: CHECK PREREQUISITES
:: ------------------------------------------------------------
echo.
echo [CHECK] Verifying prerequisites...
call :CHECK_CMD node
call :CHECK_CMD npm

:: ------------------------------------------------------------
:: BUILD PLUGIN IF NEEDED
:: ------------------------------------------------------------
echo.
echo [BUILD] Checking plugin build artifacts...
if not exist "!PLUGIN_ROOT!\lib" (
    echo [BUILD] Building plugin (first time or clean)... 
    pushd "!PLUGIN_ROOT!"
    call npm ci
    if errorlevel 1 (
        echo [ERROR] npm ci failed
        popd
        pause
        exit /b 1
    )
    call npm run build
    if errorlevel 1 (
        echo [ERROR] npm run build failed
        popd
        pause
        exit /b 1
    )
    popd
    echo [OK] Plugin built successfully
) else (
    echo [OK] Build artifacts found (lib/ exists)
)

:: ------------------------------------------------------------
:: INSTALL PLUGIN INTO SUPERSET FRONTEND
:: ------------------------------------------------------------
echo.
echo [INSTALL] Installing plugin into Superset frontend...
pushd "%FE_DIR%"

:: Use file: dependency with INSTALL_LINKS=true for Windows compatibility
set NPM_CONFIG_INSTALL_LINKS=true
call npm install --save "!PLUGIN_ROOT!"
if errorlevel 1 (
    echo [ERROR] npm install failed
    popd
    pause
    exit /b 1
)
popd
echo [OK] Plugin installed as file dependency

:: ------------------------------------------------------------
:: REGISTER PLUGIN IN MAINPRESET
:: ------------------------------------------------------------
echo.
echo [REGISTER] Registering plugin in MainPreset...

set PRESET_DIR=%FE_DIR%\src\visualizations\presets
set MAIN_PRESET=
if exist "%PRESET_DIR%\MainPreset.ts" set MAIN_PRESET=%PRESET_DIR%\MainPreset.ts
if exist "%PRESET_DIR%\MainPreset.js" set MAIN_PRESET=%PRESET_DIR%\MainPreset.js

if "%MAIN_PRESET%"=="" (
    echo [WARN] MainPreset.ts/js not found in %PRESET_DIR%
    echo Manual registration required - see instructions below
    goto :MANUAL_REGISTER
)

:: Backup
copy "%MAIN_PRESET%" "%MAIN_PRESET%.bak" >nul
echo [OK] Backed up MainPreset to %MAIN_PRESET%.bak

:: Use PowerShell to do the TypeScript/JS patching (more reliable than pure batch)
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$src = Get-Content '%MAIN_PRESET%' -Raw; ^
     $pluginKey = '%PLUGIN_KEY%'; ^
     if ($src -match 'SupersetPluginChartCalendarFilter' -or $src -match $pluginKey) { ^
         Write-Host '   Plugin already registered; nothing to patch.'; ^
         exit 0 ^
     }; ^
     $importLine = \"import { SupersetPluginChartCalendarFilter } from 'superset-plugin-chart-calendar-filter';\"; ^
     $lines = $src -split \"`n\"; ^
     $lastImport = -1; ^
     for ($i = 0; $i -lt $lines.Count; $i++) { if ($lines[$i] -match '^\s*import\s') { $lastImport = $i } }; ^
     if ($lastImport -ge 0) { $lines = $lines[0..$lastImport] + $importLine + $lines[($lastImport+1)..($lines.Count-1)] } else { $lines = @($importLine) + $lines }; ^
     $src = $lines -join \"`n\"; ^
     $pluginEntry = \"        new SupersetPluginChartCalendarFilter().configure({`n          key: 'superset-plugin-chart-calendar-filter',`n        }),\"; ^
     $inserted = \$false; ^
     $calendarRe = [regex]'new\s+CalendarChartPlugin\(\)\.configure\(\{\s*key:\s*VizType\.Calendar\s*\}\\),?\n?'; ^
     if ($calendarRe.IsMatch($src)) { $src = $calendarRe.Replace($src, '$0' + $pluginEntry + \"`n\", 1); $inserted = \$true } else { $firstPluginRe = [regex]'new\s+\w+Plugin\(\)\.configure\(\{'; $m = $firstPluginRe.Match($src); if ($m.Success) { $src = $src.Substring(0,$m.Index) + $pluginEntry + \"`n\" + $src.Substring($m.Index); $inserted = \$true } }; ^
     if ($inserted) { Set-Content -Path '%MAIN_PRESET%' -Value $src -Encoding UTF8; Write-Host '   Patched %MAIN_PRESET%' } else { Write-Host '   Could not auto-locate plugin array.'; exit 1 }"
if errorlevel 1 (
    echo [WARN] Auto-registration failed. Manual steps needed:
    goto :MANUAL_REGISTER
)
echo [OK] Plugin registered in MainPreset

:: ------------------------------------------------------------
:: OPTIONAL: DOCKER COMPOSE OVERRIDE
:: ------------------------------------------------------------
echo.
set /p DOCKER_CFG="Configure Docker Compose override? (y/N): "
if /i "%DOCKER_CFG%"=="y" (
    echo [DOCKER] Creating docker-compose.override.yml...
    
    :: Find compose file
    set COMPOSE_FILE=
    if exist "%SUPERSET_ROOT%\docker-compose-non-dev.yml" set COMPOSE_FILE=docker-compose-non-dev.yml
    if exist "%SUPERSET_ROOT%\docker-compose.yml" set COMPOSE_FILE=docker-compose.yml
    
    if "%COMPOSE_FILE%"=="" (
        echo [WARN] No docker-compose*.yml found in %SUPERSET_ROOT%
    ) else (
        echo [DOCKER] Using compose file: %COMPOSE_FILE%
        
        :: Convert plugin path to Unix-style for container mount
        set PLUGIN_UNIX=!PLUGIN_ROOT:\=/!
        
        :: Get services from compose
        set SERVICES=
        for /f "delims=" %%S in ('docker compose -f "%SUPERSET_ROOT%\%COMPOSE_FILE%" config --services 2^>nul') do set SERVICES=!SERVICES! %%S
        if "!SERVICES!"=="" set SERVICES=superset superset-node superset-worker superset-worker-beat
        
        :: Generate override
        >"%SUPERSET_ROOT%\docker-compose.override.yml" (
            echo # ---------------------------------------------------------------------------
            echo # Auto-generated Docker Compose override for Calendar Filter plugin
            echo # Generated by install-calendar-filter.bat
            echo # ---------------------------------------------------------------------------
            echo services:
            for %%S in (!SERVICES!) do (
                echo   %%S:
                echo     volumes:
                echo       - !PLUGIN_UNIX!:/Calendar-Filter-Superset:delegated
                echo     environment:
                if "%%S"=="superset-node" (
                    echo       NPM_CONFIG_install_links: 'true'
                ) else (
                    echo       DEV_MODE: 'false'
                )
            )
        )
        echo [OK] Created %SUPERSET_ROOT%\docker-compose.override.yml
        echo [INFO] Start with: docker compose -f %COMPOSE_FILE% up -d
    )
)

:: ------------------------------------------------------------
:: SUCCESS SUMMARY
:: ------------------------------------------------------------
echo.
echo ================================================================
echo  INSTALLATION COMPLETE
echo ================================================================
echo.
echo Plugin:     %PLUGIN_NAME%
echo Installed:  %FE_DIR%
echo.
echo NEXT STEPS:
echo   1. Rebuild frontend:  cd "%FE_DIR%" && npm run dev-server
echo   2. Or with Docker:    docker compose -f %COMPOSE_FILE% up -d
echo   3. Open Superset:     http://localhost:8088
echo   4. Add chart:         + Chart -> "Calendar Filter" (under "Other")
echo.
echo The plugin is now ready to use!
echo.
pause
exit /b 0

:MANUAL_REGISTER
echo.
echo ================================================================
echo  MANUAL REGISTRATION REQUIRED
echo ================================================================
echo.
echo Edit: %MAIN_PRESET%
echo.
echo 1. Add import near the top:
echo    import { SupersetPluginChartCalendarFilter } from 'superset-plugin-chart-calendar-filter';
echo.
echo 2. Inside the preset constructor's 'plugins:' array, add:
echo    new SupersetPluginChartCalendarFilter().configure({
echo      key: 'superset-plugin-chart-calendar-filter',
echo    }),
echo.
echo 3. Rebuild frontend and restart backend.
echo.
pause
exit /b 0