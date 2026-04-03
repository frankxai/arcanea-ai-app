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
    Write-Host "  arcanea agent-os" -ForegroundColor White
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
                "append" { node (Join-Path $repoRoot "scripts\sis-write.mjs") @sisRest }
                "check" { pnpm run sis:check }
                "contracts" { pnpm run sis:contracts }
                "schema-check" { pnpm run sis:schema-check }
                "legacy-sync" { pnpm run sis:legacy-export }
                "open" { & (Join-Path $PSScriptRoot "sis-bootstrap.ps1") -OpenSummary }
                "summary" { & (Join-Path $PSScriptRoot "sis-bootstrap.ps1") }
                "json" { & (Join-Path $PSScriptRoot "sis-bootstrap.ps1") -Quiet -Json }
                "stats-json" { & (Join-Path $PSScriptRoot "sis-bootstrap.ps1") -Quiet -ShowStats -StatsJson }
                "sync" { & (Join-Path $PSScriptRoot "sis-bootstrap.ps1") -Quiet }
                "stats" { & (Join-Path $PSScriptRoot "sis-bootstrap.ps1") -Quiet -ShowStats }
                default {
                    Write-Host "Unknown SIS command: $sisCommand" -ForegroundColor DarkYellow
                    Write-Host "Use: arcanea sis [append|check|contracts|schema-check|legacy-sync|summary|json|stats|stats-json|sync|open]" -ForegroundColor DarkGray
                    exit 1
                }
            }
        }
        exit $LASTEXITCODE
    }
    "agent-os" {
        if ($remaining.Count -eq 0) {
            Write-Host ""
            Write-Host "Arcanea Agent OS" -ForegroundColor Cyan
            Write-Host "Config:          $(Join-Path $repoRoot '.arcanea\config\agent-os.json')" -ForegroundColor White
            Write-Host "Task template:   $(Join-Path $repoRoot '.arcanea\agents\task-contract.template.json')" -ForegroundColor White
            Write-Host "Handoff template:$(Join-Path $repoRoot '.arcanea\agents\handoff-packet.template.json')" -ForegroundColor White
            Write-Host ""
            Write-Host "Use: arcanea agent-os [check|route <repo>|validate-task <file>|validate-handoff <file> [--remember]]" -ForegroundColor DarkGray
        } else {
            $agentArgs = @($remaining)
            $agentCommand = ([string]$agentArgs[0]).ToLowerInvariant()
            $agentRest = @(Get-RemainingArgs -Values $agentArgs -StartIndex 1)
            switch ($agentCommand) {
                "check" { npm run agent-os:check }
                "route" { npx tsx (Join-Path $repoRoot "scripts\agent-os-route.ts") @agentRest }
                "validate-task" { npx tsx (Join-Path $repoRoot "scripts\agent-os-validate-task.ts") @agentRest }
                "validate-handoff" { npx tsx (Join-Path $repoRoot "scripts\agent-os-validate-handoff.ts") @agentRest }
                default {
                    Write-Host "Unknown Agent OS command: $agentCommand" -ForegroundColor DarkYellow
                    Write-Host "Use: arcanea agent-os [check|route|validate-task|validate-handoff]" -ForegroundColor DarkGray
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
