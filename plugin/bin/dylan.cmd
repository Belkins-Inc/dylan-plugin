@echo off
rem dylan on Windows (cmd and PowerShell): the same as bin/dylan.
setlocal
set "plugin=%~dp0.."
if defined DYLAN_CLI (set "cli=%DYLAN_CLI%") else if exist "%plugin%\cli\cli.ts" (set "cli=%plugin%\cli\cli.ts") else (set "cli=%plugin%\..\..\packages\dylan\src\cli.ts")
if not exist "%cli%" goto missing
where node >nul 2>nul || goto nonode
rem TypeScript runs as it is from Node 22.18 on; an older Node would fail on the first import.
node -e "const [a,b]=process.versions.node.split('.').map(Number);process.exit(a>22||(a===22&&b>=18)?0:1)"
if errorlevel 1 goto oldnode
node --disable-warning=ExperimentalWarning "%cli%" %*
exit /b %errorlevel%

:missing
echo dylan: the command is missing from this plugin: "%cli%" 1>&2
echo hint: reinstall the plugin 1>&2
exit /b 2

:nonode
echo dylan: Node.js is not installed 1>&2
echo hint: install Node.js 22.18 or newer from https://nodejs.org, then run the command again 1>&2
exit /b 2

:oldnode
for /f %%v in ('node -p process.versions.node') do echo dylan: Node.js %%v is too old 1>&2
echo hint: install Node.js 22.18 or newer from https://nodejs.org 1>&2
exit /b 2
