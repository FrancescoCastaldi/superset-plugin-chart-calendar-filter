@echo off
REM Calendar Filter Chart Plugin Installer Runner
echo Avvio installazione Calendar Filter Chart Plugin per Apache Superset...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install-plugin.ps1" %*
pause
