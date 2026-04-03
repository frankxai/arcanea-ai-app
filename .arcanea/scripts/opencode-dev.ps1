param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $CommandArgs
)

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$arcaneaCodeRoot = Join-Path $repoRoot "arcanea-code"
$arcaneaConfigDir = Join-Path $arcaneaCodeRoot ".arcanea"
$opencodeRoot = Join-Path $repoRoot "arcanea-code\packages\opencode"
$sourceEntry = Join-Path $opencodeRoot "src\index.ts"
$sisBootstrap = Join-Path $PSScriptRoot "sis-bootstrap.ps1"

if (-not (Test-Path $sourceEntry)) {
    Write-Error "Arcanea Code source entrypoint not found: $sourceEntry"
    exit 1
}

if (-not (Test-Path $arcaneaConfigDir)) {
    Write-Error "Arcanea config directory not found: $arcaneaConfigDir"
    exit 1
}

$env:ARCANEA_CONFIG_DIR = $arcaneaConfigDir
$env:OPENCODE_CONFIG_DIR = $arcaneaConfigDir
$env:STARLIGHT_HOME = "C:\Users\frank\.starlight"
$env:STARLIGHT_BRIDGE_OUT = Join-Path $repoRoot ".arcanea\sis"

Push-Location $repoRoot
try {
    if (Test-Path $sisBootstrap) {
        & $sisBootstrap -Quiet | Out-Null
    }
    bun run --cwd $opencodeRoot --conditions=browser src/index.ts @CommandArgs
    exit $LASTEXITCODE
} finally {
    Pop-Location
}
