param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $CommandArgs
)

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$CommandArgs = @($CommandArgs)

function Get-RemainingArgs {
    param(
        [string[]] $Values,
        [int] $StartIndex
    )

    if (-not $Values -or $Values.Count -le $StartIndex) {
        return @()
    }

    $result = New-Object string[] ($Values.Count - $StartIndex)
    [Array]::Copy($Values, $StartIndex, $result, 0, $Values.Count - $StartIndex)
    return $result
}

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
$remaining = @(Get-RemainingArgs -Values $CommandArgs -StartIndex 1)

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
            $sisArgs = @($remaining)
            $sisCommand = ([string]$sisArgs[0]).ToLowerInvariant()
            $sisRest = @(Get-RemainingArgs -Values $sisArgs -StartIndex 1)
            switch ($sisCommand) {
                "open" { & (Join-Path $PSScriptRoot "sis-bootstrap.ps1") -OpenSummary }
                "summary" { & (Join-Path $PSScriptRoot "sis-bootstrap.ps1") }
                "json" { & (Join-Path $PSScriptRoot "sis-bootstrap.ps1") -Quiet -Json }
                "sync" { & (Join-Path $PSScriptRoot "sis-bootstrap.ps1") -Quiet }
                "stats" { & (Join-Path $PSScriptRoot "sis-bootstrap.ps1") -Quiet -ShowStats }
                default {
                    Write-Host "Unknown SIS command: $sisCommand" -ForegroundColor DarkYellow
                    Write-Host "Use: arcanea sis [summary|json|stats|sync|open]" -ForegroundColor DarkGray
                    exit 1
                }
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
