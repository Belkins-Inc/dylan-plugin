@echo off
rem dylan on Windows (cmd and PowerShell): the same as bin/dylan.
setlocal
set "plugin=%~dp0.."
if defined DYLAN_CLI (set "cli=%DYLAN_CLI%") else if exist "%plugin%\cli\cli.ts" (set "cli=%plugin%\cli\cli.ts") else (set "cli=%plugin%\..\..\packages\dylan\src\cli.ts")
where node >nul 2>nul || (echo dylan: Node.js is not installed 1>&2 & echo hint: install Node.js 22.18 or newer from https://nodejs.org 1>&2 & exit /b 2)
node --disable-warning=ExperimentalWarning "%cli%" %*
