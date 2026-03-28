param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Args
)

$ErrorActionPreference = "Stop"

if ($Args.Count -eq 0) {
    Write-Host ""
    Write-Host "   Arcanea launcher" -ForegroundColor Cyan
    Write-Host "   Use 'arc cla' to launch Claude in guarded WSL mode." -ForegroundColor DarkGray
    Write-Host "   Use 'arc cla -Diag' for diagnostics." -ForegroundColor DarkGray
    Write-Host "   Use 'arc cla -Bare' to isolate project config." -ForegroundColor DarkGray
    Write-Host "   Use 'arc codex' to launch Codex from Windows." -ForegroundColor DarkGray
    Write-Host ""
    exit 0
}

$command = $Args[0].ToLowerInvariant()
$remaining = @()
if ($Args.Count -gt 1) {
    $remaining = $Args[1..($Args.Count - 1)]
}

switch ($command) {
    "cla" {
        & "$PSScriptRoot\claude-launcher.ps1" @remaining
        exit $LASTEXITCODE
    }
    "claude" {
        & "$PSScriptRoot\claude-launcher.ps1" @remaining
        exit $LASTEXITCODE
    }
    "codex" {
        Set-Location "C:\Users\frank\Arcanea"
        codex --dangerously-bypass-approvals-and-sandbox @remaining
        exit $LASTEXITCODE
    }
    default {
        Write-Error "Unknown Arcanea command '$command'. Supported: cla, claude, codex."
    }
}
