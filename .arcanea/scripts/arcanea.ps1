param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $CommandArgs
)

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path

function Invoke-ArcaneaOpencode {
    & (Join-Path $PSScriptRoot "arcanea-opencode.ps1") @args
}

function Invoke-ArcaneaClaude {
    & (Join-Path $PSScriptRoot "claude-launcher.ps1") @args
}

function Get-SISSnapshotPath {
    return (Join-Path $repoRoot ".arcanea\sis\snapshot.json")
}

function Write-SISStatusLine {
    $snapshotPath = Get-SISSnapshotPath
    if (Test-Path $snapshotPath) {
        try {
            $snapshot = Get-Content $snapshotPath -Raw | ConvertFrom-Json
            $totalVaultEntries = 0
            foreach ($vaultName in $snapshot.vaults.PSObject.Properties.Name) {
                $totalVaultEntries += @($snapshot.vaults.$vaultName).Count
            }
            $patternCount = @($snapshot.patterns).Count
            $sessionFile = if ($snapshot.latestSession) { $snapshot.latestSession.file } else { "none" }
            Write-Host "SIS:            $totalVaultEntries entries, $patternCount patterns, latest eval $sessionFile" -ForegroundColor White
        } catch {
            Write-Host "SIS:            snapshot unreadable" -ForegroundColor DarkYellow
        }
    } else {
        Write-Host "SIS:            snapshot not generated yet" -ForegroundColor DarkYellow
    }
}

if (-not $CommandArgs -or $CommandArgs.Count -eq 0) {
    Write-Host ""
    Write-Host "Arcanea command center" -ForegroundColor Cyan
    Write-Host "Root: $repoRoot" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "Available commands:" -ForegroundColor Yellow
    Write-Host "  arcanea status" -ForegroundColor White
    Write-Host "  arcanea sis" -ForegroundColor White
    Write-Host "  arcanea opencode [args...]" -ForegroundColor White
    Write-Host "  arcanea claude [args...]" -ForegroundColor White
    Write-Host "  arcanea repo" -ForegroundColor White
    Write-Host ""
    exit 0
}

$command = $CommandArgs[0].ToLowerInvariant()
$remaining = if ($CommandArgs.Count -gt 1) { $CommandArgs[1..($CommandArgs.Count - 1)] } else { @() }

switch ($command) {
    "status" {
        Write-Host ""
        Write-Host "Arcanea workspace status" -ForegroundColor Cyan
        Write-Host "Main repo:      $repoRoot" -ForegroundColor White
        Write-Host "Arcanea Code:   $(Join-Path $repoRoot 'arcanea-code')" -ForegroundColor White
        Write-Host "OpenCode CLI:   $(Join-Path $repoRoot 'arcanea-opencode')" -ForegroundColor White
        Write-Host "SIS summary:    $(Join-Path $repoRoot '.arcanea\sis\summary.md')" -ForegroundColor White
        Write-SISStatusLine
        Write-Host ""
        if (Test-Path (Join-Path $repoRoot "arcanea-opencode\bin\arcanea-opencode.js")) {
            & (Join-Path $PSScriptRoot "arcanea-opencode.ps1") status
        }
        exit $LASTEXITCODE
    }
    "sis" {
        if ($remaining.Count -eq 0) {
            & (Join-Path $PSScriptRoot "sis-bootstrap.ps1") -ShowStats
        } else {
            $sisCommand = $remaining[0].ToLowerInvariant()
            $sisRest = if ($remaining.Count -gt 1) { $remaining[1..($remaining.Count - 1)] } else { @() }
            switch ($sisCommand) {
                "open" { & (Join-Path $PSScriptRoot "sis-bootstrap.ps1") -OpenSummary }
                "summary" { & (Join-Path $PSScriptRoot "sis-bootstrap.ps1") }
                "json" { & (Join-Path $PSScriptRoot "sis-bootstrap.ps1") -Json }
                "sync" { & (Join-Path $PSScriptRoot "sis-bootstrap.ps1") -Quiet }
                "stats" { & (Join-Path $PSScriptRoot "sis-bootstrap.ps1") -ShowStats }
                default { & (Join-Path $PSScriptRoot "sis-bootstrap.ps1") -ShowStats @sisRest }
            }
        }
        exit $LASTEXITCODE
    }
    "repo" {
        Push-Location $repoRoot
        try {
            git remote -v
        } finally {
            Pop-Location
        }
        exit $LASTEXITCODE
    }
    "opencode" { Invoke-ArcaneaOpencode @remaining; exit $LASTEXITCODE }
    "arcanea-opencode" { Invoke-ArcaneaOpencode @remaining; exit $LASTEXITCODE }
    "claude" { Invoke-ArcaneaClaude @remaining; exit $LASTEXITCODE }
    default {
        Invoke-ArcaneaOpencode @CommandArgs
        exit $LASTEXITCODE
    }
}
