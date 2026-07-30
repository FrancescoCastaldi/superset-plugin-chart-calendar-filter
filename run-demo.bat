@echo off
title Calendar Filter Demo Runner
cd /d "%~dp0"

echo ===================================================
echo   Superset Plugin: Calendar Filter Chart Demo
echo ===================================================
echo.
echo Building demo bundle...
call npx esbuild demo/demo-wrapper.tsx --bundle --outfile=demo/demo-bundle.js --format=iife --global-name=CalendarFilterDemo

if %errorlevel% neq 0 (
    echo.
    echo [NOTE] Build step skipped or offline. Launching with pre-compiled demo-bundle.js...
) else (
    echo.
    echo [SUCCESS] Fresh demo bundle created!
)

echo Opening demo/index.html in browser...
start "" "%~dp0demo\index.html"
echo.
