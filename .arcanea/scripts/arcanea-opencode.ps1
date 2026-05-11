param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $CommandArgs
)

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$entrypoint = Join-Path $repoRoot "arcanea-opencode\bin\arcanea-opencode.js"
$bridgeScript = Join-Path $repoRoot "scripts\generate-codex-claude-bridge.mjs"

if (-not (Test-Path $entrypoint)) {
    Write-Error "Arcanea OpenCode entrypoint not found: $entrypoint"
    exit 1
}

Push-Location $repoRoot
try {
    if (Test-Path $bridgeScript) {
        node $bridgeScript | Out-Null
    }
    bun $entrypoint @CommandArgs
    exit $LASTEXITCODE
} finally {
    Pop-Location
}
