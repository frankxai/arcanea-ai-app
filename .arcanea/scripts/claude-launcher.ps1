# Arcanea Claude Launcher — opens Claude Code in Arcanea folder with yolo mode
# Usage: cla (alias defined in PowerShell profile)

$arcanea = "C:\Users\frank\Arcanea"
$env:STARLIGHT_HOME = "C:\Users\frank\.starlight"
$env:STARLIGHT_BRIDGE_OUT = "C:\Users\frank\Arcanea\.arcanea\sis"
$sisBootstrap = "C:\Users\frank\Arcanea\.arcanea\scripts\sis-bootstrap.ps1"

Push-Location $arcanea
try {
    if (Test-Path $sisBootstrap) {
        & $sisBootstrap -Quiet | Out-Null
    }
    claude --dangerously-skip-permissions @args
} finally {
    Pop-Location
}
