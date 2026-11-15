# Sets up Dylan for Claude Code on Windows, with no WSL. In PowerShell:
#
#   irm https://raw.githubusercontent.com/Belkins-Inc/dylan-plugin/main/install.ps1 | iex
#
# Installs what is missing (Node 24, Git, Claude Code), then Dylan's plugin, puts the dylan command
# on the PATH and, in a console, signs it in through the browser. Every step checks first, so
# running it again only finishes what is left.
$ErrorActionPreference = 'Stop'

$Marketplace = Join-Path $HOME '.claude\plugins\marketplaces\dylan'
$LocalBin = Join-Path $HOME '.local\bin'

function Step($text) { Write-Host "==> $text" -ForegroundColor Cyan }
function Have($name) { [bool](Get-Command $name -ErrorAction SilentlyContinue) }
function Refresh-Path {
  $env:Path = @(
    [Environment]::GetEnvironmentVariable('Path', 'Machine'),
    [Environment]::GetEnvironmentVariable('Path', 'User'),
    $LocalBin
  ) -join ';'
}
function Winget($id) {
  if (-not (Have winget)) {
    throw "winget is missing: install 'App Installer' from the Microsoft Store, then run this again"
  }
  winget install --id $id --exact --silent --accept-package-agreements --accept-source-agreements
  Refresh-Path
}
# Node's version as major*100+minor (22.18 is 2218), 0 without Node.
function Node-Version {
  if (-not (Have node)) { return 0 }
  if ((node -v) -match '^v(\d+)\.(\d+)') { return [int]$Matches[1] * 100 + [int]$Matches[2] }
  return 0
}

Step 'Node.js 22.18 or newer'
if ((Node-Version) -lt 2218) { Winget 'OpenJS.NodeJS.LTS' }
if ((Node-Version) -lt 2218) {
  throw "node on the PATH is still $(node -v): remove the old Node, open a new PowerShell and run this again"
}

Step 'Git'
if (-not (Have git)) { Winget 'Git.Git' }

Step 'Claude Code'
if (-not (Have claude)) {
  Invoke-RestMethod https://claude.ai/install.ps1 | Invoke-Expression
  Refresh-Path
}
if (-not (Have claude)) { throw 'claude is not on the PATH: open a new PowerShell and run this again' }

Step "Dylan's plugin"
if (Test-Path $Marketplace) {
  claude plugin marketplace update dylan
} else {
  claude plugin marketplace add Belkins-Inc/dylan-plugin
}
claude plugin install dylan@dylan
$Bin = Join-Path $Marketplace 'plugin\bin'
if (-not (Test-Path (Join-Path $Bin 'dylan.cmd'))) { throw "the plugin did not install: no $Bin\dylan.cmd" }

Step 'The dylan command on the PATH'
New-Item -ItemType Directory -Force -Path $LocalBin | Out-Null
Set-Content -Path (Join-Path $LocalBin 'dylan.cmd') -Value "@`"$Bin\dylan.cmd`" %*" -Encoding ASCII
$UserPath = [Environment]::GetEnvironmentVariable('Path', 'User')
if (-not (($UserPath -split ';') -contains $LocalBin)) {
  [Environment]::SetEnvironmentVariable('Path', (@($UserPath, $LocalBin) | Where-Object { $_ }) -join ';', 'User')
}
Refresh-Path

Step 'Sign in to Dylan'
# cmd swallows the output: Windows PowerShell would turn a native command's redirected stderr into
# an error that stops the script.
cmd /c 'dylan whoami >nul 2>&1'
if ($LASTEXITCODE -eq 0) {
  Write-Host 'Already signed in.'
} elseif ([Console]::IsOutputRedirected) {
  Write-Host 'Run "dylan login" to sign in.'
} else {
  dylan login
  if ($LASTEXITCODE -ne 0) { throw 'dylan login did not finish: run "dylan login" again' }
}

Write-Host ''
Write-Host 'Done. Open Claude Code and say: "Let''s work on my Dylan project".' -ForegroundColor Green
