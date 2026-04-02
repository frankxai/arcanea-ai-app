param(
    [switch] $OpenSummary,
    [switch] $ShowStats,
    [switch] $Quiet,
    [switch] $Json
)

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$summaryPath = Join-Path $repoRoot ".arcanea\sis\summary.md"
$snapshotPath = Join-Path $repoRoot ".arcanea\sis\snapshot.json"

Push-Location $repoRoot
try {
    if ($Quiet) {
        node .\scripts\sis-context-bridge.mjs | Out-Null
    } else {
        node .\scripts\sis-context-bridge.mjs | Out-Host
    }

    if ($ShowStats) {
        $reqs = @(
            '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}',
            '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"sis_stats","arguments":{}}}'
        )
        if ($Quiet) {
            $reqs | node .\scripts\sis-mcp-server.mjs | Out-Null
        } else {
            $reqs | node .\scripts\sis-mcp-server.mjs | Out-Host
        }
    }

    if ($OpenSummary -and (Test-Path $summaryPath)) {
        Start-Process $summaryPath | Out-Null
    } elseif ($Json -and (Test-Path $snapshotPath)) {
        Get-Content $snapshotPath | Out-Host
    } elseif ((-not $Quiet) -and (Test-Path $summaryPath)) {
        Get-Content $summaryPath | Out-Host
    }
} finally {
    Pop-Location
}
