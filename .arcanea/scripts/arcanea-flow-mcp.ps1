param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $CommandArgs
)

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$entrypoint = Join-Path $repoRoot "arcanea-flow\node_modules\.bin\arcanea-flow-mcp.cmd"

if (-not (Test-Path $entrypoint)) {
    Write-Error "Arcanea Flow MCP entrypoint not found: $entrypoint"
    Write-Error "Run 'npm install' in C:\Users\frank\Arcanea\arcanea-flow first."
    exit 1
}

Push-Location (Join-Path $repoRoot "arcanea-flow")
try {
    & $entrypoint @CommandArgs
    exit $LASTEXITCODE
} finally {
    Pop-Location
}
