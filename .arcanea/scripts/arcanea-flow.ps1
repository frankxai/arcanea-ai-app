param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $CommandArgs
)

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$bootstrap = Join-Path $repoRoot ".arcanea\scripts\arcanea-flow-bootstrap.mjs"

if (-not (Test-Path $bootstrap)) {
    Write-Error "Arcanea Flow bootstrap not found: $bootstrap"
    Write-Error "Run 'npm --prefix C:\Users\frank\Arcanea\arcanea-flow --workspace v3/@arcanea-flow/cli run build' first."
    exit 1
}

Push-Location (Join-Path $repoRoot "arcanea-flow")
try {
    & node $bootstrap @CommandArgs
    exit $LASTEXITCODE
} finally {
    Pop-Location
}
