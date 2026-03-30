param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $CommandArgs
)

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$entrypoint = Join-Path $repoRoot "arcanea-opencode\bin\arcanea-opencode.js"

if (-not (Test-Path $entrypoint)) {
    Write-Error "Arcanea OpenCode entrypoint not found: $entrypoint"
    exit 1
}

Push-Location $repoRoot
try {
    bun $entrypoint @CommandArgs
    exit $LASTEXITCODE
} finally {
    Pop-Location
}
