# Arcanea Claude Launcher — opens Claude Code in Arcanea folder with yolo mode
# Usage: cla (alias defined in PowerShell profile)

$arcanea = "C:\Users\frank\Arcanea"

Push-Location $arcanea
try {
    claude --dangerously-skip-permissions @args
} finally {
    Pop-Location
}
