param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $CommandArgs
)

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$entrypoint = Join-Path $repoRoot "arcanea-flow\v3\@arcanea-flow\cli\bin\cli.js"

if (-not (Test-Path $entrypoint)) {
    Write-Error "Arcanea Flow entrypoint not found: $entrypoint"
    Write-Error "Run 'npm --prefix C:\Users\frank\Arcanea\arcanea-flow run build' first."
    exit 1
}

Push-Location (Join-Path $repoRoot "arcanea-flow")
try {
    & node $entrypoint @CommandArgs
    exit $LASTEXITCODE
} finally {
    Pop-Location
}
