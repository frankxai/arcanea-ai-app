param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $CommandArgs
)

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$arcaneaCodeRoot = Join-Path $repoRoot "arcanea-code"
$arcaneaConfigDir = Join-Path $arcaneaCodeRoot ".arcanea"
$ohMyArcaneaRoot = Join-Path $repoRoot "oh-my-arcanea"
$localCli = Join-Path $repoRoot "oh-my-arcanea\src\cli\index.ts"
$shim = Join-Path $env:APPDATA "npm\oh-my-arcanea.ps1"

if (Test-Path $arcaneaConfigDir) {
    $env:ARCANEA_CONFIG_DIR = $arcaneaConfigDir
    $env:OPENCODE_CONFIG_DIR = $arcaneaConfigDir
}

Push-Location $(if (Test-Path $ohMyArcaneaRoot) { $ohMyArcaneaRoot } else { $repoRoot })
try {
    if (Test-Path $localCli) {
        bun $localCli @CommandArgs
    }
    elseif (Test-Path $shim) {
        & $shim @CommandArgs
    }
    else {
        Write-Error "oh-my-arcanea is neither available locally nor installed in $env:APPDATA\\npm"
        exit 1
    }
    exit $LASTEXITCODE
} finally {
    Pop-Location
}
