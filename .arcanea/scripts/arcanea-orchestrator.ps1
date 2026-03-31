param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Args
)

$repoRoot = "C:\Users\frank\Arcanea\arcanea-orchestrator"
$entry = Join-Path $repoRoot "packages\cli\dist\index.js"

if (-not (Test-Path $entry)) {
    Write-Error "Arcanea Orchestrator CLI is not built. Expected entrypoint at $entry"
    exit 1
}

& node $entry @Args
exit $LASTEXITCODE
