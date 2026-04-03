#!/usr/bin/env pwsh
param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $CommandArgs
)

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..")).Path
$voiceOs = Join-Path $repoRoot ".arcanea\voice\arcanea-voice.ps1"

if (-not (Test-Path $voiceOs)) {
    Write-Error "Arcanea Voice OS not found: $voiceOs"
    exit 1
}

Push-Location $repoRoot
try {
    & $voiceOs @CommandArgs
    exit $LASTEXITCODE
} finally {
    Pop-Location
}
