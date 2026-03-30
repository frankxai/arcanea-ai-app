param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $CommandArgs
)

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$localCli = Join-Path $repoRoot "oh-my-arcanea\src\cli\index.ts"
$shim = Join-Path $env:APPDATA "npm\oh-my-arcanea.ps1"

Push-Location $repoRoot
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
