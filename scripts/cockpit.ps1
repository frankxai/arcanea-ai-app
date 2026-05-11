#requires -Version 7.0
<#
.SYNOPSIS
  Boot the local Arcanea cockpit — both daemons running, browser open to /room.

.DESCRIPTION
  Wires SIS voice-operator (wake-word + dispatch fleet, port 7373) and the
  Arcanea web app (Next dev, port 3000) into one cockpit. The room is opened
  with ?via=local so chat routes through voice-operator's brain instead of
  cloud /api/ai/chat — packets are logged, the dispatch fleet is reachable,
  and approval gates apply.

  Idempotent: skips daemons that are already up. Safe to re-run.

.PARAMETER Persona
  Which room persona to open. Default: jarvis. One of:
  jarvis, lumina, draconia, lyria, alera, shinkami, nero.

.PARAMETER SkipBrowser
  Don't open the browser at the end. Useful when running headless.

.PARAMETER VoiceOperatorRoot
  Path to SIS voice-operator dir. Default: ~/Starlight-Intelligence-System/private/voice-operator

.EXAMPLE
  .\scripts\cockpit.ps1
  Boots both daemons, opens http://localhost:3000/room/jarvis?via=local

.EXAMPLE
  .\scripts\cockpit.ps1 -Persona lumina
  Same, but opens Lumina's room.
#>

[CmdletBinding()]
param(
  [ValidateSet('jarvis', 'lumina', 'draconia', 'lyria', 'alera', 'shinkami', 'nero')]
  [string]$Persona = 'jarvis',

  [switch]$SkipBrowser,

  [string]$VoiceOperatorRoot = "$HOME\Starlight-Intelligence-System\private\voice-operator",

  [string]$WebRoot = (Join-Path $PSScriptRoot '..\apps\web')
)

$ErrorActionPreference = 'Stop'

function Test-PortListening {
  param([int]$Port)
  $conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  return [bool]$conn
}

function Wait-ForPort {
  param([int]$Port, [int]$TimeoutSec = 30, [string]$Label = 'service')
  $deadline = (Get-Date).AddSeconds($TimeoutSec)
  while ((Get-Date) -lt $deadline) {
    if (Test-PortListening -Port $Port) { return $true }
    Start-Sleep -Milliseconds 500
  }
  Write-Warning "$Label did not bind to :$Port within ${TimeoutSec}s"
  return $false
}

Write-Host ''
Write-Host '  ARCANEA COCKPIT' -ForegroundColor Cyan
Write-Host '  -----------------' -ForegroundColor DarkGray
Write-Host ''

# --- SIS voice-operator (:7373) --------------------------------------------
if (Test-PortListening -Port 7373) {
  Write-Host '  [OK]   voice-operator already up on :7373' -ForegroundColor Green
} else {
  $runScript = Join-Path $VoiceOperatorRoot 'run.ps1'
  if (-not (Test-Path $runScript)) {
    Write-Warning "voice-operator run.ps1 not found at $runScript"
    Write-Host '  Falling back to cloud chat. Cognition bridge will be unavailable.' -ForegroundColor Yellow
  } else {
    Write-Host '  [..]   starting voice-operator...' -ForegroundColor Yellow
    Start-Process pwsh -ArgumentList '-NoLogo', '-NoProfile', '-File', $runScript -WorkingDirectory $VoiceOperatorRoot -WindowStyle Minimized
    if (Wait-ForPort -Port 7373 -TimeoutSec 30 -Label 'voice-operator') {
      Write-Host '  [OK]   voice-operator up on :7373' -ForegroundColor Green
    }
  }
}

# --- Arcanea web (:3000) ---------------------------------------------------
if (Test-PortListening -Port 3000) {
  Write-Host '  [OK]   apps/web already up on :3000' -ForegroundColor Green
} else {
  if (-not (Test-Path $WebRoot)) {
    throw "apps/web not found at $WebRoot"
  }
  Write-Host '  [..]   starting pnpm dev...' -ForegroundColor Yellow
  Start-Process pwsh -ArgumentList '-NoLogo', '-NoProfile', '-Command', "pnpm --dir `"$WebRoot`" run dev" -WorkingDirectory $WebRoot
  if (Wait-ForPort -Port 3000 -TimeoutSec 90 -Label 'apps/web') {
    Write-Host '  [OK]   apps/web up on :3000' -ForegroundColor Green
  }
}

# --- Open the room ---------------------------------------------------------
$url = "http://localhost:3000/room/$Persona`?via=local"
Write-Host ''
Write-Host "  Room: $url" -ForegroundColor White
Write-Host '  Bridge: 127.0.0.1:7373/api/utterance' -ForegroundColor DarkGray
Write-Host '  Speak with Space. M to mute. Esc to stop.' -ForegroundColor DarkGray
Write-Host ''

if (-not $SkipBrowser) {
  Start-Process $url
}
