$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$CommandArgs = @($args)

function Invoke-ArcaneaOpencode {
    & (Join-Path $PSScriptRoot "arcanea-opencode.ps1") @args
}

function Invoke-ArcaneaClaude {
    & (Join-Path $PSScriptRoot "claude-launcher.ps1") @args
}

if (-not $CommandArgs -or $CommandArgs.Count -eq 0) {
    Write-Host ""
    Write-Host "Arcanea command center" -ForegroundColor Cyan
    Write-Host "Root: $repoRoot" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "Available commands:" -ForegroundColor Yellow
    Write-Host "  arcanea status" -ForegroundColor White
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
        Write-Host ""
        if (Test-Path (Join-Path $repoRoot "arcanea-opencode\bin\arcanea-opencode.js")) {
            & (Join-Path $PSScriptRoot "arcanea-opencode.ps1") status
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
