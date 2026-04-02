param(
    [switch] $OpenSummary,
    [switch] $ShowStats,
    [switch] $Quiet,
    [switch] $Json
)

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$summaryPath = Join-Path $repoRoot ".arcanea\sis\summary.md"
$snapshotPath = Join-Path $repoRoot ".arcanea\sis\snapshot.json"

function Get-SISSnapshot {
    param(
        [string] $Path
    )

    if (-not (Test-Path $Path)) {
        return $null
    }

    try {
        return Get-Content $Path -Raw | ConvertFrom-Json
    } catch {
        return $null
    }
}

function Get-SISStatsObject {
    param(
        $Snapshot
    )

    if (-not $Snapshot) {
        return $null
    }

    $vaultCounts = [ordered]@{}
    $totalVaultEntries = 0

    foreach ($vaultName in $Snapshot.vaults.PSObject.Properties.Name) {
        $count = @($Snapshot.vaults.$vaultName).Count
        $vaultCounts[$vaultName] = $count
        $totalVaultEntries += $count
    }

    return [ordered]@{
        sisRoot = $Snapshot.sisRoot
        totalVaultEntries = $totalVaultEntries
        vaultCounts = $vaultCounts
        patternCount = @($Snapshot.patterns).Count
        latestEval = if ($Snapshot.latestSession) { $Snapshot.latestSession.file } else { $null }
        generatedAt = $Snapshot.generatedAt
    }
}

Push-Location $repoRoot
try {
    if ($Quiet) {
        node .\scripts\sis-context-bridge.mjs | Out-Null
    } else {
        node .\scripts\sis-context-bridge.mjs | Out-Host
    }

    $snapshot = Get-SISSnapshot -Path $snapshotPath
    $stats = Get-SISStatsObject -Snapshot $snapshot

    if ($ShowStats) {
        if ($Json) {
            if ($stats) {
                $stats | ConvertTo-Json -Depth 6 | Out-Host
            } else {
                Write-Host "{}"
            }
        } elseif ($stats) {
            $latestEval = if ($stats.latestEval) { $stats.latestEval } else { "none" }
            Write-Host "SIS stats" -ForegroundColor Cyan
            Write-Host "Root:            $($stats.sisRoot)" -ForegroundColor White
            Write-Host "Vault entries:   $($stats.totalVaultEntries)" -ForegroundColor White
            Write-Host "Patterns:        $($stats.patternCount)" -ForegroundColor White
            Write-Host "Latest eval:     $latestEval" -ForegroundColor White
            foreach ($vaultName in $stats.vaultCounts.Keys) {
                Write-Host ("  - {0}: {1}" -f $vaultName, $stats.vaultCounts[$vaultName]) -ForegroundColor DarkGray
            }
        } else {
            Write-Host "SIS stats unavailable" -ForegroundColor DarkYellow
        }
    }

    if ($OpenSummary -and (Test-Path $summaryPath)) {
        Start-Process $summaryPath | Out-Null
    } elseif ($Json -and (-not $ShowStats) -and (Test-Path $snapshotPath)) {
        Get-Content $snapshotPath | Out-Host
    } elseif ((-not $Quiet) -and (Test-Path $summaryPath)) {
        Get-Content $summaryPath | Out-Host
    }
} finally {
    Pop-Location
}
