@echo off
title Calendar Filter Demo Runner
echo ===================================================
echo   Superset Plugin: Calendar Filter Chart Demo
echo ===================================================
echo.
echo Building demo bundle...
call npx esbuild demo/demo-wrapper.tsx --bundle --outfile=demo/demo-bundle.js --format=iife --global-name=CalendarFilterDemo --define:process.env.NODE_ENV=\"production\"

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Demo bundle build failed.
    pause
    exit /b %errorlevel%
)

echo.
echo [SUCCESS] Demo bundle created successfully!
echo Opening demo/index.html in browser...
start "" "%~dp0demo\index.html"
echo.
