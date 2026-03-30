param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $CommandArgs
)

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$opencodeRoot = Join-Path $repoRoot "arcanea-code\packages\opencode"
$sourceEntry = Join-Path $opencodeRoot "src\index.ts"

if (-not (Test-Path $sourceEntry)) {
    Write-Error "Arcanea Code source entrypoint not found: $sourceEntry"
    exit 1
}

Push-Location $repoRoot
try {
    bun run --cwd $opencodeRoot --conditions=browser src/index.ts @CommandArgs
    exit $LASTEXITCODE
} finally {
    Pop-Location
}
